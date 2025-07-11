# services/openai_llm.py
from openai import OpenAI
import json
import config

client = OpenAI(api_key=config.OPENAI_API_KEY)

def parse_receipt_lines(raw_lines: list[str]) -> dict:
    """
    Calls the LLM to interpret a list of OCR text lines as a structured receipt
    with multiple line items plus a total. Returns a dict with:
      - vendor (str)
      - date (YYYY-MM-DD)
      - currency (str)
      - line_items (list of {description, quantity, unit_price, total, category, gl_code})
      - total_amount (float)
    """
    prompt = f"""
You are a JSON-only parser for multi-item receipts. Given a list of text lines from OCR,
identify the vendor, the date (YYYY-MM-DD), the currency, each line item's description,
quantity, unit price, total, category, and gl_code, and the overall total_amount.
Output must be valid JSON with keys: vendor, date, currency, line_items, total_amount.
Ensure sum(line_items[].total) == total_amount.

Here are the OCR lines:
{json.dumps(raw_lines, indent=2)}
"""
    resp = client.chat.completions.create(
        model="gpt-4",
        messages=[
            {"role": "system",  "content": "You output only valid JSON."},
            {"role": "user",    "content": prompt}
        ],
        temperature=0,
    )
    text = resp.choices[0].message.content.strip()
    return json.loads(text)

# Alias for backward compatibility: accept raw OCR text

def parse_expense(raw_text: str) -> dict:
    """
    Legacy entrypoint: splits raw OCR text into lines and parses as multi-item receipt.
    """
    lines = [line for line in raw_text.splitlines() if line.strip()]
    try:
        return parse_receipt_lines(lines)
    except Exception as e:
        print(f"LLM parse failed: {e}")
        return {
            "vendor": "Unknown Vendor",
            "date": "",
            "currency": "USD",
            "line_items": [],
            "total_amount": 0.0
        }
