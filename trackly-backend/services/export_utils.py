#services/export_utils.py
import os
from reportlab.pdfgen import canvas
from PyPDF2 import PdfFileMerger
import xlsxwriter
from datetime import datetime

UPLOAD_DIR = "static/uploads"
EXPORT_DIR = "static/exports"

def make_pdf(report_id: int, file_list: list[str]) -> str:
    merger = PdfFileMerger()
    for fname in file_list:
        merger.append(os.path.join(UPLOAD_DIR, fname))
    out_path = os.path.join(EXPORT_DIR, f"report_{report_id}.pdf")
    merger.write(out_path)
    merger.close()
    return out_path

def make_xlsx(report_id: int, records: list[dict]) -> str:
    out_path = os.path.join(EXPORT_DIR, f"report_{report_id}.xlsx")
    wb = xlsxwriter.Workbook(out_path)
    ws = wb.add_worksheet()
    headers = ["Date","Vendor","Amount","Currency","Category","GL Code","Description","User"]
    for col, h in enumerate(headers):
        ws.write(0, col, h)
    for r, rec in enumerate(records, start=1):
        ws.write(r, 0, rec["date"])
        ws.write(r, 1, rec["vendor"])
        ws.write(r, 2, rec["amount"])
        ws.write(r, 3, rec["currency"])
        ws.write(r, 4, rec["category"])
        ws.write(r, 5, rec["gl_code"])
        ws.write(r, 6, rec["description"])
        ws.write(r, 7, rec["owner_email"])
    wb.close()
    return out_path
