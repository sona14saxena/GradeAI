import warnings
warnings.filterwarnings("ignore", message=".*protected namespace.*", category=UserWarning)

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from .api.endpoints import uploads, evaluations, analytics, auth
from .config import settings

app = FastAPI(title="GradeAI API", description="AI-based Handwritten Answer Sheet Evaluation System")

# Configure CORS for Deployment
app.add_middleware(
    CORSMiddleware,
    allow_origin_regex="https?://.*",
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(uploads.router, prefix="/api/v1/uploads", tags=["Uploads"])
app.include_router(evaluations.router, prefix="/api/v1/evaluations", tags=["Evaluations"])
app.include_router(analytics.router, prefix="/api/v1/analytics", tags=["Analytics"])
app.include_router(auth.router, prefix="/api/v1/auth", tags=["Auth"])


@app.get("/")
def read_root():
    return {"message": "Welcome to GradeAI API"}
