import axios from "axios";
const API_BASE = import.meta.env.VITE_API_BASE || "http://localhost:8000/api";
export const getCurrentStatus = async () => {
  const res = await axios.get(`${API_BASE}/traffic/current-status`);
  return res.data.status;
};
export const getPredictions = async (route: string) => {
  const res = await axios.get(
    `${API_BASE}/traffic/predict/${encodeURIComponent(route)}?hours_ahead=4`
  );
  return res.data.predictions;
};
export const getTrafficHealthScore = async () => {
  const res = await axios.get(`${API_BASE}/analytics/traffic-health-score`);
  return res.data.traffic_health_score;
};
export const getSignalOptimization = async (intersectionId: string) => {
  const res = await axios.get(
    `${API_BASE}/signals/optimization/${intersectionId}`
  );
  return res.data;
};
export const calculateROI = async (params: Record<string, any>) => {
  const res = await axios.get(`${API_BASE}/infrastructure/roi-calculator`, {
    params,
  });
  return res.data;
};
