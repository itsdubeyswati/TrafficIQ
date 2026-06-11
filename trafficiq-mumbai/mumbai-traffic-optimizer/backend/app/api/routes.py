from fastapi import APIRouter, HTTPException, Query
from datetime import datetime, timedelta
from ..services.traffic_predictor import predictor_service
from ..services.signal_optimizer import optimize_signal_timing, SAMPLE_INTERSECTIONS
from ..services.economic_calculator import calculate_infrastructure_roi, analyze_new_project
from ..services.data_collector import get_current_status, get_traffic_health_score, get_alternative_routes

router = APIRouter()


@router.get("/traffic/predict/{route_id}")
def predict_route(route_id: str, hours_ahead: int = Query(4, ge=1, le=6)):
    predictions = []
    now = datetime.utcnow()
    for h in range(1, hours_ahead + 1):
        target = now + timedelta(hours=h)
        level, confidence = predictor_service.predict_congestion(route_id, target)
        predictions.append({
            "route_id": route_id,
            "target_time": target.isoformat(),
            "congestion_level": level,
            "confidence": confidence
        })
    return {"predictions": predictions}


@router.get("/traffic/current-status")
def current_status():
    return {"status": get_current_status()}


@router.get("/signals/optimization/{intersection_id}")
def optimize_signal(intersection_id: str):
    intersection = next((i for i in SAMPLE_INTERSECTIONS if i["id"] == intersection_id), None)
    if not intersection:
        raise HTTPException(status_code=404, detail="Intersection not found")
    result = optimize_signal_timing(intersection)
    return result


@router.get("/infrastructure/roi-calculator")
def roi_calculator(project_cost: float, delay_hours: float = 1000, productivity_cost_per_hour: float = 1500,
                   expected_improvement: float = 0.15):
    return calculate_infrastructure_roi(project_cost, delay_hours, productivity_cost_per_hour, expected_improvement)


@router.post("/infrastructure/new-project-analysis")
def new_project_analysis(payload: dict):
    return analyze_new_project(payload)


@router.get("/analytics/traffic-health-score")
def traffic_health():
    return {"traffic_health_score": get_traffic_health_score()}


@router.get("/routes/alternative-suggestions/{origin}/{destination}")
def alternative_suggestions(origin: str, destination: str):
    return {"origin": origin, "destination": destination, "alternatives": get_alternative_routes(origin, destination)}
