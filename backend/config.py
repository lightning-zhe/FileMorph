import os
from pathlib import Path

BASE_DIR = Path(__file__).resolve().parent
UPLOAD_DIR = BASE_DIR / "uploads"
OUTPUT_DIR = BASE_DIR / "outputs"

MAX_FILE_SIZE = 50 * 1024 * 1024  # 50MB
FILE_EXPIRE_SECONDS = 600         # 10 minutes
CLEANUP_INTERVAL = 60             # run cleanup every 60s

def _find_libreoffice() -> str:
    import shutil

    if env := os.environ.get("LIBREOFFICE_PATH"):
        return env
    if shutil.which("soffice"):
        return "soffice"

    candidates = [
        r"C:\Program Files\LibreOffice\program\soffice.exe",
        r"C:\Program Files (x86)\LibreOffice\program\soffice.exe",
    ]
    for candidate in candidates:
        if os.path.exists(candidate):
            return candidate
    return "soffice"


LIBREOFFICE_PATH = _find_libreoffice()
LIBREOFFICE_TIMEOUT = 120  # seconds

ALLOWED_ORIGINS = os.environ.get(
    "ALLOWED_ORIGINS",
    "http://localhost:5173,http://localhost:3000",
).split(",")

ALLOWED_CONVERSIONS = {
    ("docx", "pdf"),
    ("pptx", "pdf"),
    ("pptx", "png"),
    ("pdf", "docx"),
    ("pdf", "png"),
}
