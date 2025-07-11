from fastapi import FastAPI, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordRequestForm
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.openapi.utils import get_openapi            # <-- ADD THIS

from sqlalchemy.exc import IntegrityError
from sqlalchemy.orm import Session

from database import Base, engine, get_db
import models
import schemas
import auth

# Routers
from routes.expenses import router as exp_router
from routes.workflow import router as wf_router
from routes.export   import router as ex_router
from routes.admin    import router as admin_router
from routes.notifications import router as notifications_router
from routes.categories import router as categories_router



# 1) Create all tables
Base.metadata.create_all(bind=engine)

# 2) Instantiate FastAPI
app = FastAPI(title="Trackly Backend")

# 3) Mount static files
app.mount("/static", StaticFiles(directory="static"), name="static")

# 4) CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "*"
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# 5) Include routers
app.include_router(exp_router)
app.include_router(wf_router)
app.include_router(ex_router)
app.include_router(admin_router)
app.include_router(notifications_router)
app.include_router(categories_router)


# 6) Auth endpoints
@app.post("/auth/register", response_model=schemas.UserOut)
def register_user(user_in: schemas.UserCreate, db: Session = Depends(get_db)):
    """
    Create a new user. The FIRST user in the table will be given the 'admin'
    role. Every user after that will default to 'user'.
    """
    # Count existing users
    existing_count = db.query(models.User).count()

    # Determine role
    #   – If no users exist yet, role='admin' else role='user'
    role = "admin" if existing_count == 0 else "user"

    # Hash password and create
    hashed_pw = auth.get_password_hash(user_in.password)
    new_user = models.User(
        email=user_in.email,
        hashed_password=hashed_pw,
        role=role,
    )

    try:
        db.add(new_user)
        db.commit()
        db.refresh(new_user)
        return new_user
    except IntegrityError:
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email already registered",
        )

@app.post("/auth/login", response_model=schemas.Token)
def login(form_data: OAuth2PasswordRequestForm = Depends(),
          db: Session = Depends(get_db)):
    user = auth.authenticate_user(db, form_data.username, form_data.password)
    if not user:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED,
                            detail="Invalid credentials",
                            headers={"WWW-Authenticate":"Bearer"})
    access_token = auth.create_access_token({"sub":user.email})
    return {"access_token":access_token, "token_type":"bearer"}

@app.get("/users/me", response_model=schemas.UserOut)
def read_users_me(current_user: models.User=Depends(auth.get_current_user)):
    return current_user

# 7) Custom OpenAPI with OAuth2 password flow
def custom_openapi():
    if app.openapi_schema:
        return app.openapi_schema

    openapi_schema = get_openapi(
        title=app.title,
        version="1.0.0",
        description="Trackly Backend API with OAuth2 password-flow for Swagger",
        routes=app.routes,
    )

    openapi_schema["components"]["securitySchemes"] = {
        "OAuth2Password": {
            "type": "oauth2",
            "flows": {
                "password": {
                    "tokenUrl": "/auth/login",
                    "scopes": {
                        "read:expenses":  "Read your own expenses",
                        "create:expenses":"Upload new receipts",
                        "read:users":     "View user list (admin only)",
                        "update:users":   "Modify user roles (admin only)",
                    },
                }
            },
        }
    }

    for path, methods in openapi_schema["paths"].items():
        if path.startswith("/auth"):
            continue
        for method in methods:
            methods[method]["security"] = [{"OAuth2Password": [
                "read:expenses",
                "create:expenses"
            ]}]

    app.openapi_schema = openapi_schema
    return app.openapi_schema

app.openapi = custom_openapi
