# routes/workflow.py

from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from collections import defaultdict
from typing import List

from database import get_db
import models, schemas, auth
from services.approval import get_immediate_manager, get_approval_chain

router = APIRouter(prefix="/workflow", tags=["workflow"])


# ---------------------------------------------------------------------------
# Helpers
# ---------------------------------------------------------------------------

def build_reports(
    exps: List[models.Expense], db: Session
) -> List[schemas.ExpenseReport]:
    """
    Group a flat list of Expense ORM objects into schemas.ExpenseReport blocks
    (one per owner).
    """
    grouped: dict[int, List[models.Expense]] = defaultdict(list)
    for e in exps:
        grouped[e.owner_id].append(e)

    reports: List[schemas.ExpenseReport] = []
    for owner_id, items in grouped.items():
        owner = db.query(models.User).get(owner_id)
        if not owner:
            continue

        reports.append(
            schemas.ExpenseReport(
                owner_id=owner.id,
                user_name=owner.email.split("@")[0],
                user_email=owner.email,
                items_count=len(items),
                total_amount=sum(x.amount for x in items),
                submitted_at=items[0].created_at,
                expenses=[schemas.ExpenseOut.from_orm(x) for x in items],
            )
        )
    return reports


# ---------------------------------------------------------------------------
# Employee submits a DRAFT expense
# ---------------------------------------------------------------------------

@router.post("/{expense_id}/submit", response_model=schemas.ExpenseOut)
def submit_expense(
    expense_id: int,
    current_user: models.User = Depends(auth.get_current_user),
    db: Session = Depends(get_db),
):
    """
    Owner pushes a *draft* expense into the approval chain.
    """
    exp = db.query(models.Expense).get(expense_id)
    if not exp or exp.owner_id != current_user.id:
        raise HTTPException(404, "Expense not found")
    if exp.status != "draft":
        raise HTTPException(400, "Only draft expenses can be submitted")

    mgr = get_immediate_manager(current_user, db)
    if not mgr:
        raise HTTPException(400, "No approver configured for your account")

    # update expense
    exp.approver_id = mgr.id
    exp.status = "submitted"
    exp.updated_by = current_user.id
    db.commit()
    db.refresh(exp)

    # create notifications
    db.add_all([
        models.Notification(
            user_id=current_user.id,
            type="submission",
            title="Expense Submitted",
            message=f"You submitted expense #{exp.id} for approval.",
        ),
        models.Notification(
            user_id=mgr.id,
            type="submission",
            title="New Expense Submitted",
            message=f"{current_user.email} submitted expense #{exp.id}.",
        ),
    ])
    db.commit()

    return exp


# ---------------------------------------------------------------------------
# Approver Dashboard Queries
# ---------------------------------------------------------------------------

@router.get(
    "/pending-reports",
    response_model=List[schemas.ExpenseReport],
    summary="Grouped pending reports for the current approver",
)
def pending_reports_for_me(
    current_user: models.User = Depends(auth.get_current_user),
    db: Session = Depends(get_db),
):
    raw = (
        db.query(models.Expense)
        .filter(
            models.Expense.status == "submitted",
            models.Expense.approver_id == current_user.id,
        )
        .all()
    )
    return build_reports(raw, db)


@router.get(
    "/approved-reports",
    response_model=List[schemas.ExpenseReport],
    summary="Reports the current approver has already signed-off",
)
def approved_reports_for_me(
    current_user: models.User = Depends(auth.get_current_user),
    db: Session = Depends(get_db),
):
    raw = (
        db.query(models.Expense)
        .filter(
            models.Expense.status == "approved",
            models.Expense.approver_id.is_(None),
        )
        .all()
    )
    return build_reports(raw, db)


# ---------------------------------------------------------------------------
# Batch actions on a whole report (by owner_id)
# ---------------------------------------------------------------------------

