from pathlib import Path

from services.converter import register, _run_libreoffice


@register("docx", "pdf")
def convert(input_path: Path, output_path: Path) -> Path:
    return _run_libreoffice(input_path, output_path, "pdf")
