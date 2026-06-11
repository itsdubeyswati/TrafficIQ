import React, { useState } from "react";
import {
  Card,
  CardContent,
  Typography,
  Select,
  MenuItem,
  Button,
} from "@mui/material";
import { getSignalOptimization } from "../services/api";
const intersections = [
  "bandra_linking_road",
  "andheri_west_main",
  "worli_sea_link",
  "powai_hiranandani",
];
const SignalOptimizer: React.FC = () => {
  const [id, setId] = useState(intersections[0]);
  const [result, setResult] = useState<any>(null);
  const load = () => getSignalOptimization(id).then(setResult);
  return (
    <Card>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          Signal Optimization
        </Typography>
        <Select
          size="small"
          value={id}
          onChange={(e) => setId(e.target.value)}
          sx={{ mr: 2 }}
        >
          {intersections.map((i) => (
            <MenuItem key={i} value={i}>
              {i}
            </MenuItem>
          ))}
        </Select>
        <Button variant="contained" size="small" onClick={load}>
          Optimize
        </Button>
        {result && (
          <Typography variant="body2" sx={{ mt: 2 }}>
            Recommended Cycle: {result.recommended_cycle_time}s (Improvement{" "}
            {result.expected_flow_improvement_pct}%)
          </Typography>
        )}
      </CardContent>
    </Card>
  );
};
export default SignalOptimizer;
