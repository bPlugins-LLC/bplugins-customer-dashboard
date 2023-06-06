import express from "express";

import { addPluginItem, getPluginList, getPluginListById, updatePluginItem } from "./pluginList.controller";
import verifyToken from "../../../utils/verifyToken";

const router = express.Router();

//book by genre
router.get("/", verifyToken, getPluginList);
router.get("/:id", verifyToken, getPluginListById);
router.post("/:id", verifyToken, updatePluginItem);
router.post("/add-item", verifyToken, addPluginItem);

export default router;
