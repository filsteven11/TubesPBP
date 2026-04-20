import { Product } from "../models/product";

export const getAllProducts = async () => {
  return await Product.findAll();
};

export const createProductService = async (data: any) => {
  return await Product.create(data);
};

export const updateProductService = async (id: string, data: any) => {
  await Product.update(data, { where: { id } });
};

export const deleteProductService = async (id: string) => {
  await Product.destroy({ where: { id } });
};