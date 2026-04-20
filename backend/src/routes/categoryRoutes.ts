import { Router } from "express";
import * as ctrl from "../controllers/categoryController";
import { auth } from "../middleware/auth";
import { role } from "../middleware/role";

const router = Router();

router.get("/", ctrl.getCategories);
router.post("/", ctrl.createCategory);

export default router;
