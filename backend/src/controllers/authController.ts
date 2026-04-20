import { Request, Response } from "express";
import { User } from "../models/user";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export const login = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  const user_data = await User.findOne({ where: { email } });
  if (!user_data) return res.status(404).json({ msg: "User not found" });

  const match = await bcrypt.compare(password, user_data.password);
  if (!match) return res.status(400).json({ msg: "Wrong password" });

  const token = jwt.sign({ id: user_data.id, role: user_data.role }, "SECRET");

  res.json({ token });
};