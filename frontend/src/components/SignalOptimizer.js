import React, { useState } from "react";
import { optimizeSignal } from "../services/api";
import Card from "./Card";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";

const intersections = [
  "bandra_linking_road",
  "andheri_subway",
  "powai_junction",
  "worli_naka",
  "dadar_tt_circle",
];

export default function SignalOptimizer() {
  const [id, setId] = useState(intersections[0]);
  const [flows, setFlows] = useState({
    north: 800,
    south: 750,
    east: 600,
    west: 650,
  });
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState(null);
  const update = (k, v) => setFlows((f) => ({ ...f, [k]: Number(v) }));
  const submit = async () => {
    setErr(null);
    setLoading(true);
    try {
      const r = await optimizeSignal(id, flows);
      setResult(r);
    } catch (e) {
      setErr(e.message);
    } finally {
      setLoading(false);
    }
  };
  const formatLabel = (s) =>
    s
      .split("_")
      .map((p) => p.charAt(0).toUpperCase() + p.slice(1))
      .join(" ");

  const actions = (
    <>
      <div className="form-grid">
        <label className="inline">
          Intersection
          <select value={id} onChange={(e) => setId(e.target.value)}>
            {intersections.map((i) => (
              <option key={i} value={i}>
                {formatLabel(i)}
              </option>
            ))}
          </select>
        </label>
        {Object.entries(flows).map(([k, v]) => (
          <label className="inline" key={k}>
            {k}
            <input
              type="number"
              value={v}
              min={0}
              onChange={(e) => update(k, e.target.value)}
            />
          </label>
        ))}
      </div>
      <div className="action-buttons">
        <button className="btn" disabled={loading} onClick={submit}>
          Optimize
        </button>
      </div>
    </>
  );
  const chartData = result
    ? Object.entries(result.green_splits).map(([k, v]) => ({
        phase: k,
        seconds: v,
      }))
    : [];
  return (
    <Card
      title="Signal Timing Optimization"
      subtitle="Cycle & Green Split Plan"
      actions={actions}
      status={loading ? { label: "Working..." } : undefined}
    >
      {err && <div className="error-text">{err}</div>}
      {result && (
        <div className="result-block fade-in">
          <div className="result-grid">
            <div className="metric">
              <h4>Current Cycle</h4>
              <div className="value">{result.current_cycle}s</div>
            </div>
            <div className="metric gradient">
              <h4>Optimal Cycle</h4>
              <div className="value">{result.optimal_cycle}s</div>
            </div>
            <div className="metric">
              <h4>Improvement</h4>
              <div className="value">{result.expected_improvement_pct}%</div>
              <ImpBadge pct={result.expected_improvement_pct} />
            </div>
          </div>
          <div
            style={{ marginTop: ".75rem", fontSize: ".7rem", color: "#475569" }}
          >
            Green Splits
          </div>
          <div className="split-bars">
            {Object.entries(result.green_splits).map(([k, v]) => {
              const total =
                Object.values(result.green_splits).reduce((a, b) => a + b, 0) ||
                1;
              const pct = (v / total) * 100;
              return (
                <div className="split-row" key={k}>
                  <div style={{ width: 30, textTransform: "uppercase" }}>
                    {k}
                  </div>
                  <div className="bar">
                    <span style={{ width: pct + "%" }} />
                  </div>
                  <div style={{ width: 40, textAlign: "right" }}>{v}s</div>
                </div>
              );
            })}
          </div>
          <div className="chart-wrapper">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={chartData}
                margin={{ top: 10, right: 6, left: 0, bottom: 0 }}
              >
                <CartesianGrid stroke="#e2e8f0" strokeDasharray="3 3" />
                <XAxis dataKey="phase" fontSize={11} tickLine={false} />
                <YAxis fontSize={11} tickLine={false} />
                <Tooltip />
                <Bar dataKey="seconds" fill="#2563eb" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}
    </Card>
  );
}

function ImpBadge({ pct }) {
  let cls = "sev-low";
  if (pct >= 25) cls = "sev-high";
  else if (pct >= 15) cls = "sev-med";
  const label = pct >= 25 ? "Major" : pct >= 15 ? "Medium" : "Minor";
  return <span className={`severity ${cls}`}>{label}</span>;
}
