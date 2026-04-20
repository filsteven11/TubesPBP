import { sequelize } from "../config/database";
import { User } from "../models/user";
import { Product } from "../models/product";
import { Category } from "../models/category";
import bcrypt from "bcryptjs";

async function seedData() {
  try {
    await sequelize.sync();

    // Seed admin user
    const hash = await bcrypt.hash("admin123", 10);
    await User.create({
      email: "admin@mail.com",
      password: hash,
      role: "admin",
    });

    // Seed categories
    const burgerCat = await Category.create({ name: "Burger" });
    const drinkCat = await Category.create({ name: "Drink" });
    const dessertCat = await Category.create({ name: "Dessert" });

    // Seed products
    await Product.create({ name: "Big Mac", price: 45000, categoryId: burgerCat.id });
    await Product.create({ name: "McChicken", price: 35000, categoryId: burgerCat.id });
    await Product.create({ name: "French Fries", price: 15000, categoryId: burgerCat.id });
    await Product.create({ name: "Coca Cola", price: 12000, categoryId: drinkCat.id });
    await Product.create({ name: "Sprite", price: 12000, categoryId: drinkCat.id });
    await Product.create({ name: "McFlurry", price: 18000, categoryId: dessertCat.id });
    await Product.create({ name: "Apple Pie", price: 10000, categoryId: dessertCat.id });

    console.log("✅ Data seeded successfully!");
  } catch (error) {
    console.error("❌ Error seeding data:", error);
  } finally {
    process.exit();
  }
}

seedData();