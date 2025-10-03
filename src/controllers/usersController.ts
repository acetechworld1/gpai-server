import { Request, Response } from "express";
import { verifyGoogleToken } from "../services/authService";
import Result from "../models/Result";
import User from "../models/User";

export const userAuth = async (req: Request, res: Response) => {
  try {
    const { token } = req.body;
    if (!token) return res.status(400).json({ error: "Token required" });

    const user = await verifyGoogleToken(token);

    res.status(200).json({
      success: true,
      message: "User authenticated successfully",
      user,
    });
  } catch (error: any) {
    console.error(error);
    res.status(401).json({
      success: false,
      error: "Invalid or expired Google token",
    });
  }
};

export const saveResult = async (req: Request, res: Response) => {
  try {
    const { 
      user_id,
      gpa, 
      semester, 
      academic_session, 
      courses, 
      total_credit_units, 
      total_grade_points 
    } = req.body;

    // Validate required fields
    if (!user_id) {
      return res.status(400).json({
        success: false,
        error: "User ID is required"
      });
    }

    if (!gpa || !semester || !academic_session || !courses || !total_credit_units || !total_grade_points) {
      return res.status(400).json({
        success: false,
        error: "All fields are required"
      });
    }

    // Validate GPA range
    if (gpa < 0 ) {
      return res.status(400).json({
        success: false,
        error: "GPA can not be less than 0"
      });
    }

    // Validate courses array
    if (!Array.isArray(courses) || courses.length === 0) {
      return res.status(400).json({
        success: false,
        error: "Courses array is required and cannot be empty"
      });
    }

    // Create new result
    const result = new Result({
      user_id,
      gpa,
      semester,
      academic_session,
      courses,
      total_credit_units,
      total_grade_points
    });

    await result.save();

    res.status(201).json({
      success: true,
      message: "Result saved successfully",
      result
    });
  } catch (error: any) {
    console.error(error);
    res.status(500).json({
      success: false,
      error: "Failed to save result"
    });
  }
};

export const getHistory = async (req: Request, res: Response) => {
  try {
    const { 
      user_id,
      semester, 
      academic_session, 
      page = 1, 
      limit = 10 
    } = req.query;

    if (!user_id) {
      return res.status(400).json({
        success: false,
        error: "User ID is required"
      });
    }

    // Build filter object
    const filter: any = { user_id: user_id as string };
    
    if (semester) {
      filter.semester = semester;
    }
    
    if (academic_session) {
      filter.academic_session = academic_session;
    }

    // Calculate pagination
    const pageNum = parseInt(page as string);
    const limitNum = parseInt(limit as string);
    const skip = (pageNum - 1) * limitNum;

    // Fetch results with sorting (latest first) and pagination
    const results = await Result.find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limitNum);

    // Get total count for pagination
    const total = await Result.countDocuments(filter);

    res.status(200).json({
      success: true,
      results,
      pagination: {
        page: pageNum,
        limit: limitNum,
        total,
        totalPages: Math.ceil(total / limitNum)
      }
    });
  } catch (error: any) {
    console.error(error);
    res.status(500).json({
      success: false,
      error: "Failed to fetch results"
    });
  }
};