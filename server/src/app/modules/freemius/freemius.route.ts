import express from "express";

import { getCollectionById } from "./freemius.controller";

const router = express.Router();

router.get("/");
router.get("/:id", getCollectionById);

export default router;
