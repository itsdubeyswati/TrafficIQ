# TrafficIQ Mumbai MVP

Minimal 3-feature MVP (prediction, signal optimization, ROI) for interview demonstration.

## Features

1. Traffic Congestion Predictor (rule-based)
2. Signal Timing Optimizer (Webster's formula)
3. Economic Impact Calculator (ROI & payback)

## Backend

FastAPI single-file app in `backend/main.py` with three endpoints.

Run locally (PowerShell):

```
cd trafficiq-mumbai/backend
python -m venv .venv; .\.venv\Scripts\Activate.ps1
pip install -r requirements.txt
uvicorn main:app --reload
```

Visit http://localhost:8000/docs

## Frontend

Simple React app.

```
cd trafficiq-mumbai/frontend
npm install
npm start
```

## Example Calls

```
GET /api/predict/western_express_highway?hour=8&weather=rain
GET /api/optimize/bandra_linking_road?north_flow=800&south_flow=750&east_flow=600&west_flow=650
POST /api/calculate-roi {"project_type":"flyover","location":"Andheri","project_cost":500000000}
```

## Next Steps (If Extended)

- Real data ingestion & ML model
- Persistent storage
- Auth & multi-user roles
- Visualization enhancements
