import uuid
from datetime import datetime
from pathlib import Path


def safe_filename(original_name: str) -> str:
    ext = Path(original_name).suffix.lower()
    return f"{uuid.uuid4().hex}{ext}"


def cleanup_old_files(directory: Path, max_age_seconds: int) -> None:
    now = datetime.now()
    for filepath in directory.glob("*"):
        if not filepath.is_file():
            continue
        mtime = datetime.fromtimestamp(filepath.stat().st_mtime)
        if (now - mtime).total_seconds() > max_age_seconds:
            filepath.unlink()
