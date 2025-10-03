import mongoose, { Document, Schema } from 'mongoose';

export interface IResult extends Document {
  user_id: string;
  gpa: number;
  semester: string;
  academic_session: string;
  courses: Array<{
    course_code: string;
    course_title: string;
    credit_unit: number;
    grade: string;
    grade_point: number;
  }>;
  total_credit_units: number;
  total_grade_points: number;
}

const resultSchema: Schema<IResult> = new mongoose.Schema(
  {
    user_id: { 
      type: String, 
      required: true,
      ref: 'User'
    },
    gpa: { 
      type: Number, 
      required: true,
      min: 0,
      max: 4.0
    },
    semester: { 
      type: String, 
      required: true 
    },
    academic_session: { 
      type: String, 
      required: true 
    },
    courses: [{
      course_code: { type: String, required: true },
      course_title: { type: String, required: true },
      credit_unit: { type: Number, required: true },
      grade: { type: String, required: true },
      grade_point: { type: Number, required: true }
    }],
    total_credit_units: { type: Number, required: true },
    total_grade_points: { type: Number, required: true }
  },
  { timestamps: true }
);

export default mongoose.model<IResult>('Result', resultSchema);