import { Request, Response } from "express";
import * as service from "../services/productService";

export const getProducts = async (req: Request, res: Response) => {
  const data = await service.getAllProducts();
  res.json(data);
};

export const createProduct = async (req: Request, res: Response) => {
  const data = await service.createProductService(req.body);
  res.json(data);
};

export const updateProduct = async (req: Request, res: Response) => {
  await service.updateProductService(req.params.id, req.body);
  res.json({ msg: "Updated" });
};

export const deleteProduct = async (req: Request, res: Response) => {
  await service.deleteProductService(req.params.id);
  res.json({ msg: "Deleted" });
};