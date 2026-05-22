import os
import sys
from pathlib import Path

# Add backend to Python path so its modules can be imported
backend_dir = Path(__file__).resolve().parent / "backend"
sys.path.insert(0, str(backend_dir))

# Override storage dirs to use /tmp (only writable location in Vercel serverless)
import config

config.UPLOAD_DIR = Path("/tmp/uploads")
config.OUTPUT_DIR = Path("/tmp/outputs")
config.UPLOAD_DIR.mkdir(parents=True, exist_ok=True)
config.OUTPUT_DIR.mkdir(parents=True, exist_ok=True)

# Import conversion service modules so @register decorators fire
import services.docx_to_pdf  # noqa: F401
import services.pptx_to_pdf  # noqa: F401
import services.pdf_to_docx  # noqa: F401
import services.docx_to_html  # noqa: F401
import services.pdf_to_png  # noqa: F401
import services.pptx_to_png  # noqa: F401

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routers.convert import router as convert_router

app = FastAPI(title="FileMorph API", version="0.1.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(convert_router)
