import express from "express";

import { createPlugin, getAllPlugins, getPluginsByUserId } from "./plugin.controller";

const router = express.Router();

//book by genre
router.get("/", getAllPlugins);
router.get("/:id", getAllPlugins);
router.get("/user/:id", getPluginsByUserId);

router.post("/create", createPlugin);

export default router;
