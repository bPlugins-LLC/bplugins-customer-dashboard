import express from "express";

import { getCollectionById, getFreemiusUser, getInstalls, getPluginDownloadLink, getPluginTags, getPlugins, tempControllerDirectPath, useUserKey } from "./freemius.controller";

const router = express.Router();

router.get("/");
router.get("/:id", getCollectionById);

// freemius api middleware
router.get("/tags/:id", getPluginTags);
router.get("/plugins/:pluginId/tags/:tagId", getPluginDownloadLink);

router.get("/path/:path", tempControllerDirectPath);
router.get("/plugins/:plugin_id/users/:freemiusUserId", getFreemiusUser);
router.get("/userkey/use", useUserKey);
router.get("/plugins/:pluginId/installs", getInstalls);
router.get("/plugins/userId", getPlugins);

export default router;
