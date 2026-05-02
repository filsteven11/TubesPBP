import { Router } from "express";
import * as ctrl from "../controllers/authController";

const router = Router();

router.post("/login", ctrl.login);
router.post("/register", ctrl.register);

export default router;
