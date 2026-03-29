FROM python:3.10-slim

# Install system dependencies for OCR and PDF processing
RUN apt-get update && apt-get install -y \
    tesseract-ocr \
    tesseract-ocr-eng \
    poppler-utils \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app

# Copy requirements
COPY requirements.txt .

# Install PyTorch (CPU version to save space/memory on servers)
RUN pip install torch --index-url https://download.pytorch.org/whl/cpu

# Install the rest of the Python dependencies
RUN pip install --no-cache-dir -r requirements.txt

# Pre-download NLTK data during build
RUN python -c "import nltk; nltk.download('punkt'); nltk.download('stopwords'); nltk.download('wordnet')"

# Pre-download SentenceTransformer model during build
RUN python -c "from sentence_transformers import SentenceTransformer; SentenceTransformer('all-MiniLM-L6-v2')"

# Copy application code
COPY . .

EXPOSE 8000

# Render dynamically assigns a port via the PORT environment variable.
# We also restrict to 1 worker so PyTorch ML doesn't crash the free tier's 512MB memory limit.
CMD gunicorn app.main:app -w 1 -k uvicorn.workers.UvicornWorker --bind 0.0.0.0:${PORT:-8000} --timeout 120
