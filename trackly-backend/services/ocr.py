# services/ocr.py
import pytesseract
from PIL import Image
from config import OCR_LANG
from collections import defaultdict


def extract_text(image_path: str) -> str:
    """
    Fallback OCR: returns the raw text as a single string.
    """
    img = Image.open(image_path)
    return pytesseract.image_to_string(img, lang=OCR_LANG)


def ocr_lines_with_boxes(image_path: str) -> list[str]:
    """
    Uses Tesseract to extract words with their bounding boxes, then groups
    them into text lines preserving reading order.
    Returns a list of strings, each representing one line from the receipt.
    """
    img = Image.open(image_path)
    data = pytesseract.image_to_data(img, lang=OCR_LANG, output_type=pytesseract.Output.DICT)
    rows = defaultdict(list)
    # Group words by line number
    for i, line_num in enumerate(data['line_num']):
        text = data['text'][i].strip()
        if not text:
            continue
        x = data['left'][i]
        rows[line_num].append((x, text))
    # Assemble lines sorted by their x-coordinate
    lines = []
    for line_index in sorted(rows):
        words = sorted(rows[line_index], key=lambda item: item[0])
        line_text = " ".join(w[1] for w in words)
        lines.append(line_text)
    return lines