import { Sequelize } from "sequelize-typescript";
import { User } from "../models/user";
import { Product } from "../models/product";
import { Category } from "../models/category";
import { Order } from "../models/order";
import { OrderItem } from "../models/OrderItem";

export const sequelize = new Sequelize({
  database: "MCDAPP",
  dialect: "mysql",
  username: "root",
  password: "",
  models: [User, Product, Category, Order, OrderItem],
});