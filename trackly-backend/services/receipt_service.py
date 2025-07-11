# services/receipt_service.py
from services.ocr import ocr_lines_with_boxes
from services.openai_llm import parse_receipt_lines

def extract_and_parse_receipt(image_path: str) -> dict:
    """
    Full pipeline: OCR image -> segment into lines -> parse via LLM -> return structured dict.
    Now includes 'line_items', each as a dict {description, quantity, unit_price, total_price}.
    """
    # 1) Segment receipt into text lines
    lines = ocr_lines_with_boxes(image_path)

    # 2) Parse with LLM
    try:
        receipt = parse_receipt_lines(lines)
    except Exception as e:
        print(f"Error parsing receipt via LLM: {e}")
        # fallback minimal structure
        receipt = {
            "vendor": "Unknown Vendor",
            "date": "",
            "currency": "USD",
            "line_items": [],
            "total_amount": 0.0
        }
    return receipt