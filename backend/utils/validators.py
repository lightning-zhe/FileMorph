from pathlib import Path

_EXT_TO_FORMAT = {
    ".docx": "docx",
    ".pptx": "pptx",
    ".pdf": "pdf",
}


def detect_format(filepath: Path) -> str:
    ext = filepath.suffix.lower()
    if ext not in _EXT_TO_FORMAT:
        raise ValueError(f"Unsupported file extension: {ext}")

    fmt = _EXT_TO_FORMAT[ext]

    with open(filepath, "rb") as f:
        header = f.read(4)

    # docx/pptx are ZIP archives, pdf starts with %PDF
    if fmt in ("docx", "pptx"):
        if not header.startswith(b"PK\x03\x04"):
            raise ValueError(f"File is not a valid Office document: {filepath.name}")
    elif fmt == "pdf":
        if not header.startswith(b"%PDF"):
            raise ValueError(f"File is not a valid PDF: {filepath.name}")

    return fmt
