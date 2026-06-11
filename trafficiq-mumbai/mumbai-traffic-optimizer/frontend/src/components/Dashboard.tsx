import React, { useEffect, useState } from "react";
import { Card, CardContent, Typography, Grid } from "@mui/material";
import { getTrafficHealthScore } from "../services/api";
const Dashboard: React.FC = () => {
  const [health, setHealth] = useState<number | null>(null);
  useEffect(() => {
    getTrafficHealthScore().then(setHealth);
  }, []);
  return (
    <Grid container spacing={2} sx={{ mb: 2 }}>
      <Grid item xs={12} md={3}>
        <Card>
          <CardContent>
            <Typography variant="h6">Traffic Health Score</Typography>
            <Typography variant="h4">{health ?? "..."}</Typography>
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  );
};
export default Dashboard;
