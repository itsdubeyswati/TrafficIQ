# TrafficIQ Mumbai – Smart Urban Traffic Optimization Platform

TrafficIQ is an extensible urban traffic intelligence platform for the Mumbai network. It currently delivers end‑to‑end functionality across core operational, analytical, and economic decision areas while providing clear seams for advanced data + ML evolution.

## Core Functional Domains (Current)

1. Congestion Intelligence

- Point prediction with hourly day profile
- Contributing factor transparency

2. Signal Operations

- Cycle length derivation (Webster-inspired)
- Directional green split recommendations + visualization

## Repository Modules

- `trafficiq-mumbai/` – Primary maintained implementation (production‑style layout: FastAPI backend + React client)
- `mumbai-traffic-optimizer/` – Earlier broader prototype / sandbox (retained for reference & experimentation)

---

## ️🎯 Project Vision

Deliver a modular, data‑oriented platform that can progress from deterministic heuristics to adaptive, data‑driven control and planning intelligence—without rewriting foundational layers. Initial release emphasizes clarity, correctness, UX polish, and explainability.

---

## 🧱 High‑Level Architecture (Active Module `trafficiq-mumbai/`)

```
┌────────────────────┐        ┌──────────────────────────┐
│ React Frontend     │  HTTP  │ FastAPI Service Layer    │
│  (Recharts, Axios) │ <────> │  (Routing + Validation)  │
└─────────┬──────────┘        └──────────┬───────────────┘
       │                               │
       │                               ▼
       │                 ┌──────────────────────────┐
       │                 │ Domain Heuristics        │
       │                 │  (Congestion | Signals | │
       │                 │   Economic Models)       │
       │                 └──────────┬───────────────┘
       │                               │ (future: data / ML services)
       ▼                               ▼
  User Interaction           (Pluggable persistence + model layer roadmap)
```

Current phase intentionally remains stateless & in‑memory to prioritize iteration speed; architecture is layered for later integration of: persistence (Postgres/Time‑Series DB), real‑time ingestion, ML microservices, and optimization engines.

---

## 📂 Key Project Structure

```
TrafficIQ/
  README.md                <-- (this file)
  trafficiq-mumbai/
    backend/
      main.py              # FastAPI app with 3 endpoints
      requirements.txt
      data/                # Sample JSON (routes, intersections, patterns)
    frontend/
      src/components/      # UI cards (Predictor, Signal Optimizer, ROI)
      src/services/api.js  # Axios wrapper
      package.json
  mumbai-traffic-optimizer/ (legacy broader prototype)
```

---

## ⚙️ Tech Stack

Backend: FastAPI, Pydantic (typed request/response contracts)  
Frontend: React, Recharts (data viz), Axios (API abstraction)  
Languages / Runtime Targets: Python 3.8+, Node 18+  
Design Emphasis: Deterministic logic first → smooth pathway to ML injection points.

---

## 🚀 Quick Start (Windows PowerShell)

### 1. Backend

```powershell
cd trafficiq-mumbai/backend
python -m venv .venv
.\.venv\Scripts\Activate.ps1
pip install -r requirements.txt
uvicorn main:app --reload
```

Visit: http://127.0.0.1:8000/docs

### 2. Frontend

Open a new terminal:

```powershell
cd trafficiq-mumbai/frontend
npm install
npm start
```

Visit: http://localhost:3000 (or the port your dev server reports)

---

## 📡 API Surface (Current Active Set)

| Domain     | Method | Path                              | Parameters                                                           |
| ---------- | ------ | --------------------------------- | -------------------------------------------------------------------- | ---- | ----------- |
| Congestion | GET    | `/api/predict/{route_id}`         | Query: `hour` (0–23), `weather` (clear                               | rain | heavy_rain) |
| Signals    | GET    | `/api/optimize/{intersection_id}` | Query: `north_flow`, `south_flow`, `east_flow`, `west_flow` (veh/hr) |
| Economics  | POST   | `/api/calculate-roi`              | JSON: `project_type`, `location`, `project_cost`                     |

### Example Requests

