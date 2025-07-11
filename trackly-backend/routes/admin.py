# routes/admin.py

from fastapi import APIRouter, Depends, HTTPException, status, UploadFile, File
from sqlalchemy.orm import Session
import pandas as pd
import io

import models, schemas
import auth  # <-- your custom auth.py
from database import get_db

router = APIRouter(
    prefix="/admin",
    tags=["admin"],
    dependencies=[Depends(auth.require_admin)],  # require admin on all
)


@router.get("/users", response_model=list[schemas.UserOut])
def list_all_users(db: Session = Depends(get_db)):
    """
    Return every user in the system (admin only).
    """
    return db.query(models.User).all()


@router.patch("/users/{user_id}/role", response_model=schemas.UserOut)
def update_user_role(
    user_id: int,
    role_update: schemas.RoleUpdate,
    db: Session = Depends(get_db),
):
    """
    Change a given user's role (admin only).
    """
    allowed = {"user", "approver", "finance", "admin"}
    if role_update.role not in allowed:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Role must be one of {allowed}"
        )

    user = db.query(models.User).filter(models.User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND,
                            detail="User not found")

    user.role = role_update.role
    db.commit()
    db.refresh(user)
    return user


@router.post("/users/upload", status_code=status.HTTP_201_CREATED)
def bulk_upload_users(
    file: UploadFile = File(...),
    db: Session = Depends(get_db),
):
    content = file.file.read()
    try:
        if file.filename.lower().endswith((".xls", ".xlsx")):
            df = pd.read_excel(io.BytesIO(content), dtype=str)
        else:
            df = pd.read_csv(io.StringIO(content.decode()), dtype=str)
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Could not parse file: {e}"
        )

    required_cols = {"email", "password", "role"}
    missing = required_cols - {col.lower() for col in df.columns}
    if missing:
        raise HTTPException(
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            detail=f"Missing columns: {missing}"
        )

    created_or_updated = 0
    for idx, row in df.iterrows():
        email    = row["email"].strip().lower()
        pwd      = row["password"]
        role     = row["role"].strip().lower()
        mgr_email = row.get("manager_email")
        mgr_email = mgr_email.strip().lower() if isinstance(mgr_email, str) else None

        # Find or create the user
        user = db.query(models.User).filter_by(email=email).first()
        if not user:
            user = models.User(email=email)
        
        # Hash & assign password + role
        user.hashed_password = auth.get_password_hash(pwd)
        user.role = role

        # Assign manager_id (if provided)
        if mgr_email:
            manager = db.query(models.User).filter_by(email=mgr_email).first()
            if not manager:
                raise HTTPException(
                    status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
                    detail=f"Manager '{mgr_email}' not found in row {idx+1}"
                )
            user.manager_id = manager.id

        db.add(user)
        created_or_updated += 1

    db.commit()
    return {
        "detail": "Bulk upload successful",
        "count": created_or_updated
    }

@router.post("/categories/upload", status_code=201)
def bulk_upload_categories(
    file: UploadFile = File(...),
    db: Session = Depends(get_db),
):
    df = pd.read_csv(io.StringIO(file.file.read().decode()), dtype=str)
    # Expect columns: name, gl_code
    for _, row in df.iterrows():
        name, gl = row["name"].strip(), row["gl_code"].strip()
        cat = db.query(models.Category).filter_by(name=name).first()
        if not cat:
            cat = models.Category(name=name, gl_code=gl)
        else:
            cat.gl_code = gl
        db.add(cat)
    db.commit()
    return {"detail": "uploaded", "count": len(df)}