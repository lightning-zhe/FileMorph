from pathlib import Path

import mammoth
from services.converter import register


@register("docx", "html")
def convert(input_path: Path, output_path: Path) -> Path:
    with open(input_path, "rb") as f:
        result = mammoth.convert_to_html(f)
    output_path.write_text(result.value, encoding="utf-8")
    return output_path
