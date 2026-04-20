import { Request, Response } from "express";
import { Order } from "../models/order";
import { OrderItem } from "../models/OrderItem";

export const createOrder = async (req: Request, res: Response) => {
  const { items } = req.body;

  const order_data = await Order.create({ total: 0, status: "pending" });

  let total = 0;

  for (let item of items) {
    await OrderItem.create({
      orderId: order_data.id,
      productId: item.productId,
      quantity: item.quantity,
    });

    total += item.quantity * item.price;
  }

  order_data.total = total;
  await order_data.save();

  res.json(order_data);
};

export const getOrders = async (req: Request, res: Response) => {
  const orders = await Order.findAll({ include: [OrderItem] });
  res.json(orders);
};

export const updateOrder = async (req: Request, res: Response) => {
  await Order.update(req.body, { where: { id: req.params.id } });
  res.json({ msg: "Updated" });
};
