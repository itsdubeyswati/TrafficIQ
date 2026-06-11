from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from typing import Optional
from models import predict_congestion, optimize_signal_timing, calculate_infrastructure_roi, ROIRequest

app = FastAPI(title="TrafficIQ Mumbai MVP", version="0.1.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get('/api/predict/{route_id}')
def api_predict(route_id: str, hour: int, weather: str, day_type: Optional[str] = None):
    try:
        return predict_congestion(route_id, hour, weather, day_type)
    except ValueError as e:
        raise HTTPException(status_code=404, detail=str(e))


@app.get('/api/optimize/{intersection_id}')
def api_optimize(intersection_id: str, north_flow: int, south_flow: int, east_flow: int, west_flow: int):
    flows = {"N": north_flow, "S": south_flow, "E": east_flow, "W": west_flow}
    try:
        return optimize_signal_timing(intersection_id, flows)
    except ValueError as e:
        raise HTTPException(status_code=404, detail=str(e))


@app.post('/api/calculate-roi')
def api_calculate_roi(req: ROIRequest):
    try:
        return calculate_infrastructure_roi(req.project_type, req.location, req.project_cost)
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))


@app.get('/')
def root():
    return {"message": "TrafficIQ Mumbai MVP running", "endpoints": ["/api/predict/{route_id}", "/api/optimize/{intersection_id}", "/api/calculate-roi"]}


@app.get('/api/health')
def health():
    return {"status": "ok"}