@router.post(
    "/reports/{owner_id}/approve",
    response_model=List[schemas.ExpenseOut],
    summary="Approve ALL pending items for one employee",
)
def approve_all_report(
    owner_id: int,
    current_user: models.User = Depends(auth.get_current_user),
    db: Session = Depends(get_db),
):
    items = (
        db.query(models.Expense)
        .filter(
            models.Expense.owner_id == owner_id,
            models.Expense.status == "submitted",
            models.Expense.approver_id == current_user.id,
        )
        .all()
    )
    if not items:
        raise HTTPException(404, "No submissions found to approve")

    for e in items:
        e.status = "approved"
        e.approver_id = None
        e.updated_by = current_user.id

        # notifications
        db.add(models.Notification(
            user_id=e.owner_id,
            type="approval",
            title="Expense Approved",
            message=f"Your expense #{e.id} was approved.",
        ))

    # notify approver
    db.add(models.Notification(
        user_id=current_user.id,
        type="approval",
        title="Report Approved",
        message=f"You approved all pending expenses for user {owner_id}.",
    ))

    db.commit()
    return items


@router.post(
    "/reports/{owner_id}/reject",
    response_model=List[schemas.ExpenseOut],
    summary="Reject ALL pending items for one employee",
)
def reject_all_report(
    owner_id: int,
    reason: str = Query(..., description="Why the whole report is rejected"),
    current_user: models.User = Depends(auth.get_current_user),
    db: Session = Depends(get_db),
):
    items = (
        db.query(models.Expense)
        .filter(
            models.Expense.owner_id == owner_id,
            models.Expense.status == "submitted",
            models.Expense.approver_id == current_user.id,
        )
        .all()
    )
    if not items:
        raise HTTPException(404, "No submissions found to reject")

    for e in items:
        e.status = "rejected"
        e.approver_id = None
        e.updated_by = current_user.id

        db.add(models.Notification(
            user_id=e.owner_id,
            type="rejection",
            title="Expense Rejected",
            message=f"Your expense #{e.id} was rejected. Reason: {reason}",
        ))

    db.add(models.Notification(
        user_id=current_user.id,
        type="rejection",
        title="Report Rejected",
        message=f"You rejected all pending expenses for user {owner_id}. Reason: {reason}",
    ))

    db.commit()
    return items


# ---------------------------------------------------------------------------
# Single‐item Approve / Reject
# ---------------------------------------------------------------------------

@router.post("/{expense_id}/approve", response_model=schemas.ExpenseOut)
def approve_expense(
    expense_id: int,
    current_user: models.User = Depends(auth.get_current_user),
    db: Session = Depends(get_db),
):
    e = db.query(models.Expense).get(expense_id)
    if not e or e.status != "submitted" or e.approver_id != current_user.id:
        raise HTTPException(404, "No submission to approve")

    chain = get_approval_chain(e.owner, db)
    ids = [u.id for u in chain]
    next_idx = ids.index(current_user.id) + 1

    if next_idx < len(chain):
        e.approver_id = chain[next_idx].id
        e.status = "submitted"
    else:
        e.approver_id = None
        e.status = "approved"
    e.updated_by = current_user.id

    # notifications
    db.add(models.Notification(
        user_id=current_user.id,
        type="approval",
        title="Expense Approved",
        message=f"You approved expense #{e.id}.",
    ))
    db.add(models.Notification(
        user_id=e.owner_id,
        type="approval",
        title="Your Expense Approved",
        message=f"Your expense #{e.id} was approved by {current_user.email}.",
    ))

    db.commit()
    return e


@router.post("/{expense_id}/reject", response_model=schemas.ExpenseOut)
def reject_expense(
    expense_id: int,
    reason: str = Query(..., description="Why you rejected this expense"),
    current_user: models.User = Depends(auth.get_current_user),
    db: Session = Depends(get_db),
):
    e = db.query(models.Expense).get(expense_id)
    if not e or e.status != "submitted" or e.approver_id != current_user.id:
        raise HTTPException(404, "No submission to reject")

    e.status = "rejected"
    e.approver_id = None
    e.updated_by = current_user.id

    db.add(models.Notification(
        user_id=e.owner_id,
        type="rejection",
        title="Expense Rejected",
        message=f"Your expense #{e.id} was rejected. Reason: {reason}",
    ))
    db.add(models.Notification(
        user_id=current_user.id,
        type="rejection",
        title="Submission Rejected",
        message=f"You rejected expense #{e.id}. Reason: {reason}",
    ))

    db.commit()
    return e


@router.get("/my-expenses", response_model=List[schemas.ExpenseOut])
def my_expenses(
    current_user: models.User = Depends(auth.get_current_user),
    db: Session = Depends(get_db),
):
    return (
        db.query(models.Expense)
        .filter(models.Expense.owner_id == current_user.id)
        .order_by(models.Expense.created_at.desc())
        .all()
    )