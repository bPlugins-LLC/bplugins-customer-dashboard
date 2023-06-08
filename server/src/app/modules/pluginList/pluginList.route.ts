import express from "express";

import { addPluginItem, deletePluginItem, getPluginList, getPluginListById, updatePluginItem } from "./pluginList.controller";
import verifyToken from "../../../utils/verifyToken";

const router = express.Router();

//book by genre
router.get("/", verifyToken, getPluginList);
router.get("/:id", verifyToken, getPluginListById);
router.post("/add-item", verifyToken, addPluginItem);
router.post("/:id", verifyToken, updatePluginItem);
router.delete("/:id", verifyToken, deletePluginItem);

export default router;
