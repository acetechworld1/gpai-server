import { Request, Response } from "express";
import { verifyGoogleToken } from "../services/authService";

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
