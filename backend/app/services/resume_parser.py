from pathlib import Path

from docx import Document
from pypdf import PdfReader


def extract_text(file_path: str, file_type: str) -> str:
    if file_type == "pdf":
        return extract_pdf_text(file_path)

    if file_type == "docx":
        return extract_docx_text(file_path)

    raise ValueError("Unsupported file type")


def extract_pdf_text(file_path: str) -> str:
    reader = PdfReader(file_path)

    text = []

    for page in reader.pages:
        page_text = page.extract_text()

        if page_text:
            text.append(page_text)

    return "\n".join(text).strip()


def extract_docx_text(file_path: str) -> str:
    document = Document(file_path)

    text = [
        paragraph.text
        for paragraph in document.paragraphs
        if paragraph.text.strip()
    ]

    return "\n".join(text).strip()