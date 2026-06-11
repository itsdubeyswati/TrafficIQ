from typing import Dict, Any
import random

SAMPLE_INTERSECTIONS = [
    {"id": "bandra_linking_road", "location": {"lat": 19.0596, "lng": 72.8295}},
    {"id": "andheri_west_main", "location": {"lat": 19.1136, "lng": 72.8697}},
    {"id": "worli_sea_link", "location": {"lat": 19.0176, "lng": 72.8562}},
    {"id": "powai_hiranandani", "location": {"lat": 19.1197, "lng": 72.9073}},
]


def optimize_signal_timing(intersection: Dict[str, Any]):
    flows = {
        "north": random.randint(400, 1200),
        "south": random.randint(400, 1200),
        "east": random.randint(300, 900),
        "west": random.randint(300, 900),
    }
    sat_flow = 1800
    y_values = {k: v / sat_flow for k, v in flows.items()}
    Y = sum(y_values.values())
    lost_time = 4 * 4
    if Y >= 0.95:
        Y = 0.95
    cycle_time = (1.5 * lost_time + 5) / (1 - Y)
    effective_green = cycle_time - lost_time
    splits = {k: round(effective_green * (v / sum(flows.values())), 1) for k, v in flows.items()}
    current_cycle_time = 90
    improvement = min(0.25, abs(cycle_time - current_cycle_time) / current_cycle_time + 0.1)
    return {
        "intersection_id": intersection["id"],
        "location": intersection["location"],
        "current_cycle_time": current_cycle_time,
        "recommended_cycle_time": round(cycle_time, 1),
        "green_splits_seconds": splits,
        "expected_flow_improvement_pct": round(improvement * 100, 1),
        "assumptions": {
            "saturation_flow_per_lane": sat_flow,
            "lost_time_seconds": lost_time,
            "Y": round(Y, 3)
        }
    }
