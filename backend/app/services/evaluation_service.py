from sentence_transformers import SentenceTransformer, util
import torch
import nltk
from nltk.corpus import stopwords
from nltk.stem import WordNetLemmatizer
from nltk.tokenize import word_tokenize

# NLTK setup: these normally should be downloaded once on startup
# nltk.download('punkt')
# nltk.download('stopwords')
# nltk.download('wordnet')

class EvaluationEngine:
    def __init__(self):
        self.model = SentenceTransformer('all-MiniLM-L6-v2')
        self.lemmatizer = WordNetLemmatizer()
        
        try:
            nltk.data.find('corpora/stopwords')
        except LookupError:
            nltk.download('stopwords')
            nltk.download('punkt')
            nltk.download('wordnet')
            
        self.stop_words = set(stopwords.words('english'))

    def clean_text(self, text: str) -> str:
        if not text:
            return ""
        tokens = word_tokenize(text.lower())
        tokens = [self.lemmatizer.lemmatize(word) for word in tokens if word.isalnum() and word not in self.stop_words]
        return " ".join(tokens)

    def compute_similarity(self, student_answer: str, model_answer: str) -> float:
        """
        Compute cosine similarity between student answer and model answer.
        """
        if not student_answer or not model_answer:
            return 0.0

        student_embedding = self.model.encode(student_answer, convert_to_tensor=True)
        model_embedding = self.model.encode(model_answer, convert_to_tensor=True)

        cosine_scores = util.cos_sim(student_embedding, model_embedding)
        return cosine_scores.item()

    def grade_answer(self, similarity_score: float, max_marks: float) -> float:
        """
        Grading logic based on similarity score.
        """
        if similarity_score >= 0.85:
            return max_marks
        elif 0.60 <= similarity_score < 0.85:
            # Partial marks proportional to similarity mapping (e.g. 60-85 -> 50%-90% marks)
            return round((similarity_score / 0.85) * max_marks, 1)
        else:
            # Low marks
            return round(similarity_score * max_marks * 0.5, 1)

evaluation_engine = EvaluationEngine()
