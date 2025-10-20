import mongoose, { Document, Schema } from 'mongoose';

export interface IUser extends Document {
  name: string;
  email: string;
  school_name?: string;
  department?: string;
  program?: string;
  matric_number?: string;
}

const userSchema: Schema<IUser> = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    school_name: { type: String },
    department: { type: String },
    program: { type: String },
    matric_number: { type: String }
  },
  { timestamps: true }
);

export default mongoose.model<IUser>('User', userSchema);