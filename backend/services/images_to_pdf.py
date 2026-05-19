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

        # Use portrait or landscape A4 based on image orientation
        if img.width > img.height:
            page_w, page_h = 842, 595  # landscape
        else:
            page_w, page_h = 595, 842  # portrait

        img.thumbnail((page_w, page_h), Image.LANCZOS)

        canvas = Image.new('RGB', (page_w, page_h), (255, 255, 255))
        x = (page_w - img.width) // 2
        y = (page_h - img.height) // 2
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
