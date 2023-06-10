import { Response, Request } from "express";
import Plugin from "./plugin.model";
import Freemius from "../freemius/freemius.model";
import Gumroad from "../gumroad/gumroad.model";
import mongoose from "mongoose";

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
  const { id } = req.params;

  try {
    const plugins = await Plugin.find({ userId: id });

    const pluginIds = plugins.map((plugin) => plugin._id);

    const freemius = await Freemius.find({ pluginId: { $in: pluginIds } });
    const gumroad = await Gumroad.find({ pluginId: { $in: pluginIds } });

    const freemiusFinal = freemius.map((item) => {
      const plugin = plugins.find((plugin) => plugin._id.equals(item.pluginId)) || { _doc: {} };
      return { freemius: item.toObject(), ...plugin._doc };
    });

    const gumroadPlatform = gumroad.map((item) => {
      const plugin = plugins.find((plugin) => plugin._id.equals(item.pluginId)) || { _doc: {} };
      return { gumroad: item.toObject(), ...plugin._doc };
    });

    res.json({
      success: true,
      data: {
        gumroad: gumroadPlatform,
        freemius: freemiusFinal,
      },
    });
  } catch (error) {
    res.json({
      status: "failed",
      data: error,
    });
  }
};

export const getPluginById = async (req: Request, res: Response) => {
  const { id } = req.params;
  let details = null;
  let platform = "freemius";
  try {
    const plugin = await Plugin.findOne({ _id: id });
    if (plugin) {
      details = await Freemius.findOne({ pluginId: id });
      if (!details) {
        details = await Gumroad.findOne({ pluginId: id });
        platform = "gumroad";
      }
      return res.status(200).json({
        success: true,
        data: {
          ...plugin._doc,
          [platform]: details,
        },
      });
    }
    res.json({
      success: false,
      message: "Something went wrong!",
    });
  } catch (error: any) {
    res.json({
      success: false,
      message: error.message,
    });
  }
};
