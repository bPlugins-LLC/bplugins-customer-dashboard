import express, { Request, Response } from "express";

import { processPluginPurchase } from "./auth.controller";

const router = express.Router();

router.post("/login", processPluginPurchase);

export default router;
