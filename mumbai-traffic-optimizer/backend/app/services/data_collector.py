"""Simulated data collection & scheduling."""
from datetime import datetime
import random
from typing import List, Dict
from apscheduler.schedulers.background import BackgroundScheduler
from fastapi import FastAPI

ROUTES = [
    "Western Express Highway",
    "Eastern Express Highway",
    "Sion-Panvel Highway",
    "LBS Marg",
    "SV Road",
    "Jogeshwari-Vikhroli Link Road",
]

_LATEST_STATUS: Dict[str, Dict] = {}


def collect_once():
    now = datetime.utcnow()
    for r in ROUTES:
        hour = now.hour
        dow = now.weekday()
        weekend = dow >= 5
        peak = (8 <= hour <= 10 or 18 <= hour <= 20) and not weekend
        base = 4 + (2 if peak else 0)
        weather = random.choice(["Clear", "Rain", "Clouds"])
        if weather == "Rain":
            base += 1.2
        if random.random() < 0.04:
            base += 1.5
        congestion = max(1, min(10, base + random.uniform(-1, 1)))
        _LATEST_STATUS[r] = {
            "route_id": r,
            "timestamp": now.isoformat(),
            "congestion_level": round(congestion, 2),
            "average_speed": round(50 - congestion * 3, 1),
            "delay_minutes": round(congestion * 2.5, 1),
            "weather": weather,
        }


def get_current_status() -> List[Dict]:
    if not _LATEST_STATUS:
        collect_once()
    return list(_LATEST_STATUS.values())


def get_traffic_health_score() -> int:
    status = get_current_status()
    if not status:
        return 100
    avg_congestion = sum(s["congestion_level"] for s in status) / len(status)
    return max(0, min(100, int(100 - (avg_congestion - 1) * (100 / 9))))


def get_alternative_routes(origin: str, destination: str):
    status = sorted(get_current_status(), key=lambda x: x["congestion_level"])
    return [s["route_id"] for s in status if origin.lower() not in s["route_id"].lower()][:3]


_scheduler: BackgroundScheduler | None = None


def start_scheduler(app: FastAPI):
    global _scheduler
    if _scheduler:
        return
    _scheduler = BackgroundScheduler(timezone="UTC")
    _scheduler.add_job(collect_once, "interval", minutes=15, id="collect_job")
    collect_once()
    _scheduler.start()

    @app.on_event("shutdown")
    async def shutdown():  # pragma: no cover
        if _scheduler:
            _scheduler.shutdown()
