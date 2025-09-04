import { Request, Response } from 'express';
import User from '../models/User';


export const getAllUsers = async (req: Request, res: Response): Promise<void> => {
try {
const users = await User.find();
res.json(users);
} catch (err: any) {
res.status(500).json({ error: err.message });
}
};


export const createUser = async (req: Request, res: Response): Promise<void> => {
try {
const { name, email } = req.body;
const newUser = new User({ name, email });
await newUser.save();
res.status(201).json(newUser);
} catch (err: any) {
res.status(500).json({ error: err.message });
}
};