import React from "react";
import TrafficPredictor from "./components/TrafficPredictor";
import SignalOptimizer from "./components/SignalOptimizer";
import EconomicCalculator from "./components/EconomicCalculator";
import Layout from "./components/Layout";

export default function App() {
  return (
    <Layout>
      <div className="grid">
        <TrafficPredictor />
        <SignalOptimizer />
        <EconomicCalculator />
      </div>
    </Layout>
  );
}
