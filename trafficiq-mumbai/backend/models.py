from pydantic import BaseModel
from typing import Dict
import json, datetime
from pathlib import Path

DATA_DIR = Path(__file__).parent / 'data'

with open(DATA_DIR / 'mumbai_routes.json', 'r', encoding='utf-8') as f:
    ROUTES_DATA = {r['id']: r for r in json.load(f)['routes']}
with open(DATA_DIR / 'traffic_patterns.json', 'r', encoding='utf-8') as f:
    PATTERNS = json.load(f)
with open(DATA_DIR / 'intersections.json', 'r', encoding='utf-8') as f:
    INTERSECTIONS = {i['id']: i for i in json.load(f)['intersections']}


class ROIRequest(BaseModel):
    project_type: str
    location: str
    project_cost: float


def predict_congestion(route_id: str, hour: int, weather: str, day_type: str = None):
    route = ROUTES_DATA.get(route_id)
    if route is None:
        raise ValueError('Unknown route')
    if day_type is None:
        dow = datetime.datetime.utcnow().weekday()
        day_type = 'weekday' if dow < 5 else 'weekend'
    hourly = PATTERNS['hourly_patterns'][day_type][hour]
    weather_mult = PATTERNS['weather_impact'].get(weather, 1.0)
    base_congestion = route['base_congestion']
    raw = 0.4 * base_congestion + 0.4 * hourly + 0.2 * (hourly * (1 + route['weather_sensitivity'] * (weather_mult - 1)))
    final = min(10, max(1, raw * weather_mult))
    confidence = 0.85 if weather == 'clear' else 0.7 if 'rain' in weather else 0.75
    return {
        'route_id': route_id,
        'route_name': route['name'],
        'hour': hour,
        'weather': weather,
        'congestion_level': round(final),
        'confidence': round(confidence, 2),
        'contributing_factors': [
            f"Hourly pattern value: {hourly}",
            f"Route base: {base_congestion}",
            f"Weather multiplier: {weather_mult}",
            f"Weather sensitivity applied: {route['weather_sensitivity']}"
        ]
    }


def optimize_signal_timing(intersection_id: str, flows: Dict[str, int]):
    inter = INTERSECTIONS.get(intersection_id)
    if inter is None:
        raise ValueError('Unknown intersection')
    lost_time_per_phase = 4
    phases = len(flows)
    lost_time_total = lost_time_per_phase * phases
    saturation_flow = 1800  # veh/h per lane
    flow_ratios = {d: v / saturation_flow for d, v in flows.items()}
    critical_ratio = max(flow_ratios.values())
    if critical_ratio >= 0.95:
        critical_ratio = 0.95
    optimal_cycle = (1.5 * lost_time_total + 5) / (1 - critical_ratio)
    optimal_cycle = min(120, max(30, optimal_cycle))
    effective_green = optimal_cycle - lost_time_total
    total_flow = sum(flows.values()) or 1
    green_splits = {d: (v / total_flow) * effective_green for d, v in flows.items()}
    current_cycle = inter['current_cycle_time']
    improvement = (abs(current_cycle - optimal_cycle) / current_cycle) + 0.1
    improvement = min(improvement, 0.3)
    return {
        'intersection_id': intersection_id,
        'name': inter['name'],
        'current_cycle': current_cycle,
        'optimal_cycle': round(optimal_cycle),
        'green_splits': {k: round(v) for k, v in green_splits.items()},
        'flow_ratios': {k: round(v, 3) for k, v in flow_ratios.items()},
        'expected_improvement_pct': round(improvement * 100, 1)
    }


def calculate_infrastructure_roi(project_type: str, location: str, project_cost: float):
    """Return a simple ROI estimate with location-specific adjustment.

    The location field previously had no effect, which was confusing in the UI.
    We now apply a congestion / impact multiplier per location so changing the
    dropdown yields different results. Numbers are heuristic (demo only).
    """
    if project_cost <= 0:
        raise ValueError("project_cost must be > 0")

    avg_hourly_wage = 300  # INR per hour (heuristic)
    # Base daily commuters affected by project type (simplified)
    daily_commuters_affected = {"flyover": 50000, "road_widening": 30000, "signal_upgrade": 20000}
    # Average delay reduction achievable (fraction)
    delay_reduction_percent = {"flyover": 0.25, "road_widening": 0.15, "signal_upgrade": 0.10}
    # Location congestion / strategic importance factor ( >1 amplifies impact )
    location_factor_map = {
        "Andheri": 1.15,
        "Bandra": 1.12,
        "Dadar": 1.14,
        "Powai": 1.10,
        "Goregaon": 1.08,
        "Worli": 1.11,
        "Sion": 1.09,
        "Kurla": 1.13,
        "Colaba": 0.95,
        "BKC": 1.16,
    }

    affected = daily_commuters_affected.get(project_type, 25000)
    reduction = delay_reduction_percent.get(project_type, 0.15)
    location_factor = location_factor_map.get(location, 1.0)

    current_delay_min = 30  # average minutes of delay baseline
    # Apply location factor to affected commuters (representing density/importance)
    effective_affected = affected * location_factor
    daily_savings = effective_affected * (current_delay_min * reduction / 60) * avg_hourly_wage
    # Assume 300 effective commuting days / year
    annual_savings = daily_savings * 300

    payback_years = project_cost / annual_savings if annual_savings else None
    roi_10yr = ((annual_savings * 10) - project_cost) / project_cost * 100 if project_cost else 0
    priority_score = (100 / payback_years) if payback_years else 0

    return {
        'project_type': project_type,
        'location': location,
        'location_factor': location_factor,
        'project_cost': project_cost,
        'annual_savings': round(annual_savings),
        'payback_period_years': round(payback_years, 2) if payback_years else None,
        'roi_percentage_10year': round(roi_10yr, 1),
        'priority_score': round(priority_score, 1)
    }
