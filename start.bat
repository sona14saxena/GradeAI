@echo off
echo ===================================================
echo        Starting GradeAI Evaluation System...
echo ===================================================

echo.
echo [1/2] Starting Backend Service (FastAPI / PyTorch)...
start "GradeAI Backend" cmd /k "cd backend && call venv\Scripts\activate && pip install -r requirements.txt && uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload"

echo [2/2] Starting Frontend Service (Next.js)...
start "GradeAI Frontend" cmd /k "cd frontend && npm install && npm run dev"

echo.
echo Both services are spinning up in separate windows!
echo - Frontend UI: http://localhost:3000
echo - Backend API Docs: http://localhost:8000/docs
echo.
echo Please allow a minute for Next.js and PyTorch models to load into memory.
echo Press any key to close this launcher...
pause >nul
