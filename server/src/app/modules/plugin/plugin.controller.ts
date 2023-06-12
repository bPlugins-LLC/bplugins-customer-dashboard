import { Response, Request, RequestHandler } from "express";
import Plugin from "./plugin.model";
import Freemius from "../freemius/freemius.model";
import Gumroad from "../gumroad/gumroad.model";
import mongoose from "mongoose";
import User from "../user/user.model";
import FreemiusApi from "../../../lib/Freemius";

import gumroadServices from "./../gumroad/gumroad.service";

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

export const syncFreemiusPlugins: RequestHandler = async (req, res, next) => {
  const { userId } = req.params;

  try {
    const user = await User.findOne({ _id: userId });

    if (!user) {
      return next("User Not Found");
    }

    if (!user.freemius) {
      return res.status(403).json({
        success: false,
        messages: "Sync Failed",
      });
    }

    const api = new FreemiusApi("user", user?.freemius?.id, user?.freemius?.public_key as string, user?.freemius?.secret_key as string);
    const response = await api.makeRequest(`/plugins.json`);

    if (response?.plugins?.length) {
      response?.plugins.map((plugin: any) => {
        syncPlugin(api, user, plugin);
      });
    }

    next();
  } catch (error) {
    res.json({
      success: false,
      error: error,
    });
  }
};

export const syncGumroadPlugins: RequestHandler = async (req, res, next) => {
  const { userId } = req.params;

  try {
    const user = await User.findOne({ _id: userId });

    if (!user) {
      return next("User Not Found");
    }

    if (!user.freemius) {
      return res.status(403).json({
        success: false,
        messages: "Sync Failed",
      });
    }

    const sales = await gumroadServices.getGumroadSalse(user?.email);

    sales.map((sale: any) => syncGumroadPlugin(user, sale));

    res.status(200).json({
      success: true,
      message: "Data Sync successfully!",
      sales,
    });
  } catch (error) {
    res.json({
      success: false,
      error: error,
    });
  }
};

export const syncPlugin = async (api: any, user: any, plugin: any) => {
  const response = await api.makeRequest(`/plugins/${plugin.id}/licenses.json`);
  response?.licenses?.map(async (license: any) => {
    let existPlugin = await Plugin.findOne({ licenseKey: license.secret_key });
    const pluginData = {
      productId: plugin.id,
      licenseKey: license.secret_key,
      name: plugin.title,
      platform: "freemius",
      isMarketingAllowed: false,
      userId: user._id,
    };
    if (!existPlugin) {
      const newPlugin = new Plugin(pluginData);
      await newPlugin.save();
      existPlugin = newPlugin;
    } else {
      await Plugin.findOneAndUpdate({ licenseKey: license.secret_key }, pluginData);
    }

    const existFreemius = await Freemius.findOne({ pluginId: existPlugin._id.toString() });

    const freemiusData = {
      freemiusPluginId: plugin.id,
      userId: user.freemius?.id,
      licenseId: license?.id,
      publicKey: "",
      isLive: true,
      isCancelled: license.is_cancelled,
      expiration: license.expiration,
    };

    if (!existFreemius) {
      freemiusData.pluginId = existPlugin._id;
      const platform = new Freemius(freemiusData);
      await platform.save();
    } else {
      await Freemius.findOneAndUpdate({ pluginId: existPlugin._id }, freemiusData);
    }
  });
};

export const syncGumroadPlugin = async (user: any, plugin: any) => {
  let existPlugin = await Plugin.findOne({ licenseKey: plugin?.license_key });

  if (!plugin?.license_key) {
    return false;
  }
  const pluginData = {
    productId: plugin.product_id,
    licenseKey: plugin.license_key,
    name: plugin.product_name,
    platform: "gumroad",
    isMarketingAllowed: false,
    userId: user._id,
  };

  if (!existPlugin) {
    const newPlugin = new Plugin(pluginData);
    await newPlugin.save();
    existPlugin = newPlugin;
  } else {
    await Plugin.findOneAndUpdate({ licenseKey: plugin?.license_key }, pluginData);
  }

  const existGumroad = await Gumroad.findOne({ pluginId: existPlugin._id.toString() });

  const gumroadData = {
    productId: plugin.product_id,
    permalink: plugin?.product_permalink,
    saleId: plugin?.id,
    refunded: plugin?.license_disabled,
    variants: plugin?.variants_and_quantity || "(Single site)",
    saleTimestamp: plugin?.created_at,
    orderNumber: plugin.order_id,
    pluginId: "",
  };

  if (!existGumroad) {
    gumroadData.pluginId = existPlugin._id.toString();
    const platform = new Gumroad(gumroadData);
    await platform.save();
  } else {
    await Gumroad.findOneAndUpdate({ pluginId: existPlugin._id }, gumroadData);
  }
};
