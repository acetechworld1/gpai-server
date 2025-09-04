import mongoose, { Document, Schema } from 'mongoose';


export interface IUser extends Document {
name: string;
email: string;
}


const userSchema: Schema<IUser> = new mongoose.Schema(
{
name: { type: String, required: true },
email: { type: String, required: true, unique: true }
},
{ timestamps: true }
);


export default mongoose.model<IUser>('User', userSchema);