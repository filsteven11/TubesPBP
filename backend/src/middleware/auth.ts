import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

export const auth = (req: Request, res: Response, next: NextFunction) => {
  const token = req.headers.authorization;
  if (!token) return res.sendStatus(403);

  try {
    (req as any).user = jwt.verify(token, "SECRET");
    next();
  } catch {
    res.sendStatus(401);
  }
};
