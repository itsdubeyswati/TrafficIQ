import React, { useEffect, useState } from "react";
import { Card, CardContent, Typography, Chip, Stack } from "@mui/material";
import { getCurrentStatus } from "../services/api";
import { TrafficStatus } from "../types";
const TrafficMap: React.FC = () => {
  const [data, setData] = useState<TrafficStatus[]>([]);
  useEffect(() => {
    getCurrentStatus().then(setData);
  }, []);
  return (
    <Card>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          Traffic Heat (Simplified)
        </Typography>
        <Stack direction="row" flexWrap="wrap" gap={1}>
          {data.map((r) => (
            <Chip
              key={r.route_id}
              label={`${r.route_id}: ${r.congestion_level}`}
              color={
                r.congestion_level > 7
                  ? "error"
                  : r.congestion_level > 5
                  ? "warning"
                  : "success"
              }
            />
          ))}
        </Stack>
      </CardContent>
    </Card>
  );
};
export default TrafficMap;
