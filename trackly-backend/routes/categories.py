# routes/categories.py
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

import models, schemas, auth
from database import get_db

router = APIRouter(
    prefix="/categories",
    tags=["categories"],
    dependencies=[Depends(auth.get_current_user)],  # any authenticated user can read
)

@router.get("/", response_model=list[schemas.CategoryOut])
def list_categories(db: Session = Depends(get_db)):
    """
    Return all categories with their GL codes.
    """
    cats = db.query(models.Category).order_by(models.Category.name).all()
    return cats