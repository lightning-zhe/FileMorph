import subprocess
import shutil
from pathlib import Path

from config import LIBREOFFICE_PATH, LIBREOFFICE_TIMEOUT


def _run_libreoffice(input_path: Path, output_path: Path, target_format: str) -> Path:
    output_dir = output_path.parent
    output_dir.mkdir(parents=True, exist_ok=True)

    try:
        result = subprocess.run(
            [
                LIBREOFFICE_PATH,
                "--headless",
                "--convert-to", target_format,
                "--outdir", str(output_dir),
                str(input_path),
            ],
            capture_output=True,
            text=True,
            timeout=LIBREOFFICE_TIMEOUT,
        )
    except FileNotFoundError:
        raise RuntimeError(
            "LibreOffice 未安装或未找到。请安装 LibreOffice 后重试，"
            "或设置环境变量 LIBREOFFICE_PATH 指向 soffice.exe 的完整路径"
        )

    if result.returncode != 0:
        raise RuntimeError(f"LibreOffice conversion failed: {result.stderr}")

    # LibreOffice produces <stem>.<target_format> in the output dir
    generated = output_dir / f"{input_path.stem}.{target_format}"

    if not generated.exists():
        raise RuntimeError(f"LibreOffice did not produce expected output: {generated}")

    if generated != output_path:
        shutil.move(str(generated), str(output_path))

    return output_path


ROUTES = {}


def register(source_fmt: str, target_fmt: str):
    def decorator(fn):
        ROUTES[(source_fmt, target_fmt)] = fn
        return fn
    return decorator


def convert(input_path: Path, source_format: str, target_format: str, output_path: Path) -> Path:
    handler = ROUTES.get((source_format, target_format))
    if not handler:
        raise ValueError(f"Unsupported conversion: {source_format} -> {target_format}")
    return handler(input_path, output_path)


# Import conversion modules so @register decorators fire
import services.docx_to_pdf  # noqa: F401, E402
import services.pptx_to_pdf  # noqa: F401, E402
import services.pdf_to_docx  # noqa: F401, E402
import services.pdf_to_png   # noqa: F401, E402
import services.pptx_to_png  # noqa: F401, E402
