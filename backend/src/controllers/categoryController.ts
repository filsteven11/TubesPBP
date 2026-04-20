import { Request, Response } from "express";
import { Category } from "../models/category";

export const getCategories = async (req: Request, res: Response) => {
  res.json(await Category.findAll());
};

export const createCategory = async (req: Request, res: Response) => {
  res.json(await Category.create(req.body));
};
