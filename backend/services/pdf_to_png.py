import zipfile
from pathlib import Path

import fitz
from services.converter import register


@register("pdf", "png")
def convert(input_path: Path, output_path: Path) -> Path:
    doc = fitz.open(str(input_path))
    page_count = doc.page_count

    if page_count == 1:
        page = doc[0]
        pix = page.get_pixmap(dpi=150)
        pix.save(str(output_path))
        doc.close()
        return output_path

    # Multi-page: save individual PNGs + ZIP
    zip_path = output_path.with_suffix(".zip")
    stem = output_path.stem
    parent = output_path.parent
    page_data = []

    for i, page in enumerate(doc, start=1):
        pix = page.get_pixmap(dpi=150)
        page_path = parent / f"{stem}_page_{i}.png"
        pix.save(str(page_path))
        page_data.append((f"page_{i}.png", pix.tobytes("png")))

    with zipfile.ZipFile(str(zip_path), "w", zipfile.ZIP_DEFLATED) as zf:
        for name, data in page_data:
            zf.writestr(name, data)

    doc.close()
    return zip_path
