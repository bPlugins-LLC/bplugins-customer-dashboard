import express from "express";

import { createPlugin, getAllPlugins, getPluginById, getPluginsByUserId } from "./plugin.controller";
import verifyToken from "../../../utils/verifyToken";

const router = express.Router();

//book by genre
router.get("/", verifyToken, getAllPlugins);
router.get("/:id", verifyToken, getPluginById);
// router.get("/:platform/:id", getPluginsWithAllDetailsById);
router.get("/user/:id", verifyToken, getPluginsByUserId);

router.post("/create", verifyToken, createPlugin);

export default router;
