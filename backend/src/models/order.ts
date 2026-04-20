import { Table, Column, Model, HasMany } from "sequelize-typescript";
import { OrderItem } from "./OrderItem";

@Table
export class Order extends Model {
  @Column
  total!: number;

  @Column
  status!: string;

  @HasMany(() => OrderItem)
  items!: OrderItem[];
}