```http
GET /api/predict/western_express_highway?hour=8&weather=rain
GET /api/optimize/bandra_linking_road?north_flow=800&south_flow=750&east_flow=600&west_flow=650
POST /api/calculate-roi
Content-Type: application/json
{
  "project_type": "flyover",
  "location": "Andheri",
  "project_cost": 500000000
}
```

### Sample Response (Predict)

```json
{
  "route_id": "western_express_highway",
  "hour": 8,
  "weather": "rain",
  "congestion_index": 0.82,
  "severity": "High",
  "day_profile": [ { "hour":0, "index":0.22 }, ... ]
}
```

(Values are heuristic; `day_profile` is an hourly array to power the chart.)

---

## 🧠 Domain Logic Summary

- Congestion: Base route factor × hourly pattern × weather multiplier.
- Signal Optimization: Simplified Webster cycle + proportional green splits by approach volume.
- ROI: Savings from reduced delay + emissions proxy → payback period + priority score.

These are intentionally transparent (good for interviews) and are natural insertion points for real data / ML later.

---

## 🖥️ UI Highlights

- Card layout: 3 feature panels
- Consistent typography & spacing
- Day profile line chart (centered) & signal split bar chart
- Dark / light theme toggle

---

## 🔄 Roadmap (Planned Evolution)

| Area     | Next Step                                                            |
| -------- | -------------------------------------------------------------------- |
| Data     | Integrate live traffic feeds, persistent store (Postgres)            |
| ML       | Replace heuristic congestion with time‑series model (Prophet / LSTM) |
| Signals  | Real adaptive control (reinforcement / SCOOT-like simulation)        |
| ROI      | Calibrate with empirical delay & emission factors                    |
| Platform | Auth, multi‑tenant dashboards, role-based KPIs                       |
| Ops      | Containerize fully, CI pipeline, test suite                          |

---

## ✅ Development Practices

(Optional) add to `package.json` or a Makefile later:

- `npm run lint` / ESLint
- `pytest` (once tests added)

---

## 🧪 Testing Strategy (Planned)

Suggest: FastAPI endpoint tests (pytest + httpx), component tests (Jest + React Testing Library) once logic stabilizes.

---

## 🤝 Contributing

1. Fork (or feature branch)
2. Create branch: `feature/<short-desc>`
3. Keep PRs small & focused
4. Add/update docs & (later) tests

---

## 📦 Containerization

A simple compose could run backend + frontend; legacy folder already has an example `docker-compose.yml` you can adapt.

---

## 🔐 License

Choose one (MIT / Apache-2.0). Example placeholder:

```
MIT License © 2025 Your Name
```

---

## 🗂 GitHub: Add & Push This Project

If not already a git repo:

```powershell
cd C:\Users\swati\Desktop\Projects\TrafficIQ
git init
git add .
git commit -m "feat: initial TrafficIQ Mumbai MVP"
```

Create a new empty repo on GitHub (e.g. `TrafficIQ-Mumbai`). Then add remote & push:

```powershell
git remote add origin https://github.com/<your-username>/TrafficIQ-Mumbai.git
git branch -M main
git push -u origin main
```

Subsequent changes:

```powershell
git add README.md
git commit -m "docs: improve README"
git push
```

If already initialized with another remote, update it:

```powershell
git remote set-url origin https://github.com/<your-username>/TrafficIQ-Mumbai.git
```

---

## 📌 Architectural Talking Points

- Layered design → API contracts stable while internals evolve.
- Deterministic heuristics provide baselines + interpretability.
- Clear insertion points for ML (replace congestion + optimization modules).
- Frontend decoupled: enables future native/mobile or dashboard variants.
- Low operational footprint now; accelerates experimentation.

---

## 🙋 FAQ

**Q:** Why no database now?  
**A:** Keeps demo friction low; memory model is enough for deterministic showcase.

**Q:** How would you productionize?  
**A:** Add persistence + telemetry → calibrate ML model → CI/CD + container orchestration.

**Q:** Where do ML hooks go?  
**A:** Replace congestion heuristic call site and add a model service/container later.

---

Feel free to tailor wording per stakeholder (operations, engineering leadership, data science). Contributions & issue discussions welcome.
