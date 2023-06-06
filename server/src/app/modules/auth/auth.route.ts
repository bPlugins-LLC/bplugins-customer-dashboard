import express, { Request, Response } from "express";

import { login, processPluginPurchase, refreshToken, register, tokenVerified } from "./auth.controller";
import verifyToken from "../../../utils/verifyToken";

const router = express.Router();

router.post("/register", register);

router.post("/login", login);
router.get("/verify-token", verifyToken, tokenVerified);

router.get("/refresh-token", refreshToken);

export default router;
