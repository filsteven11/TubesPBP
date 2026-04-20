import { Router } from "express";
import * as ctrl from "../controllers/authController";

const router = Router();

router.post("/login", ctrl.login);

export default router;
