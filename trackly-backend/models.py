# models.py
from sqlalchemy import Column, Integer, String, Float, DateTime, ForeignKey, Text, Boolean
from sqlalchemy.orm import relationship
from datetime import datetime
from database import Base

class User(Base):
    __tablename__ = "users"

    id             = Column(Integer, primary_key=True, index=True)
    email          = Column(String, unique=True, index=True)
    hashed_password= Column(String)
    role           = Column(String, default="user")
    manager_id     = Column(Integer, ForeignKey("users.id"), nullable=True)
    manager        = relationship(
                        "User",
                        remote_side=[id],
                        backref="direct_reports",
                        foreign_keys=[manager_id]
                     )
    expenses       = relationship(
                        "Expense",
                        back_populates="owner",
                        foreign_keys="Expense.owner_id"
                     )

class Expense(Base):
    __tablename__ = "expenses"

    id             = Column(Integer, primary_key=True, index=True)
    owner_id       = Column(Integer, ForeignKey("users.id"), nullable=False)
    approver_id    = Column(Integer, ForeignKey("users.id"), nullable=True)
    vendor         = Column(String, nullable=False)
    date           = Column(DateTime, nullable=False)
    amount         = Column(Float, nullable=False)
    currency       = Column(String, nullable=False)
    category       = Column(String, nullable=False)
    gl_code        = Column(String, nullable=True)
    description    = Column(Text, nullable=True)
    image_filename = Column(String, nullable=False)
    status         = Column(String, default="draft", nullable=False)
    created_at     = Column(DateTime, default=datetime.utcnow)

    owner          = relationship("User", back_populates="expenses", foreign_keys=[owner_id])
    approver       = relationship("User", foreign_keys=[approver_id], backref="to_approve")

    # ← new relationship to line items
    line_items     = relationship(
                        "LineItem",
                        back_populates="expense",
                        cascade="all, delete-orphan"
                     )

class LineItem(Base):
    __tablename__ = "line_items"

    id             = Column(Integer, primary_key=True, index=True)
    expense_id     = Column(Integer, ForeignKey("expenses.id"), nullable=False)
    description    = Column(String, nullable=False)
    quantity       = Column(Float, nullable=True)
    unit_price     = Column(Float, nullable=True)
    total_price    = Column(Float, nullable=False)

    expense        = relationship("Expense", back_populates="line_items")

class Notification(Base):
    __tablename__ = "notifications"

    id         = Column(Integer, primary_key=True, index=True)
    user_id    = Column(Integer, ForeignKey("users.id"), nullable=False, index=True)
    type       = Column(String, nullable=False)
    title      = Column(String, nullable=False)
    message    = Column(Text,   nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)
    read       = Column(Boolean, default=False, nullable=False)

    user = relationship("User", backref="notifications")

class Category(Base):
    __tablename__ = "categories"

    id      = Column(Integer, primary_key=True, index=True)
    name    = Column(String, unique=True, index=True, nullable=False)
    gl_code = Column(String, nullable=False)