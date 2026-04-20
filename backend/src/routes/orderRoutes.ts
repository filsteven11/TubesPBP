import { Router } from "express";
import * as ctrl from "../controllers/orderController";

const router = Router();

router.post("/", ctrl.createOrder);
router.get("/", ctrl.getOrders);
router.put("/:id", ctrl.updateOrder);

export default router;