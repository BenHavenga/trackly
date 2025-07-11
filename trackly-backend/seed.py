from passlib.context import CryptContext
from sqlalchemy.orm import Session
from database import SessionLocal
import models

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

def hash_password(password: str) -> str:
    return pwd_context.hash(password)

db: Session = SessionLocal()

users = [
    {"email": "admin@demo.com", "password": "adminpass", "role": "admin", "manager_id": None},
    {"email": "finance@demo.com", "password": "financepass", "role": "finance", "manager_id": 1},
    {"email": "approver@demo.com", "password": "approverpass", "role": "approver", "manager_id": 1},
    {"email": "user@demo.com", "password": "userpass", "role": "employee", "manager_id": 3},
]

for u in users:
    hashed = hash_password(u["password"])
    user = models.User(
        email=u["email"],
        hashed_password=hashed,
        role=u["role"],
        manager_id=u["manager_id"],
    )
    db.add(user)

db.commit()
print("✅ Seeded users successfully")