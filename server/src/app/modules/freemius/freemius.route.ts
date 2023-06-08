import express from "express";

import { getCollectionById, getPluginTags } from "./freemius.controller";

const router = express.Router();

router.get("/");
router.get("/:id", getCollectionById);

router.get("/tags/:id", getPluginTags);

export default router;
