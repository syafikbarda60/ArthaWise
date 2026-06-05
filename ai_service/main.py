from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
import numpy as np
import tensorflow as tf
import pickle
import os
import uvicorn
import datetime
import warnings

warnings.filterwarnings('ignore')

app = FastAPI(title="ArthaWise AI API")

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
# Cek apakah folder saved_models ada di dalam ai_service (untuk Hugging Face deploy)
if os.path.exists(os.path.join(BASE_DIR, "saved_models")):
    MODEL_DIR = os.path.join(BASE_DIR, "saved_models")
else:
    MODEL_DIR = os.path.join(BASE_DIR, "../saved_models")

classifier_model = None
forecasting_model = None
label_encoder = None
scaler_classifier = None
scaler_forecast = None

@app.on_event("startup")
def load_models():
    global classifier_model, forecasting_model, label_encoder, scaler_classifier, scaler_forecast
    try:
        print("Loading models into memory...")
        classifier_model = tf.keras.models.load_model(os.path.join(MODEL_DIR, "classifier_model.keras"), compile=False)
        forecasting_model = tf.keras.models.load_model(os.path.join(MODEL_DIR, "forecasting_model.keras"), compile=False)
        
        with open(os.path.join(MODEL_DIR, "label_encoder.pkl"), "rb") as f:
            label_encoder = pickle.load(f)
            
        with open(os.path.join(MODEL_DIR, "scaler_classifier.pkl"), "rb") as f:
            scaler_classifier = pickle.load(f)
            
        with open(os.path.join(MODEL_DIR, "scaler_forecast.pkl"), "rb") as f:
            scaler_forecast = pickle.load(f)
        print("All models loaded successfully!")
    except Exception as e:
        print(f"Error loading models: {e}")

class ClassifyRequest(BaseModel):
    title: str
    amount: float
    type: str

class ForecastRequest(BaseModel):
    recent_expenses: list[float]
    days_to_predict: int = 1

@app.post("/api/ai/classify")
def classify_transaction(req: ClassifyRequest):
    if classifier_model is None or scaler_classifier is None or label_encoder is None:
        raise HTTPException(status_code=500, detail="AI Model not loaded")
    
    try:
        # Input 0: text (title) as tf.string tensor shape (1,1)
        text_in = tf.constant([[req.title]])
        
        # Input 1: numeric features [amount_scaled, type_encoded] shape (1,2)
        amt_scaled = float(scaler_classifier.transform([[req.amount]])[0][0])
        type_enc = 1.0 if req.type == "income" else 0.0
        num_in = np.array([[amt_scaled, type_enc]], dtype=np.float32)
        
        pred = classifier_model.predict([text_in, num_in], verbose=0)
        cat_idx = int(np.argmax(pred[0]))
        category = label_encoder.inverse_transform([cat_idx])[0]
        confidence = float(np.max(pred[0]))
        
        return {
            "success": True,
            "category": category,
            "confidence": confidence
        }
    except Exception as e:
        print(f"Classify error: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/ai/forecast")
def forecast_expenses(req: ForecastRequest):
    if forecasting_model is None:
        raise HTTPException(status_code=500, detail="AI Model not loaded")
    
    try:
        # Scale history
        history_arr = np.array(req.recent_expenses).reshape(-1, 1)
        scaled_history = scaler_forecast.transform(history_arr)
        
        # Sesuai metadata: window_size = 14
        window_size = 14
        if len(scaled_history) < window_size:
            pad = np.zeros((window_size - len(scaled_history), 1))
            scaled_history = np.vstack([pad, scaled_history])
        else:
            scaled_history = scaled_history[-window_size:]
            
        # Bentuk tensor [batch, time_steps, features]
        current_seq = scaled_history.reshape(1, window_size, 1)
        predictions = []
        
        for _ in range(req.days_to_predict):
            pred = forecasting_model.predict(current_seq, verbose=0)
            predictions.append(pred[0][0])
            # Slide window: hapus hari terlama, masukkan prediksi baru
            current_seq = np.append(current_seq[:, 1:, :], pred.reshape(1, 1, 1), axis=1)
            
        # Kembalikan ke angka Rupiah asli (inverse transform)
        pred_unscaled = scaler_forecast.inverse_transform(np.array(predictions).reshape(-1, 1))
        
        now = datetime.datetime.now()
        results = []
        for i, val in enumerate(pred_unscaled):
            next_date = now + datetime.timedelta(days=i+1)
            # Pastikan expense tidak negatif
            expense_val = max(0, float(val[0]))
            results.append({
                "date": next_date.isoformat(),
                "predicted_expense": expense_val
            })
            
        # Calculate heuristic confidence based on data variance
        variance = float(np.var(history_arr)) if len(history_arr) > 0 else 0.0
        mean_val = float(np.mean(history_arr)) if len(history_arr) > 0 else 0.0
        
        base_conf = 0.96
        # Penalty increases if variance is very high compared to the mean (coefficient of variation)
        cv = (np.sqrt(variance) / (mean_val + 1e-5)) if mean_val > 0 else 0
        penalty = min(0.35, cv * 0.2)
        confidence_val = float(max(0.40, base_conf - penalty)) * 100
            
        return {
            "success": True,
            "data": results,
            "confidence": round(confidence_val, 1)
        }
    except Exception as e:
        print(f"Forecast Error: {e}")
        raise HTTPException(status_code=500, detail=str(e))
