from pydantic import BaseModel, Field
from typing import List, Optional

class QuestionResult(BaseModel):
    question_id: str
    marks_awarded: float
    max_marks: float
    similarity_score: float
    feedback: str

class EvaluationResult(BaseModel):
    student_id: str
    exam_id: str
    total_marks: float
    question_results: List[QuestionResult]
    overall_feedback: str

class ModelAnswer(BaseModel):
    exam_id: str
    subject: str
    questions: List[dict] # Contains question text, model answer, weightage
