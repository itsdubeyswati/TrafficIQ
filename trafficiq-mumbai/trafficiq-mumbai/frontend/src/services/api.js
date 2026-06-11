import axios from "axios";
const BASE = process.env.REACT_APP_API || "http://localhost:8000";

const api = axios.create({ baseURL: BASE, timeout: 10000 });
api.interceptors.response.use(
  (r) => r,
  (err) => {
    // Debug log to help inspect network issues in console
    console.error("[API ERROR]", {
      url: err.config?.url,
      method: err.config?.method,
      baseURL: err.config?.baseURL,
      message: err.message,
      status: err.response?.status,
      detail: err.response?.data,
    });
    const msg = err.response?.data?.detail || err.message || "Request failed";
    return Promise.reject(new Error(msg));
  }
);

export const predictCongestion = async (route_id, hour, weather) => {
  const { data } = await api.get(`/api/predict/${route_id}`, {
    params: { hour, weather },
  });
  return data;
};
export const optimizeSignal = async (intersection_id, flows) => {
  const { north, south, east, west } = flows;
  const { data } = await api.get(`/api/optimize/${intersection_id}`, {
    params: {
      north_flow: north,
      south_flow: south,
      east_flow: east,
      west_flow: west,
    },
  });
  return data;
};
export const calculateRoi = async (payload) => {
  const { data } = await api.post(`/api/calculate-roi`, payload);
  return data;
};
export const predictDayProfile = async (route_id, weather) => {
  const hours = [...Array(24).keys()];
  const results = await Promise.all(
    hours.map((h) => predictCongestion(route_id, h, weather).catch(() => null))
  );
  return hours.map((h, i) => ({
    hour: h,
    level: results[i]?.congestion_level ?? null,
  }));
};
