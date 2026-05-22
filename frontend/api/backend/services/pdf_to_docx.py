from pathlib import Path

from pdf2docx import Converter
from services.converter import register


@register("pdf", "docx")
def convert(input_path: Path, output_path: Path) -> Path:
    cv = Converter(str(input_path))
    try:
        cv.convert(str(output_path))
    finally:
        cv.close()
    return output_path
