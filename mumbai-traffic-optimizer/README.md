# TrafficIQ - Mumbai Traffic Optimization Engine

Prototype system providing:

- Traffic congestion prediction (2-4h horizon)
- Signal timing optimization (Webster + heuristic)
- Infrastructure ROI calculator
- Analytics dashboard (React) with health score & visualizations

## Quick Start (Dev)

### Backend (Python/FastAPI)

```
cd mumbai-traffic-optimizer/backend
python -m venv .venv && .venv\Scripts\activate
pip install -r requirements.txt
python app/ml_models/train_model.py
uvicorn app.main:app --reload
```

Visit http://127.0.0.1:8000/docs

### Frontend

```
cd mumbai-traffic-optimizer/frontend
npm install
npm run dev
```

Open http://localhost:5173.

### Docker

```
docker compose up --build
```

Backend: http://localhost:8000 Frontend: http://localhost:3000

## API Summary

GET /api/traffic/predict/{route_id}?hours_ahead=4
GET /api/traffic/current-status
GET /api/signals/optimization/{intersection_id}
GET /api/infrastructure/roi-calculator
POST /api/infrastructure/new-project-analysis
GET /api/analytics/traffic-health-score
GET /api/routes/alternative-suggestions/{origin}/{destination}

## Next Steps

- Integrate real data sources
- Persist readings to Postgres
- Add auth & role-based dashboards
