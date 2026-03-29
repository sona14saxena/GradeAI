from fastapi import APIRouter, HTTPException, Depends, Body
from app.database import get_db
from pydantic import BaseModel, EmailStr
from typing import Optional

router = APIRouter()

class FacultyLogin(BaseModel):
    name: str
    faculty_id: str

class FacultySignup(BaseModel):
    name: str
    faculty_id: str
    institute: str
    email: str

class GoogleAuth(BaseModel):
    email: str
    name: str
    picture: Optional[str] = None

@router.post("/faculty/login")
async def faculty_login(faculty: FacultyLogin, db=Depends(get_db)):
    faculty_collection = db["faculties"]
    
    existing_faculty = await faculty_collection.find_one({
        "faculty_id": faculty.faculty_id,
        "name": faculty.name
    })
    
    if existing_faculty:
        return {"message": "Login successful", "faculty_id": existing_faculty.get("faculty_id"), "name": existing_faculty.get("name")}
    
    raise HTTPException(status_code=401, detail="Invalid credentials or user not found. Please sign up first.")

@router.post("/faculty/signup")
async def faculty_signup(faculty: FacultySignup, db=Depends(get_db)):
    faculty_collection = db["faculties"]
    
    existing_faculty = await faculty_collection.find_one({"faculty_id": faculty.faculty_id})
    if existing_faculty:
        raise HTTPException(status_code=400, detail="Faculty ID already exists.")
        
    existing_email = await faculty_collection.find_one({"email": faculty.email})
    if existing_email:
        raise HTTPException(status_code=400, detail="Email already registered.")
    
    new_faculty = {
        "faculty_id": faculty.faculty_id,
        "name": faculty.name,
        "institute": faculty.institute,
        "email": faculty.email
    }
    
    await faculty_collection.insert_one(new_faculty)
    return {"message": "Sign-up successful", "faculty_id": faculty.faculty_id, "name": faculty.name}

@router.post("/faculty/google")
async def google_auth(auth_data: GoogleAuth, db=Depends(get_db)):
    faculty_collection = db["faculties"]
    
    # Check if user already exists
    existing_faculty = await faculty_collection.find_one({"email": auth_data.email})
    
    if existing_faculty:
        # User exists, log them in
        return {
            "message": "Google Login successful", 
            "faculty_id": existing_faculty.get("faculty_id"), 
            "name": existing_faculty.get("name")
        }
    
    # If not exists, create a new one with a dummy faculty ID (or their email prefix)
    auto_faculty_id = auth_data.email.split("@")[0]
    
    # Check if this auto-generated ID is already taken
    id_check = await faculty_collection.find_one({"faculty_id": auto_faculty_id})
    if id_check:
        auto_faculty_id = f"{auto_faculty_id}_{str(id_check['_id'])[-4:]}"
    
    new_faculty = {
        "faculty_id": auto_faculty_id,
        "name": auth_data.name,
        "email": auth_data.email,
        "institute": "Unknown", # Can be updated later
        "google_auth": True
    }
    
    await faculty_collection.insert_one(new_faculty)
    
    return {
        "message": "Google Sign-up successful", 
        "faculty_id": auto_faculty_id, 
        "name": auth_data.name
    }
