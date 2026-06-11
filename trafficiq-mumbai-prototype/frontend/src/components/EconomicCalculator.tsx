import React, { useState } from "react";
import {
  Card,
  CardContent,
  Typography,
  TextField,
  Button,
} from "@mui/material";
import { calculateROI } from "../services/api";
const EconomicCalculator: React.FC = () => {
  const [cost, setCost] = useState(500000000);
  const [roi, setRoi] = useState<any>(null);
  const calc = () => calculateROI({ project_cost: cost }).then(setRoi);
  return (
    <Card>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          Infrastructure ROI
        </Typography>
        <TextField
          label="Project Cost (₹)"
          size="small"
          type="number"
          value={cost}
          onChange={(e) => setCost(Number(e.target.value))}
        />
        <Button variant="contained" size="small" sx={{ ml: 2 }} onClick={calc}>
          Calculate
        </Button>
        {roi && (
          <Typography variant="body2" sx={{ mt: 2 }}>
            Annual Savings: ₹{roi.annual_savings.toLocaleString()} | Payback:{" "}
            {roi.payback_years} years | ROI(10y): {roi.roi_percent_10yr}%
          </Typography>
        )}
      </CardContent>
    </Card>
  );
};
export default EconomicCalculator;
