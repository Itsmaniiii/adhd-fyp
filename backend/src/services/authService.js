import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { findUserByEmail, createUser } from "../repositories/userRepository.js";

const JWT_SECRET = process.env.JWT_SECRET || "dev-secret-key-change-in-production";

export const signupService = async (name, email, password) => {
  const existingUser = await findUserByEmail(email);
  if (existingUser) {
    throw new Error("User already exists");
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  return await createUser(name, email, hashedPassword);
};

export const loginService = async (email, password) => {
  const user = await findUserByEmail(email);
  if (!user) {
    throw new Error("Invalid credentials");
  }

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    throw new Error("Invalid credentials");
  }

  const token = jwt.sign(
    { id: user.id, email: user.email },
    JWT_SECRET,
    { expiresIn: "1h" }
  );

  return { token, userId: user.id, email: user.email, name: user.name };
};
