from fastapi import APIRouter, UploadFile, File, Form, Depends, HTTPException
from typing import List
import shutil
import uuid
import os
from app.services.ocr_service import ocr_service
from app.database import get_db

router = APIRouter()

UPLOAD_DIR = "temp_uploads"
os.makedirs(UPLOAD_DIR, exist_ok=True)

@router.post("/model-answer")
async def upload_model_answer(
    subject: str = Form(...),
    exam_type: str = Form(...),
    file: UploadFile = File(...),
    db = Depends(get_db)
):
    try:
        file_id = str(uuid.uuid4())
        file_path = os.path.join(UPLOAD_DIR, f"{file_id}_{file.filename}")
        
        with open(file_path, "wb") as buffer:
            shutil.copyfileobj(file.file, buffer)
            
        extracted_text = ocr_service.extract_text_from_pdf(file_path)
        
        # In a real scenario, this text would be parsed into individual questions
        # For MVP, we save it as a combined text block
        model_answer_doc = {
            "model_answer_id": file_id,
            "subject": subject,
            "exam_type": exam_type,
            "filename": file.filename,
            "extracted_text": extracted_text,
            "parsed_questions": [
                {"question_id": "1", "text": "Sample Question", "model_answer": extracted_text, "weightage": 100}
            ]
        }
        
        await db["model_answers"].insert_one(model_answer_doc)
        
        # Cleanup
        if os.path.exists(file_path):
            os.remove(file_path)
            
        return {"message": "Model answer uploaded and processed locally", "model_answer_id": file_id}
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/student-notebooks")
async def upload_student_notebooks(
    model_answer_id: str = Form(...),
    files: List[UploadFile] = File(...),
    db = Depends(get_db)
):
    try:
        # Verify model answer exists
        model = await db["model_answers"].find_one({"model_answer_id": model_answer_id})
        if not model:
            raise HTTPException(status_code=404, detail="Model answer not found")
            
        processed_students = []
        for file in files:
            student_id = str(uuid.uuid4())
            file_path = os.path.join(UPLOAD_DIR, f"{student_id}_{file.filename}")
            
            with open(file_path, "wb") as buffer:
                shutil.copyfileobj(file.file, buffer)
                
            extracted_text = ocr_service.extract_text_from_pdf(file_path)
            
            student_doc = {
                "student_id": student_id,
                "model_answer_id": model_answer_id,
                "filename": file.filename,
                "extracted_text": extracted_text,
                "status": "pending_evaluation"
            }
            
            await db["student_submissions"].insert_one(student_doc)
            processed_students.append(student_id)
            
            if os.path.exists(file_path):
                os.remove(file_path)
                
        return {"message": f"Uploaded and extracted text for {len(files)} student notebooks", "student_ids": processed_students}
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
