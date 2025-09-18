import client from "../config/googleClient";
import supabase from "../config/supabase";
import { User } from "../interfaces/user";

export const verifyGoogleToken = async (token: string): Promise<User> => {
  const ticket = await client.verifyIdToken({
    idToken: token,
    audience: process.env.GOOGLE_CLIENT_ID,
  });

  const payload = ticket.getPayload();
  if (!payload) throw new Error("Invalid Google token");

  const { sub, name, email } = payload;

  // Check if user exists
  const { data: existingUser, error: fetchError } = await supabase
    .from("users")
    .select("*")
    .eq("google_id", sub)
    .single();

  if (fetchError && fetchError.code !== "PGRST116") throw fetchError; // Supabase single not found returns 404

  if (existingUser) return existingUser as User;

  // Insert new user
  const { data: newUser, error: insertError } = await supabase
    .from("users")
    .insert([{ google_id: sub, name, email }])
    .select()
    .single();

  if (insertError) throw insertError;

  return newUser as User;
};
