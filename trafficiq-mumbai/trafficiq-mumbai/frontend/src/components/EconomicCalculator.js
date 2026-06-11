import React, { useState } from "react";
import { calculateRoi } from "../services/api";
import Card from "./Card";

export default function EconomicCalculator() {
  const [project_type, setType] = useState("flyover");
  const mumbaiLocations = [
    "Andheri",
    "Bandra",
    "Dadar",
    "Powai",
    "Goregaon",
    "Worli",
    "Sion",
    "Kurla",
    "Colaba",
    "BKC",
  ];
  const [location, setLocation] = useState("Andheri");
  const [project_cost, setCost] = useState(500000000);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState(null);

  const submit = async () => {
    setErr(null);
    if (!project_cost || project_cost <= 0) {
      setErr("Enter a valid positive cost");
      return;
    }
    setLoading(true);
    try {
      const r = await calculateRoi({ project_type, location, project_cost });
      setResult(r);
    } catch (e) {
      setErr(e.message);
    } finally {
      setLoading(false);
    }
  };

  const actions = (
    <>
      <div className="form-grid">
        <label className="inline">
          Type
          <select
            value={project_type}
            onChange={(e) => setType(e.target.value)}
          >
            <option value="flyover">Flyover</option>
            <option value="road_widening">Road Widening</option>
            <option value="signal_upgrade">Signal Upgrade</option>
          </select>
        </label>
        <label className="inline">
          Location
          <select
            value={location}
            onChange={(e) => setLocation(e.target.value)}
          >
            {mumbaiLocations.map((l) => (
              <option key={l} value={l}>
                {l}
              </option>
            ))}
          </select>
        </label>
        <label className="inline">
          Cost (₹)
          <input
            type="number"
            value={project_cost}
            min={1000000}
            onChange={(e) => setCost(Number(e.target.value))}
          />
        </label>
      </div>
      <div className="action-buttons">
        <button className="btn" disabled={loading} onClick={submit}>
          {loading ? "Calculating..." : "Calculate"}
        </button>
      </div>
    </>
  );

  const roiPct = result?.roi_percentage_10year ?? 0;
  const payback = result?.payback_period_years ?? 0;
  const priority = result?.priority_score ?? 0;
  const locationFactor = result?.location_factor ?? 1;
  const roiBar = Math.min(100, Math.max(0, roiPct / 2));

  return (
    <Card
      title="Economic Impact & ROI"
      subtitle="Savings • Payback • Priority"
      actions={actions}
      status={loading ? { label: "Calculating..." } : undefined}
    >
      {err && <div className="error-text">{err}</div>}
      {!result && !err && (
        <div className="loading-text centered">
          Enter project details above then Calculate ROI.
        </div>
      )}
      {result && (
        <div className="result-block">
          <div style={{ fontSize: ".7rem", color: "#475569" }}>
            Location factor applied:{" "}
            <strong>{locationFactor.toFixed(2)}</strong>
          </div>
          <div className="result-grid">
            <div className="metric">
              <h4>Annual Savings</h4>
              <div className="value">
                ₹{result.annual_savings.toLocaleString()}
              </div>
            </div>
            <div className="metric">
              <h4>Payback</h4>
              <div className="value">{payback}y</div>
              <div className="sub">Years</div>
            </div>
            <div className="metric">
              <h4>10y ROI</h4>
              <div className="value">{roiPct}%</div>
              <div className="sub">vs cost</div>
            </div>
            <div className="metric">
              <h4>Priority</h4>
              <div className="value">{priority}</div>
              <div className="sub">Score</div>
            </div>
          </div>
          <div style={{ marginTop: ".75rem" }}>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                fontSize: ".65rem",
                marginBottom: ".25rem",
              }}
            >
              <span>ROI Progress (scaled)</span>
              <span>{roiPct}%</span>
            </div>
            <div className="progress-bar">
              <span style={{ width: roiBar + "%" }} />
            </div>
          </div>
        </div>
      )}
    </Card>
  );
}
