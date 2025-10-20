import { ForecastRequest, ForecastResponse } from '../interfaces/Forecast';

export class ForecastService {
  private static convertGradeToPoints(grade: string): number {
    switch (grade.toUpperCase()) {
      case 'A': return 5.0;
      case 'B': return 4.0;
      case 'C': return 3.0;
      case 'D': return 2.0;
      case 'E': return 1.0;
      case 'F': return 0.0;
      default:
        throw new Error("Invalid grade. Must be A, B, C, D, E, or F");
    }
  }

  public static validateForecastInput(data: ForecastRequest): void {
    const { current_gpa, total_credit_units, planned_courses } = data;

    if (!current_gpa || !total_credit_units || !planned_courses) {
      throw new Error("All fields are required");
    }

    if (current_gpa < 0 || current_gpa > 5.0) {
      throw new Error("Invalid current GPA");
    }

    if (!Array.isArray(planned_courses) || planned_courses.length === 0) {
      throw new Error("Planned courses array is required and cannot be empty");
    }

    // Validate each planned course
    planned_courses.forEach(course => {
      if (!course.credit_unit || !course.expected_grade) {
        throw new Error("Credit unit and expected grade are required for each planned course");
      }
      if (course.credit_unit <= 0) {
        throw new Error("Credit unit must be greater than 0");
      }
      // This will throw an error if grade is invalid
      this.convertGradeToPoints(course.expected_grade);
    });
  }

  public static calculateForecast(data: ForecastRequest): ForecastResponse {
    const { current_gpa, total_credit_units, planned_courses } = data;

    // Calculate existing grade points
    const existing_grade_points = current_gpa * total_credit_units;

    // Calculate planned grade points and credit units
    let planned_grade_points = 0;
    let planned_credit_units = 0;

    for (const course of planned_courses) {
      const grade_point = this.convertGradeToPoints(course.expected_grade);
      planned_grade_points += grade_point * course.credit_unit;
      planned_credit_units += course.credit_unit;
    }

    // Calculate projected GPA
    const total_new_credit_units = total_credit_units + planned_credit_units;
    const total_new_grade_points = existing_grade_points + planned_grade_points;
    const projected_gpa = total_new_grade_points / total_new_credit_units;

    return {
      projected_gpa,
      total_credit_units: total_new_credit_units,
      total_grade_points: total_new_grade_points,
      existing_grade_points,
      planned_grade_points
    };
  }
}