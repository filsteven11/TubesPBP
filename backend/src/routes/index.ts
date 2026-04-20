import { Router } from "express";
import authRoutes from "./authRoutes";
import productRoutes from "./productRoutes";
import orderRoutes from "./orderRoutes";
import categoryRoutes from "./categoryRoutes";

const router = Router();

router.use("/auth", authRoutes);
router.use("/products", productRoutes);
router.use("/orders", orderRoutes);
router.use("/categories", categoryRoutes);

export default router;