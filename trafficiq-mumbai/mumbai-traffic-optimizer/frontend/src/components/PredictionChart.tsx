import React, { useEffect, useState } from "react";
import { Card, CardContent, Typography, MenuItem, Select } from "@mui/material";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { getPredictions } from "../services/api";
import { Prediction } from "../types";
const routes = [
  "Western Express Highway",
  "Eastern Express Highway",
  "Sion-Panvel Highway",
  "LBS Marg",
  "SV Road",
  "Jogeshwari-Vikhroli Link Road",
];
const PredictionChart: React.FC = () => {
  const [route, setRoute] = useState(routes[0]);
  const [data, setData] = useState<Prediction[]>([]);
  const load = () => getPredictions(route).then(setData);
  useEffect(() => {
    load();
  }, [route]);
  return (
    <Card>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          Predicted Congestion (Next 4h)
        </Typography>
        <Select
          size="small"
          value={route}
          onChange={(e) => setRoute(e.target.value)}
          sx={{ mb: 2 }}
        >
          {routes.map((r) => (
            <MenuItem key={r} value={r}>
              {r}
            </MenuItem>
          ))}
        </Select>
        <ResponsiveContainer width="100%" height={250}>
          <LineChart data={data}>
            <XAxis dataKey="target_time" tick={false} />
            <YAxis domain={[1, 10]} />
            <Tooltip />
            <Line type="monotone" dataKey="congestion_level" stroke="#1976d2" />
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};
export default PredictionChart;
