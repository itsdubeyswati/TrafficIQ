from pydantic import BaseModel
from datetime import datetime

class TrafficPrediction(BaseModel):
    route_id: str
    target_time: datetime
    congestion_level: float
    confidence: float

class SignalOptimizationResult(BaseModel):
    intersection_id: str
    recommended_cycle_time: float
    expected_flow_improvement_pct: float
