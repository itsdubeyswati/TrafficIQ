import React, { useState } from "react";
import { predictCongestion, predictDayProfile } from "../services/api";
import Card from "./Card";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const routes = [
  "western_express_highway",
  "eastern_express_highway",
  "sion_panvel_highway",
  "lbs_marg",
  "sv_road",
  "marine_drive",
  "worli_sea_link",
  "bandra_kurla_complex",
];
const weathers = ["clear", "rain", "heavy_rain"];

export default function TrafficPredictor() {
  const [route, setRoute] = useState(routes[0]);
  const [hour, setHour] = useState(8);
  const [weather, setWeather] = useState("clear");
  const [result, setResult] = useState(null);
  const [dayData, setDayData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState(null);
  const submit = async () => {
    setErr(null);
    setLoading(true);
    try {
      const r = await predictCongestion(route, hour, weather);
      setResult(r);
    } catch (e) {
      setErr(e.message);
    } finally {
      setLoading(false);
    }
  };
  const buildDay = async () => {
    setErr(null);
    setLoading(true);
    setDayData([]);
    try {
      const data = await predictDayProfile(route, weather);
      setDayData(data);
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
          Route
          <select value={route} onChange={(e) => setRoute(e.target.value)}>
            {routes.map((r) => (
              <option key={r} value={r}>
                {formatLabel(r)}
              </option>
            ))}
          </select>
        </label>
        <label className="inline">
          Hour
          <input
            type="number"
            min={0}
            max={23}
            value={hour}
            onChange={(e) => setHour(Number(e.target.value))}
          />
        </label>
        <label className="inline">
          Weather
          <select value={weather} onChange={(e) => setWeather(e.target.value)}>
            {weathers.map((w) => (
              <option key={w}>{w}</option>
            ))}
          </select>
        </label>
      </div>
      <div className="action-buttons">
        <button className="btn" onClick={submit} disabled={loading}>
          Predict
        </button>
        <button className="btn" onClick={buildDay} disabled={loading}>
          Day Profile
        </button>
      </div>
    </>
  );
  return (
    <Card
      title="Congestion Forecast"
      subtitle="Live Point & Day Profile"
      actions={actions}
      status={loading ? { label: "Loading..." } : undefined}
    >
      {err && <div className="error-text">{err}</div>}
      {result && (
        <div className="result-block fade-in">
          <div className="result-grid">
            <div className="metric gradient">
              <h4>Congestion</h4>
              <div className="value">{result.congestion_level}/10</div>
              <div className="sub">Confidence {result.confidence}</div>
              <div className="level-bar">
                <span
                  style={{ width: `${(result.congestion_level / 10) * 100}%` }}
                />
              </div>
            </div>
            <div className="metric">
              <h4>Hour / Wx</h4>
              <div className="value">{result.hour}</div>
              <div className="sub">{result.weather}</div>
              <SeverityBadge level={result.congestion_level} />
            </div>
          </div>
          <ul className="factors-list">
            {result.contributing_factors.map((f) => (
              <li key={f}>{f}</li>
            ))}
          </ul>
        </div>
      )}
      {dayData.length > 0 && (
        <div className="chart-wrapper centered-limit compensate-axis">
          <div className="chart-inner">
            <ResponsiveContainer width="100%" height={220}>
              <LineChart
                data={dayData}
                margin={{ left: 12, right: 12, top: 10, bottom: 4 }}
              >
                <CartesianGrid stroke="#e2e8f0" strokeDasharray="4 4" />
                <XAxis dataKey="hour" fontSize={11} tickLine={false} />
                <YAxis domain={[0, 10]} fontSize={11} tickLine={false} />
                <Tooltip
                  formatter={(v) => `${v}/10`}
                  labelFormatter={(l) => `Hour ${l}`}
                />
                <Line
                  type="monotone"
                  dataKey="level"
                  stroke="#2563eb"
                  strokeWidth={2}
                  dot={false}
                  isAnimationActive={false}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}
    </Card>
  );
}

function SeverityBadge({ level }) {
  let cls = "sev-low";
  if (level >= 7) cls = "sev-high";
  else if (level >= 4) cls = "sev-med";
  const label = level >= 7 ? "High" : level >= 4 ? "Moderate" : "Low";
  return <span className={`severity ${cls}`}>{label}</span>;
}
