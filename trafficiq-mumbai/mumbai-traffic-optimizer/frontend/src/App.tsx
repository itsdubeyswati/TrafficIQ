import React from "react";
import { Container, Typography, Grid } from "@mui/material";
import Dashboard from "./components/Dashboard";
import TrafficMap from "./components/TrafficMap";
import PredictionChart from "./components/PredictionChart";
import SignalOptimizer from "./components/SignalOptimizer";
import EconomicCalculator from "./components/EconomicCalculator";
const App: React.FC = () => {
  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      <Typography variant="h4" gutterBottom>
        TrafficIQ - Mumbai Traffic Optimization Engine
      </Typography>
      <Dashboard />
      <Grid container spacing={4} sx={{ mt: 1 }}>
        <Grid item xs={12} md={6}>
          <TrafficMap />
        </Grid>
        <Grid item xs={12} md={6}>
          <PredictionChart />
        </Grid>
        <Grid item xs={12} md={6}>
          <SignalOptimizer />
        </Grid>
        <Grid item xs={12} md={6}>
          <EconomicCalculator />
        </Grid>
      </Grid>
    </Container>
  );
};
export default App;
