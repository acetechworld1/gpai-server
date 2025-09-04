import mongoose from 'mongoose';


const MONGO_URI = process.env.MONGO_URI as string;


mongoose
.connect(MONGO_URI)
.then(() => console.log('✅ MongoDB connected'))
.catch((err) => {
console.error('❌ MongoDB connection error:', err);
process.exit(1);
});