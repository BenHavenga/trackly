import os
from dotenv import load_dotenv

load_dotenv()

DATABASE_URL = os.getenv("DATABASE_URL", "sqlite:///./trackly.db")
JWT_SECRET_KEY = os.getenv("JWT_SECRET_KEY", "change_me")
JWT_ALGORITHM = os.getenv("JWT_ALGORITHM", "HS256")
ACCESS_TOKEN_EXPIRE_MINUTES = int(os.getenv("ACCESS_TOKEN_EXPIRE_MINUTES", 60))
OPENAI_API_KEY = os.getenv("OPENAI_API_KEY", "")
OCR_LANG = os.getenv("OCR_LANG", "eng")

# GL code mapping
GL_CODE_MAP = {
    "Travel": "GL-4501",
    "Meals": "GL-4502",
    "Office Supplies": "GL-4503",
}
