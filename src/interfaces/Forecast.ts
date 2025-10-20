export interface ForecastRequest {
  current_gpa: number;
  total_credit_units: number;
  planned_courses: {
    credit_unit: number;
    expected_grade: string;
  }[];
}

export interface ForecastResponse {
  projected_gpa: number;
  total_credit_units: number;
  total_grade_points: number;
  existing_grade_points: number;
  planned_grade_points: number;
}