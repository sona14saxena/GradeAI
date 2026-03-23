from fastapi import APIRouter, Depends
from typing import Dict, Any
from app.database import get_db

router = APIRouter()

@router.get("/class-summary/{model_answer_id}")
async def get_class_summary(model_answer_id: str, db = Depends(get_db)):
    # Fetch all evaluated submissions for this exam
    cursor = db["student_submissions"].find({
        "model_answer_id": model_answer_id,
        "status": "evaluated"
    })
    
    submissions = await cursor.to_list(length=1000)
    
    if not submissions:
        return {"message": "No evaluated submissions found for this class/exam."}
        
    scores = [sub["evaluation"]["total_marks"] for sub in submissions if "evaluation" in sub]
    
    if not scores:
        return {"message": "No valid scores found."}
        
    avg_score = sum(scores) / len(scores)
    
    distribution = {"A": 0, "B": 0, "C": 0, "D": 0, "F": 0}
    for s in scores:
        if s >= 90: distribution["A"] += 1
        elif s >= 80: distribution["B"] += 1
        elif s >= 70: distribution["C"] += 1
        elif s >= 60: distribution["D"] += 1
        else: distribution["F"] += 1

    return {
        "model_answer_id": model_answer_id,
        "total_students": len(scores),
        "average_score": round(avg_score, 2),
        "highest_score": max(scores),
        "lowest_score": min(scores),
        "distribution": distribution
    }

@router.get("/question-difficulty/{model_answer_id}")
async def get_question_difficulty_analysis(model_answer_id: str, db = Depends(get_db)):
    # Mocking question extraction for MVP since we group as 1 text block right now
    # But querying standard structure
    cursor = db["student_submissions"].find({
        "model_answer_id": model_answer_id,
        "status": "evaluated"
    })
    submissions = await cursor.to_list(length=1000)
    
    if not submissions:
         return {"message": "No data available"}
         
    # Assuming question 1 is our only question for MVP
    q1_scores = [sub["evaluation"]["question_details"][0]["marks_awarded"] for sub in submissions if "evaluation" in sub]
    avg = sum(q1_scores) / len(q1_scores) if q1_scores else 0
    max_mark = 100.0
    percentage = (avg / max_mark) * 100
    
    difficulty = "Hard" if percentage < 50 else ("Medium" if percentage < 75 else "Easy")
    
    return {
        "model_answer_id": model_answer_id,
        "question_analysis": [
            {
                "question_id": "1", 
                "average_score_percentage": round(percentage, 2), 
                "difficulty": difficulty
            }
        ]
    }
