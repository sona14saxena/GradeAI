import pdf2image
import pytesseract
import os
from typing import List

class OCRService:
    def __init__(self):
        # We can configure tesseract cmd here if needed
        pass

    def extract_text_from_pdf(self, pdf_path: str) -> str:
        """
        Convert PDF to images and extract text using PyTesseract.
        """
        try:
            images = pdf2image.convert_from_path(pdf_path)
            extracted_text = ""
            for img in images:
                text = pytesseract.image_to_string(img)
                extracted_text += text + "\n"
            return extracted_text
        except Exception as e:
            # Fallback or error logging
            print(f"Error extracting text: {e}")
            return ""

    def extract_text_from_image(self, image_path: str) -> str:
        """
        Extract text directly from an image.
        """
        try:
            return pytesseract.image_to_string(image_path)
        except Exception as e:
            print(f"Error extracting text from image: {e}")
            return ""

ocr_service = OCRService()
