import { Response, Request } from "express";
import Plugin from "./plugin.model";

export const createPlugin = async (req: Request, res: Response) => {
  try {
    const plugin = new Plugin(req.body);
    await plugin.save();
    res.json({
      status: "success",
      data: plugin,
    });
  } catch (error) {
    res.json({
      status: "failed",
      data: error,
    });
  }
};

export const getAllPlugins = async (req: Request, res: Response) => {
  try {
    res.json({
      status: "success",
      data: await Plugin.find(),
    });
  } catch (error) {
    res.json({
      status: "failed",
      data: error,
    });
  }
};

export const getPluginsByUserId = async (req: Request, res: Response) => {
  try {
    res.json({
      status: "success",
      data: await Plugin.find({ userId: req.params?.id }),
    });
  } catch (error) {
    res.json({
      status: "failed",
      data: error,
    });
  }
};

export const getPluginById = async (req: Request, res: Response) => {
  try {
    res.json({
      status: "success",
      data: await Plugin.findOne({ _id: req.params?.id }),
    });
  } catch (error) {
    res.json({
      status: "failed",
      data: error,
    });
  }
};
