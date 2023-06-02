import express, { Request, Response } from "express";
import cors from "cors";

import userRoutes from "./app/modules/user/user.route";
import pluginRoutes from "./app/modules/user/user.route";
import authRoutes from "./app/modules/auth/auth.route";
import varifyGumroadPing from "./utils/verifyGumroadPing";
import { processPluginPurchase } from "./app/modules/auth/auth.controller";
import varifyFreemiusPing from "./utils/verifyFreemiusPing";

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/", (req: Request, res: Response) => {
  res.send("Server is running " + process.env.port);
});

app.use("/api/v1/user", userRoutes);
app.use("/api/v1/plugin", pluginRoutes);
app.use("/api/v1/auth", authRoutes);

app.post("/api/v1/webhook/gumroad", varifyGumroadPing, processPluginPurchase);
app.post("/api/v1/webhook/freemius", varifyFreemiusPing, processPluginPurchase);

// temp

export default app;
