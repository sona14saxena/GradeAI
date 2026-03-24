from fastapi import APIRouter, HTTPException, Depends, Body
from app.database import get_db
from pydantic import BaseModel

router = APIRouter()

class FacultyLogin(BaseModel):
    name: str
    faculty_id: str

@router.post("/faculty/login")
async def faculty_login(faculty: FacultyLogin, db=Depends(get_db)):
    faculty_collection = db["faculties"]
    
    # Check if faculty already exists
    existing_faculty = await faculty_collection.find_one({"faculty_id": faculty.faculty_id})
    
    if existing_faculty:
        # Sign-in flow: They already exist. We could check if name matches, but let's just log them in
        return {"message": "Login successful", "faculty_id": faculty.faculty_id, "name": existing_faculty.get("name")}
    
    # Sign-up flow: They don't exist, store them in database
    new_faculty = {
        "faculty_id": faculty.faculty_id,
        "name": faculty.name
    }
    
    await faculty_collection.insert_one(new_faculty)
    
    return {"message": "Sign-up successful", "faculty_id": faculty.faculty_id, "name": faculty.name}
