import io
from pathlib import Path

from PIL import Image


def images_to_pdf(image_data: list[tuple[bytes, str]], output_path: Path) -> Path:
    """Convert multiple images to a single PDF. Each image = one page, A4."""
    pil_images = []
    for data, _name in image_data:
        img = Image.open(io.BytesIO(data))
        # Handle transparency / palette modes
        if img.mode == 'RGBA':
            # Composite onto white background
            bg = Image.new('RGB', img.size, (255, 255, 255))
            bg.paste(img, mask=img.split()[3])
            img = bg
        elif img.mode in ('P', 'LA', 'PA'):
            img = img.convert('RGBA')
            bg = Image.new('RGB', img.size, (255, 255, 255))
            bg.paste(img, mask=img.split()[3] if img.mode == 'RGBA' else None)
            img = bg
        elif img.mode != 'RGB':
            img = img.convert('RGB')

        # Scale to fit A4 (595 x 842 pts at 72 DPI), keep aspect ratio
        a4_w, a4_h = 595, 842
        img.thumbnail((a4_w, a4_h), Image.LANCZOS)

        # Center on A4 canvas
        canvas = Image.new('RGB', (a4_w, a4_h), (255, 255, 255))
        x = (a4_w - img.width) // 2
        y = (a4_h - img.height) // 2
        canvas.paste(img, (x, y))
        pil_images.append(canvas)

    if not pil_images:
        raise ValueError("No valid images provided")

    pil_images[0].save(
        str(output_path),
        save_all=True,
        append_images=pil_images[1:],
        format='PDF',
    )
    return output_path
