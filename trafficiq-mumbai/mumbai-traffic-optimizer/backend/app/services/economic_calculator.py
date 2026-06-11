from typing import Dict


def calculate_infrastructure_roi(project_cost: float, delay_hours: float, productivity_cost_per_hour: float, expected_improvement: float):
    current_loss = delay_hours * productivity_cost_per_hour
    annual_savings = current_loss * expected_improvement * 365
    roi = ((annual_savings * 10) - project_cost) / project_cost * 100
    payback_years = project_cost / annual_savings if annual_savings else None
    return {
        "project_cost": project_cost,
        "current_loss": round(current_loss, 2),
        "annual_savings": round(annual_savings, 2),
        "roi_percent_10yr": round(roi, 2),
        "payback_years": round(payback_years, 2) if payback_years else None
    }


def analyze_new_project(payload: Dict):
    project_cost = float(payload.get("project_cost", 0))
    delay_hours = float(payload.get("delay_hours", 1000))
    productivity_cost_per_hour = float(payload.get("productivity_cost_per_hour", 1500))
    expected_improvement = float(payload.get("expected_improvement", 0.15))
    base = calculate_infrastructure_roi(project_cost, delay_hours, productivity_cost_per_hour, expected_improvement)
    base.update({
        "project_type": payload.get("project_type", "unknown"),
        "location": payload.get("location", "unspecified"),
        "priority_score": round((expected_improvement * 100) / (base["payback_years"] or 10), 2)
    })
    return base
