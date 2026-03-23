# AI-Based Handwritten Answer Sheet Evaluation System

## Project Overview

Welcome to the open-source **AI-Based Handwritten Answer Sheet Evaluation System**. 
This is a full-stack web application that automatically evaluates scanned handwritten student answer sheets against a predefined model answer key using advanced OCR and NLP. It empowers educators by reducing repetitive grading and extracting detailed analytics on student and class performance.

### Key Capabilities:
- Accept scanned handwritten notebooks (PDF format).
- Extract text with high accuracy utilizing Transformer OCR pipelines.
- Evaluate text content semantically versus established model answers.
- Intelligent rubric assignment utilizing NLP.
- Generating insightful, per-student, and per-class analytics.

---

## Evaluation Methodology & Architecture

The grading process utilizes a **Hybrid Evaluation Model** combining:
1. **Semantic Similarity Mapping**: Leverages Transformer-based Text Embeddings (e.g. `all-MiniLM-L6-v2` / Sentence-BERT or RoBERTa).
2. **Keyword & Concept Matching**: Analyzes technical terminology matching to boost confidence and ensure core concepts are not missed.
3. **Rubric-based Logic**: Maps similarity matrices proportionally to grading rubrics (e.g., semantic similarity > 85% maps to full points, 60-85% maps proportional, <60% maps heavily penalized).

### Architecture Flow:
1. **Upload Phase**: Teacher uploads Model Answers and Student Notebook PDF arrays. Handled by FastAPI and multi-part robust ingestion.
2. **Pre-processing (PDF -> Images)**: The system bursts the PDF files into raw images ensuring high fidelity.
3. **OCR Extraction Engine**: Text extraction pipeline utilizes State-Of-The-Art Transformer OCR / Tesseract hybrid structures. 
4. **NLP Vectorization & Analysis**:
    - NLTK Tokenization, Lemmatization, Stop-word resolution.
    - Sentence-BERT encodes both students’ and models’ vectors.
    - Compute Cosine similarity across vector dimensions.
5. **Scoring Logic Execution**: Computes the final assigned score based on the matching confidence tier matrix.
6. **Analytics Database (MongoDB)**: Saves grades, strengths, weaknesses, and metadata into a highly scaled NoSQL DB.
7. **Teacher Dashboard (React/Next)**: Visualizes results through structured graphs (Chart.js), aggregations, and tabular metrics.

### Similarity Logic Explanation:
When calculating how "close" a student's answer is to the model answer, standard character matching fails due to paraphrasing. We solve this by passing the decoded OCR text into Sentence-BERT.
- `E_student` = Embeddings(student_text)
- `E_model` = Embeddings(model_text)
- `Similarity Score` = Cosine(E_student, E_model)

If the student explained the concept fundamentally identically but with totally different wording, the `Cosine` score still remains `> 0.85`, granting them full marks automatically. Partial marks utilize linear mapping interpolations.

### Model Fine-tuning Pipeline
The backend is architected loosely coupled to allow swapping out models. To improve accuracy over time:
1. Manual override events on grades by teachers are logged.
2. The feedback loop records the OCR text, teacher-assigned correct grade, and logs it as fine-tuning supervised pairs.
3. Periodically, the Sentence-Transformer head can be retrained on this specific context-domain using margin MSE loss optimization.

---

## Installation & Deployment

### Backend (Python / FastAPI)
1. `cd backend`
2. `python -m venv venv`
3. `source venv/Scripts/activate`
4. `pip install -r requirements.txt` (Installs PyTorch, Transformers, FastAPI, Motor, etc.)
5. Configure `.env` with `MONGODB_URL`.
6. Run using `uvicorn app.main:app --reload`

### Frontend (Next.js / React)
1. `cd frontend`
2. `npm install`
3. `npm run dev`

### Tech Stack
* **Frontend**: Next.js, TailwindCSS, Chart.js
* **Backend**: Python 3, FastAPI, Motor (async Mongo), Celery (planned)
* **ML Engines**: PyTesseract, Sentence-BERT, HuggingFace Transformers
* **Database**: MongoDB

---
*Created by DeepMind Antigravity AI*
