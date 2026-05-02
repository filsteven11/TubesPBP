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

  res.json({ 
    token, 
    user: { 
      id: user_data.id, 
      email: user_data.email, 
      role: user_data.role,
      name: user_data.name || user_data.email.split('@')[0]
    } 
  });
};

export const register = async (req: Request, res: Response) => {
  try {
    const { name, email, password } = req.body;
    
    const existing = await User.findOne({ where: { email } });
    if (existing) return res.status(400).json({ msg: "Email already exists" });

    const hashedPassword = await bcrypt.hash(password, 10);
    
    await User.create({
      name: name || "Customer",
      email,
      password: hashedPassword,
      role: "customer"
    });

    res.status(201).json({ msg: "User registered successfully" });
  } catch (error) {
    res.status(500).json({ msg: "Server error" });
  }
};