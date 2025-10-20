import User from '../models/User';
import Result from '../models/Result';

interface AcademicSummary {
  cumulative_gpa: number;
  total_credit_units: number;
  total_results: number;
}

interface UserContext {
  user: {
    id: string;
    name: string;
    email: string;
    school_name: string;
    department: string;
    program: string;
    matric_number: string;
  };
  academic_summary: AcademicSummary;
  recent_results: any[];
}

export class AIContextService {
  public static async getUserProfile(userId: string): Promise<any> {
    const user = await User.findById(userId);
    if (!user) {
      throw new Error("User not found");
    }
    return user;
  }

  public static async calculateAcademicSummary(userId: string): Promise<AcademicSummary> {
    const allResults = await Result.find({ user_id: userId });
    let totalGradePoints = 0;
    let totalCreditUnits = 0;
    
    allResults.forEach(result => {
      totalGradePoints += result.total_grade_points;
      totalCreditUnits += result.total_credit_units;
    });

    return {
      cumulative_gpa: totalCreditUnits > 0 ? totalGradePoints / totalCreditUnits : 0,
      total_credit_units: totalCreditUnits,
      total_results: allResults.length
    };
  }

  public static async getRecentResults(userId: string, limit: number = 5): Promise<any[]> {
    return Result.find({ user_id: userId })
      .sort({ createdAt: -1 })
      .limit(limit);
  }

  public static async getFullContext(userId: string): Promise<UserContext> {
    if (!userId) {
      throw new Error("User ID is required");
    }

    // Get all data in parallel for better performance
    const [user, academicSummary, recentResults] = await Promise.all([
      this.getUserProfile(userId),
      this.calculateAcademicSummary(userId),
      this.getRecentResults(userId)
    ]);

    return {
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        school_name: user.school_name,
        department: user.department,
        program: user.program,
        matric_number: user.matric_number
      },
      academic_summary: academicSummary,
      recent_results: recentResults
    };
  }
}