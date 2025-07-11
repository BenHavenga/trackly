# routes/expenses.py
from fastapi import APIRouter, Depends, UploadFile, File, HTTPException, status
from sqlalchemy.orm import Session
from database import get_db
import models, schemas
import services.receipt_service as receipt_svc
import services.ocr as ocr
import services.openai_llm as llm
import auth
import shutil
import os
import json
import traceback
from datetime import datetime

router = APIRouter(prefix="/expenses", tags=["expenses"])


@router.post("/upload", response_model=schemas.ExpenseOut, status_code=status.HTTP_201_CREATED)
def upload_expense(
    file: UploadFile = File(...),
    current_user: models.User = Depends(auth.get_current_user),
    db: Session = Depends(get_db),
):
    """
    1) Save file
    2) OCR+LLM → parsed dict with line_items
    3) Persist Expense + LineItem rows
    """
    try:
        # Save upload
        os.makedirs("static/uploads", exist_ok=True)
        file_path = f"static/uploads/{current_user.id}_{file.filename}"
        with open(file_path, "wb") as buf:
            shutil.copyfileobj(file.file, buf)

        # Full parse pipeline
        parsed = receipt_svc.extract_and_parse_receipt(file_path)

        # Parse date
        date_str = parsed.get("date", "")
        try:
            parsed_date = datetime.strptime(date_str, "%d/%m/%Y %H:%M")
        except ValueError:
            parsed_date = datetime.fromisoformat(date_str)

        # Create Expense
        expense = models.Expense(
            owner_id=current_user.id,
            image_filename=os.path.basename(file_path),
            vendor=parsed.get("vendor", ""),
            date=parsed_date,
            amount=parsed.get("total_amount", parsed.get("amount", 0.0)),
            currency=parsed.get("currency", ""),
            category=parsed.get("category", ""),
            gl_code=parsed.get("gl_code") or parsed.get("glCode") or None,
            description=json.dumps(parsed.get("description", {})),
            status="draft",
        )
        db.add(expense)
        db.commit()
        db.refresh(expense)

        # Persist each line item
        for item in parsed.get("line_items", []):
            li = models.LineItem(
                expense_id=expense.id,
                description=item.get("description", ""),
                quantity=item.get("quantity"),
                unit_price=item.get("unit_price"),
                total_price=item.get("total_price", 0.0),
            )
            db.add(li)
        db.commit()

        # Return with items loaded
        db.refresh(expense)
        return expense

    except Exception:
        traceback.print_exc()
        raise HTTPException(
            status_code=500,
            detail="An error occurred while processing your receipt."
        )

@router.get("/me", response_model=list[schemas.ExpenseOut])
def read_my_expenses(
    current_user: models.User = Depends(auth.get_current_user),
    db: Session = Depends(get_db),
):
    """
    Return all expenses owned by the current user.
    """
    return db.query(models.Expense).filter(
        models.Expense.owner_id == current_user.id
    ).all()


# ---------------------
# Draft read / update
# ---------------------

@router.get("/draft/{expense_id}", response_model=schemas.ExpenseOut)
def get_draft_expense(
    expense_id: int,
    current_user: models.User = Depends(auth.get_current_user),
    db: Session = Depends(get_db),
):
    """
    Fetch a single draft (status='draft') for editing.
    """
    exp = db.query(models.Expense).get(expense_id)
    if not exp or exp.owner_id != current_user.id:
        raise HTTPException(status_code=404, detail="Draft not found")
    if exp.status != "draft":
        raise HTTPException(status_code=400, detail="Expense not in draft state")
    return exp

@router.patch("/draft/{expense_id}", response_model=schemas.ExpenseOut)
def update_draft_expense(
    expense_id: int,
    draft_in: schemas.ExpenseUpdate,
    current_user: models.User = Depends(auth.get_current_user),
    db: Session = Depends(get_db),
):
    exp: models.Expense = db.query(models.Expense).get(expense_id)
    if not exp or exp.owner_id != current_user.id:
        raise HTTPException(status_code=404, detail="Draft not found")
    if exp.status != "draft":
        raise HTTPException(status_code=400, detail="Expense not in draft state")

    # 1) Update expense fields
    exp.vendor      = draft_in.vendor
    exp.date        = draft_in.date
    exp.amount      = draft_in.amount
    exp.currency    = draft_in.currency
    exp.category    = draft_in.category
    exp.gl_code     = draft_in.gl_code
    exp.description = draft_in.description

    # 2) Sync line items
    incoming = { item.id: item for item in draft_in.line_items if item.id is not None }
    # Update existing items
    for existing in list(exp.line_items):
        if existing.id in incoming:
            upd = incoming.pop(existing.id)
            existing.description = upd.description
            existing.quantity    = upd.quantity
            existing.unit_price  = upd.unit_price
            existing.total_price = upd.total_price
        else:
            # deleted by user
            db.delete(existing)

    # 3) Create any new items (those with no id)
    for new_item in [i for i in draft_in.line_items if i.id is None]:
        li = models.LineItem(
            expense_id  = exp.id,
            description = new_item.description,
            quantity    = new_item.quantity,
            unit_price  = new_item.unit_price,
            total_price = new_item.total_price,
        )
        db.add(li)

    db.commit()
    db.refresh(exp)
    return exp