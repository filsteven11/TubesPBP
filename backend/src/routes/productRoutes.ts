import { Router } from "express";
import * as ctrl from "../controllers/productController";
import { auth } from "../middleware/auth";
import { role } from "../middleware/role";

const router = Router();

router.get("/", ctrl.getProducts);
router.post("/", ctrl.createProduct);
router.put("/:id", auth, role(["admin"]), ctrl.updateProduct);
router.delete("/:id", auth, role(["admin"]), ctrl.deleteProduct);

export default router;