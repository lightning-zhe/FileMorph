import uuid
from pathlib import Path

from fastapi import APIRouter, File, Form, HTTPException, UploadFile
from fastapi.responses import FileResponse

from config import ALLOWED_CONVERSIONS, MAX_FILE_SIZE, OUTPUT_DIR, UPLOAD_DIR
from services.converter import convert
from utils.file_utils import safe_filename
from utils.validators import detect_format

router = APIRouter()


@router.post("/api/convert")
async def convert_file(
    file: UploadFile = File(...),
    target_format: str = Form(...),
):
    target_format = target_format.lower().strip()

    if not file.filename:
        raise HTTPException(status_code=400, detail="No file provided")

    content = await file.read()

    if len(content) == 0:
        raise HTTPException(status_code=400, detail="File is empty")

    if len(content) > MAX_FILE_SIZE:
        raise HTTPException(
            status_code=400,
            detail=f"File exceeds {MAX_FILE_SIZE // (1024 * 1024)}MB limit",
        )

    UPLOAD_DIR.mkdir(parents=True, exist_ok=True)
    safe_name = safe_filename(file.filename)
    upload_path = UPLOAD_DIR / safe_name
    upload_path.write_bytes(content)

    try:
        source_format = detect_format(upload_path)
    except ValueError as e:
        upload_path.unlink(missing_ok=True)
        raise HTTPException(status_code=400, detail=str(e))

    if (source_format, target_format) not in ALLOWED_CONVERSIONS:
        upload_path.unlink(missing_ok=True)
        raise HTTPException(
            status_code=400,
            detail=f"Conversion from {source_format.upper()} to {target_format.upper()} is not supported",
        )

    OUTPUT_DIR.mkdir(parents=True, exist_ok=True)
    base_name = uuid.uuid4().hex
    output_path = OUTPUT_DIR / f"{base_name}.{target_format}"

    try:
        final_path = convert(upload_path, source_format, target_format, output_path)
    except Exception as e:
        upload_path.unlink(missing_ok=True)
        for f in OUTPUT_DIR.glob(f"{base_name}*"):
            f.unlink(missing_ok=True)
        raise HTTPException(status_code=500, detail=f"Conversion failed: {e}")

    return _build_response(source_format, target_format, base_name, final_path, file.filename)


def _build_response(source_fmt: str, target_fmt: str, base_name: str, final_path: Path, original_name: str) -> dict:
    common = {
        "source_format": source_fmt,
        "target_format": target_fmt,
        "original_filename": original_name,
        "output_extension": final_path.suffix.lstrip("."),
    }

    # Image-type conversions support per-page downloads
    if target_fmt == "png":
        return _image_response(common, base_name, final_path)
    return _single_file_response(common, final_path)


def _single_file_response(common: dict, final_path: Path) -> dict:
    return {
        **common,
        "result_type": "single_file",
        "download_url": f"/api/download/{final_path.name}",
        "files": [],
        "zip_url": None,
    }


def _image_response(common: dict, base_name: str, final_path: Path) -> dict:
    files = []
    zip_url = None

    page_files = sorted(OUTPUT_DIR.glob(f"{base_name}_page_*.png"))
    if page_files:
        zip_url = f"/api/download/{final_path.name}"
        for pf in page_files:
            page_num = int(pf.stem.rsplit("_", 1)[-1])
            files.append({
                "page": page_num,
                "filename": pf.name,
                "download_url": f"/api/download/{pf.name}",
            })
    else:
        files.append({
            "page": 1,
            "filename": final_path.name,
            "download_url": f"/api/download/{final_path.name}",
        })

    return {
        **common,
        "result_type": "multiple_images",
        "download_url": f"/api/download/{final_path.name}",
        "files": files,
        "zip_url": zip_url,
    }


@router.get("/api/download/{filename}")
async def download_file(filename: str, name: str = ""):
    safe_name = Path(filename).name
    filepath = OUTPUT_DIR / safe_name

    if not filepath.exists() or not filepath.is_file():
        raise HTTPException(status_code=404, detail="File not found or expired")

    download_name = name if name else safe_name

    return FileResponse(
        path=str(filepath),
        filename=download_name,
        media_type="application/octet-stream",
    )
