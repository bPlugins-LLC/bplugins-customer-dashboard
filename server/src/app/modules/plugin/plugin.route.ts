import express from "express";

import { createPlugin, getAllPlugins, getPluginById, getPluginsByUserId, syncFreemiusPlugins, syncGumroadPlugins } from "./plugin.controller";
import verifyToken from "../../../utils/verifyToken";

const router = express.Router();

//book by genre
router.get("/", verifyToken, getAllPlugins);
router.get("/:id", verifyToken, getPluginById);
// router.get("/:platform/:id", getPluginsWithAllDetailsById);
router.get("/user/:id", verifyToken, getPluginsByUserId);

router.post("/create", verifyToken, createPlugin);
router.get("/sync/:userId", syncFreemiusPlugins, syncGumroadPlugins);

export default router;
