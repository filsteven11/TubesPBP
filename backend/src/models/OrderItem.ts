import { Table, Column, Model, ForeignKey } from "sequelize-typescript";
import { Order } from "./order";
import { Product } from "./product";

@Table
export class OrderItem extends Model {
  @ForeignKey(() => Order)
  @Column
  orderId!: number;

  @ForeignKey(() => Product)
  @Column
  productId!: number;

  @Column
  quantity!: number;
}