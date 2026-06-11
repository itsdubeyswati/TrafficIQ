"""Training script to build a simple RandomForest model on synthetic data."""
from pathlib import Path
import pandas as pd
import random
from datetime import datetime, timedelta
from sklearn.ensemble import RandomForestRegressor
import pickle

OUT_PATH = Path(__file__).resolve().parent / "traffic_model.pkl"

ROUTES = [
    "Western Express Highway",
    "Eastern Express Highway",
    "Sion-Panvel Highway",
    "LBS Marg",
    "SV Road",
    "Jogeshwari-Vikhroli Link Road",
]


def synthesize(n_days: int = 14):
    rows = []
    now = datetime.utcnow().replace(minute=0, second=0, microsecond=0)
    for d in range(n_days):
        day = now - timedelta(days=d)
        for hour in range(24):
            ts = day.replace(hour=hour)
            for r in ROUTES:
                dow = ts.weekday()
                is_weekend = 1 if dow >= 5 else 0
                is_peak = 1 if (8 <= hour <= 10 or 18 <= hour <= 20) and not is_weekend else 0
                weather = random.choice(["Clear", "Rain", "Clouds"])
                rainfall = 1 if weather == "Rain" else 0
                temperature = 30 + random.random() * 5
                is_festival = 1 if random.random() < 0.03 else 0
                hist_avg = 5 + (2 if is_peak else 0) + (1 if rainfall else 0)
                congestion = hist_avg + random.uniform(-1, 1) + is_festival * 1.2
                congestion = max(1, min(10, congestion))
                rows.append({
                    "hour": hour,
                    "dow": dow,
                    "month": ts.month,
                    "is_weekend": is_weekend,
                    "is_peak": is_peak,
                    "rainfall": rainfall,
                    "temperature": temperature,
                    "is_festival": is_festival,
                    "hist_avg": hist_avg,
                    "congestion": congestion
                })
    return pd.DataFrame(rows)


def train():
    df = synthesize()
    X = df.drop(columns=["congestion"])
    y = df["congestion"]
    model = RandomForestRegressor(n_estimators=60, random_state=42)
    model.fit(X, y)
    OUT_PATH.parent.mkdir(parents=True, exist_ok=True)
    with open(OUT_PATH, "wb") as f:
        pickle.dump(model, f)
    print(f"Model saved to {OUT_PATH}")


if __name__ == "__main__":
    train()
