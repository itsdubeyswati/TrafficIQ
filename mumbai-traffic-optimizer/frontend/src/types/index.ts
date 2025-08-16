export interface TrafficStatus {
  route_id: string;
  congestion_level: number;
  average_speed: number;
  delay_minutes: number;
  timestamp: string;
}
export interface Prediction {
  route_id: string;
  target_time: string;
  congestion_level: number;
  confidence: number;
}
