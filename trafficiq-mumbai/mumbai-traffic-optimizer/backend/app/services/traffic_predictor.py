from __future__ import annotations
from pathlib import Path
import pickle
from datetime import datetime
import random
import pandas as pd

MODEL_PATH = Path(__file__).resolve().parent.parent / "ml_models" / "traffic_model.pkl"


class TrafficPredictorService:
    def __init__(self):
        self.model = None
        self._load_or_stub()
        self.routes = [
            "Western Express Highway", "Eastern Express Highway", "Sion-Panvel Highway",
            "LBS Marg", "SV Road", "Jogeshwari-Vikhroli Link Road"
        ]

    def _load_or_stub(self):
        if MODEL_PATH.exists():
            try:
                with open(MODEL_PATH, "rb") as f:
                    self.model = pickle.load(f)
            except Exception:
                self.model = None

    def _feature_row(self, route_id: str, target_time: datetime) -> pd.DataFrame:
        hour = target_time.hour
        dow = target_time.weekday()
        month = target_time.month
        is_weekend = 1 if dow >= 5 else 0
        is_peak = 1 if (8 <= hour <= 10 or 18 <= hour <= 20) and not is_weekend else 0
        weather_condition = random.choice(["Clear", "Rain", "Clouds"])
        is_festival = 1 if random.random() < 0.05 else 0
        rainfall = 1 if weather_condition == "Rain" else 0
        temp = 30 + random.random() * 5
        hist_avg = 5 + (2 if is_peak else 0) + (1 if weather_condition == "Rain" else 0)
        return pd.DataFrame([{
            "hour": hour,
            "dow": dow,
            "month": month,
            "is_weekend": is_weekend,
            "is_peak": is_peak,
            "rainfall": rainfall,
            "temperature": temp,
            "is_festival": is_festival,
            "hist_avg": hist_avg
        }])

    def predict_congestion(self, route_id: str, target_time: datetime):
        features = self._feature_row(route_id, target_time)
        if self.model:
            pred = float(self.model.predict(features)[0])
            sims = []
            for _ in range(5):
                jitter = features.copy()
                jitter["temperature"] += random.uniform(-1, 1)
                sims.append(float(self.model.predict(jitter)[0]))
            variance = pd.Series(sims).var() + 1e-6
            confidence = 1 / (1 + variance)
        else:
            base = features["hist_avg"].iloc[0]
            noise = random.uniform(-1, 1)
            pred = max(1, min(10, base + noise))
            confidence = 0.6 + random.random() * 0.2
        return round(pred, 2), round(confidence, 3)


predictor_service = TrafficPredictorService()
