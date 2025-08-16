# TrafficIQ (Mumbai) – Smart Urban Traffic Optimization MVP

Minimal, presentation‑ready MVP focused on three core capabilities for Mumbai urban traffic ops:

1. Congestion Forecast (current + hourly day profile)
2. Signal Timing Optimization (cycle length & green split suggestion)
3. Economic Impact & ROI (savings, payback, priority score)

> This repo currently contains two folders:
>
> - `trafficiq-mumbai/` – the cleaned, interview‑oriented 3‑feature MVP (primary focus)
> - `mumbai-traffic-optimizer/` – earlier broader prototype scaffold (not required for the MVP demo)

---

## ️🎯 Why This MVP Exists

Hiring / demo contexts usually value: clear scope, fast spin‑up, visible results, and an extensible path to “real” intelligence later. This MVP shows end‑to‑end flow (frontend ⇄ API ⇄ simple heuristics) while deliberately keeping models and data light.

---

## 🧱 Architecture (MVP Folder `trafficiq-mumbai/`)

Frontend (React + Recharts) → FastAPI Backend (Python 3.8) → Heuristic Engines (in‑memory)

No database, queues, or external services for simplicity. All responses are deterministic based on inputs.

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

## ⚙️ Tech Stack (MVP)

Backend: FastAPI, Pydantic (heuristic logic – no ML yet)
Frontend: React (CRA/Vite style), Recharts for charts, Axios for API calls
Language Targets: Python 3.8+, Node 18+

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

## 📡 API (MVP Endpoints)

| Purpose                       | Method | Path                              | Query / Body Params                                   |
| ----------------------------- | ------ | --------------------------------- | ----------------------------------------------------- | ---- | --- | ------ |
| Congestion prediction (point) | GET    | `/api/predict/{route_id}`         | hour (0–23), weather (clear                           | rain | fog | storm) |
| Signal timing optimization    | GET    | `/api/optimize/{intersection_id}` | north_flow, south_flow, east_flow, west_flow (veh/hr) |
| Economic ROI calculator       | POST   | `/api/calculate-roi`              | JSON body: project_type, location, project_cost       |

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

## 🧠 Heuristic Logic Summary

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

## 🔄 Extending Roadmap (Suggested)

| Area     | Next Step                                                            |
| -------- | -------------------------------------------------------------------- |
| Data     | Integrate live traffic feeds, persistent store (Postgres)            |
| ML       | Replace heuristic congestion with time‑series model (Prophet / LSTM) |
| Signals  | Real adaptive control (reinforcement / SCOOT-like simulation)        |
| ROI      | Calibrate with empirical delay & emission factors                    |
| Platform | Auth, multi‑tenant dashboards, role-based KPIs                       |
| Ops      | Containerize fully, CI pipeline, test suite                          |

---

## ✅ Development Scripts

(Optional) add to `package.json` or a Makefile later:

- `npm run lint` / ESLint
- `pytest` (once tests added)

---

## 🧪 Testing (Future)

Suggest: FastAPI endpoint tests (pytest + httpx), component tests (Jest + React Testing Library) once logic stabilizes.

---

## 🤝 Contributing (Internal / Future)

1. Fork (or feature branch)
2. Create branch: `feature/<short-desc>`
3. Keep PRs small & focused
4. Add/update docs & (later) tests

---

## 📦 Docker (Optional Sketch)

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

## 🧾 Interview Talking Points (Cheat Sheet)

- Clear MVP boundaries → prevents scope creep.
- Deterministic heuristics → explainable + placeholders for ML.
- Frontend separation → can be swapped for native/mobile later.
- Extensible data model → easy to introduce persistence & analytics.
- Performance: All in‑memory; cold start <1s; ideal for demo.

---

## 🙋 FAQ (Anticipated)

**Q:** Why no database now?  
**A:** Keeps demo friction low; memory model is enough for deterministic showcase.

**Q:** How would you productionize?  
**A:** Add persistence + telemetry → calibrate ML model → CI/CD + container orchestration.

**Q:** Where do ML hooks go?  
**A:** Replace congestion heuristic call site and add a model service/container later.

---

Feel free to adapt / trim sections based on the target audience (recruiter vs. engineer). Good luck with the demo!
