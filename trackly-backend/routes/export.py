from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from database import get_db
import models
from services.export_utils import make_pdf, make_xlsx

router = APIRouter(prefix="/export", tags=["export"])

@router.get("/pdf/{owner_id}")
def export_pdf(owner_id: int,
               current_user: models.User = Depends(
                   __import__("auth").get_current_user),
               db: Session = Depends(get_db)):
    # allow self or finance
    if current_user.id != owner_id and current_user.role != "finance":
        raise HTTPException(403)
    exps = db.query(models.Expense).filter(
        models.Expense.owner_id==owner_id, models.Expense.status=="approved").all()
    files = [e.image_filename for e in exps]
    path = make_pdf(owner_id, files)
    return {"path": path}

@router.get("/xlsx/{owner_id}")
def export_xlsx(owner_id: int,
                current_user: models.User = Depends(
                    __import__("auth").get_current_user),
                db: Session = Depends(get_db)):
    if current_user.id != owner_id and current_user.role != "finance":
        raise HTTPException(403)
    exps = db.query(models.Expense).filter(
        models.Expense.owner_id==owner_id, models.Expense.status=="approved").all()
    records = [{
        "date": e.date.strftime("%Y-%m-%d"),
        "vendor": e.vendor,
        "amount": e.amount,
        "currency": e.currency,
        "category": e.category,
        "gl_code": e.gl_code,
        "description": e.description,
        "owner_email": e.owner.email
    } for e in exps]
    path = make_xlsx(owner_id, records)
    return {"path": path}
    