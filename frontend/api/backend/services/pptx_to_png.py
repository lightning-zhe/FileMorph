import shutil
import tempfile
import zipfile
from pathlib import Path

import fitz
from services.converter import register, _run_libreoffice


@register("pptx", "png")
def convert(input_path: Path, output_path: Path) -> Path:
    tmp_dir = Path(tempfile.mkdtemp())
    try:
        pdf_path = tmp_dir / f"{input_path.stem}.pdf"
        _run_libreoffice(input_path, pdf_path, "pdf")

        doc = fitz.open(str(pdf_path))
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
    finally:
        shutil.rmtree(str(tmp_dir), ignore_errors=True)
