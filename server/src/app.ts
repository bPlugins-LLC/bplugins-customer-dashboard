import express, { ErrorRequestHandler, NextFunction, Request, RequestHandler, Response } from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

import varifyGumroadPing from "./utils/verifyGumroadPing";
import { processPluginPurchase } from "./app/modules/auth/auth.controller";
import varifyFreemiusPing from "./utils/verifyFreemiusPing";

// routes
import userRoutes from "./app/modules/user/user.route";
import pluginRoutes from "./app/modules/plugin/plugin.route";
import authRoutes from "./app/modules/auth/auth.route";
import freemiusRoutes from "./app/modules/freemius/freemius.route";
import gumroadRoutes from "./app/modules/gumroad/gumroad.route";
import pluginListRoutes from "./app/modules/pluginList/pluginList.route";
import Freemius from "./lib/Freemius";

const app = express();

app.use(cors());
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/", (req: Request, res: Response) => {
  res.send("Server is running " + process.env.port);
});

app.use("/api/v1/users", userRoutes);
app.use("/api/v1/plugins", pluginRoutes);
app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/freemius", freemiusRoutes);
app.use("/api/v1/gumroad", gumroadRoutes);
app.use("/api/v1/plugin-list", pluginListRoutes);

app.post("/api/v1/webhook/gumroad", varifyGumroadPing, processPluginPurchase);
app.post("/api/v1/webhook/freemius", varifyFreemiusPing, processPluginPurchase);

app.get("/download", async (req, res) => {
  const api = new Freemius("developer", process.env.DEVELOPER_ID, process.env.PUBLIC_KEY, process.env.SECRET_KEY);

  // const response = api.makeRequest("/plugins/8795/tags/tag_id.zip?is_premium=true");
  const response = await api.getTags(8795);
  // const response = await api.getLicense(8795, 1151993);
  // console.log(response);
  res.json(response);
});

// temp
app.use((req: Request, res: Response, next: NextFunction) => {
  const error: any = new Error("Route not found");
  error.status = 404;
  next(error);
});

// Error handling middleware
app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  res.status(err.status || 500).json({
    error: {
      message: err.message || "Internal server error",
    },
  });
});

export default app;
