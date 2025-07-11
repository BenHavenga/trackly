from pydantic import BaseModel, EmailStr
from datetime import datetime
from typing import Optional
from typing import List  # <— add this!


class Token(BaseModel):
    access_token: str
    token_type: str

class TokenData(BaseModel):
    email: Optional[str] = None

class UserCreate(BaseModel):
    email: EmailStr
    password: str

class UserOut(BaseModel):
    id: int
    email: EmailStr
    role: str

    class Config:
        orm_mode = True

class RoleUpdate(BaseModel):
    role: str

class LineItemBase(BaseModel):
    description: str
    quantity: Optional[float]
    unit_price: Optional[float]
    total_price: float

class LineItemCreate(LineItemBase):
    pass

class LineItemOut(LineItemBase):
    id: int

    class Config:
        orm_mode = True

class ExpenseBase(BaseModel):
    vendor: Optional[str]
    date: Optional[datetime]
    amount: Optional[float]
    currency: Optional[str]
    category: Optional[str]
    gl_code: Optional[str]
    description: Optional[str]

class ExpenseCreate(ExpenseBase):
    pass

class ExpenseOut(BaseModel):
    id: int
    owner_id: int
    approver_id: Optional[int]
    vendor: str
    date: datetime
    amount: float
    currency: str
    category: str
    gl_code: Optional[str]
    description: Optional[str]
    image_filename: str
    status: str
    created_at: datetime

    # ← include the line items
    line_items: List[LineItemOut] = []

    class Config:
        orm_mode = True
        from_attributes = True

class LineItemUpdate(BaseModel):
    id: Optional[int]               # omit for new items
    description: str
    quantity: Optional[float]
    unit_price: Optional[float]
    total_price: float

    class Config:
        orm_mode = True
        from_attributes = True

class ExpenseUpdate(BaseModel):
    vendor: str
    date: datetime
    amount: float
    currency: str
    category: Optional[str]
    gl_code: Optional[str]
    description: Optional[str]
    line_items: List[LineItemUpdate] = []   # new field

    class Config:
        orm_mode = True
        from_attributes = True


class ExpenseReport(BaseModel):
    owner_id: int
    user_name: str
    user_email: EmailStr
    items_count: int
    total_amount: float
    submitted_at: datetime
    expenses: list[ExpenseOut]

    class Config:
        orm_mode = True
        from_attributes = True

class NotificationOut(BaseModel):
    id: int
    type: str
    title: str
    message: str
    created_at: datetime    # ← use created_at
    read: bool

    class Config:
        from_attributes = True

class CategoryBase(BaseModel):
    name: str
    gl_code: str

class CategoryOut(BaseModel):
    id: int
    name: str
    gl_code: str

    class Config:
        orm_mode = True