import { Response, Request, RequestHandler } from "express";
import path from "path";
import Book from "./freemius.model";
import Freemius from "./freemius.model";

import FreemiusApi from "../../../lib/Freemius";
import axios from "axios";
import User from "../user/user.model";
import mongoose, { plugin } from "mongoose";
import freemiusServices from "./freemius.service";
import Plugin from "../plugin/plugin.model";

export const getCollectionById = async (req: Request, res: Response) => {
  const { id } = req.params;

  const collection = await Freemius.findById(id);

  res.send(collection);
};

export const getPluginTags: RequestHandler = async (req, res) => {
  const { id } = req.params;

  try {
    const api = new FreemiusApi("developer", process.env.DEVELOPER_ID, process.env.PUBLIC_KEY, process.env.SECRET_KEY);
    const response = await api.getTags(id);
    const latestTags = response.tags.filter((tag: any) => tag.release_mode === "released").slice(0, 10);
    res.status(200).json({
      success: true,
      data: latestTags,
    });
  } catch (error) {
    res.status(403).json({
      success: false,
      message: "Invalid Request",
    });
  }
};

export const getPluginDownloadLink: RequestHandler = async (req, res) => {
  const { pluginId, tagId } = req.params;

  try {
    const api = new FreemiusApi("developer", process.env.DEVELOPER_ID, process.env.PUBLIC_KEY, process.env.SECRET_KEY);

    const file = await axios.get(`https://api.freemius.com/v1/developers/6519/plugins/${pluginId}/tags/${tagId}.zip?is_premium=true`, {
      headers: api.generateAuthorizationHeader(api.canonizePath(`/plugins/${pluginId}/tags/${tagId}.zip`)),
      responseType: "stream",
    });
    file.data.pipe(res);
  } catch (error) {
    res.status(403).json({
      success: false,
      message: "Invalid Request",
      stack: error,
    });
  }
};

export const tempControllerDirectPath: RequestHandler = async (req, res) => {
  try {
    const api = new FreemiusApi("developer", process.env.DEVELOPER_ID, process.env.PUBLIC_KEY, process.env.SECRET_KEY);

    const response = await api.makeRequest(`/plugins/8795/installs.json?user_id=3934558&filter=active_premium&search&reason_id&fields=id,url,version,title,is_active,user_id&count=30`);

    res.status(200).json({
      success: true,
      data: response,
    });
  } catch (error) {
    res.json({
      success: false,
      error: error,
    });
  }
};

export const getFreemiusUser: RequestHandler = async (req, res) => {
  const { plugin_id, freemiusUserId } = req.params;
  const { user_id, fields = "email,public_key,secret_key,first,last" } = req.query;
  try {
    const api = new FreemiusApi("developer", process.env.DEVELOPER_ID, process.env.PUBLIC_KEY, process.env.SECRET_KEY);

    const freemiusUser = await api.makeRequest(`/plugins/${plugin_id}/users/${freemiusUserId}.json?fields=${fields}`);

    if (freemiusUser && user_id) {
      await User.updateOne({ _id: new mongoose.Types.ObjectId(user_id) }, { $set: { freemius: freemiusUser } });
    }

    res.status(200).json({
      success: true,
      data: freemiusUser,
    });
  } catch (error) {
    res.json({
      success: false,
      error: error,
    });
  }
};

export const useUserKey: RequestHandler = async (req, res) => {
  const { plugin_id = 8795, user_id = 3934558 } = req.params;
  const { fields } = req.query;
  try {
    const api = new FreemiusApi("user", 3934558, "pk_99083998e06b4ce27aa930b195687", "sk_#EhND!!Cvq;Z~&060LM6o+[eP-Yjn");

    const response = await api.makeRequest(`/plugins/6433/installs.json?&filter=active_premium&search&reason_id&fields=id,url,version,title,is_active,user_id&count=30`);

    res.status(200).json({
      success: true,
      endpoint: api.lastUsedEndpoint,
      header: api.lastUsedHeader,
      data: response,
    });
  } catch (error) {
    res.json({
      success: false,
      error: error,
    });
  }
};

export const getInstalls: RequestHandler = async (req, res, next) => {
  const { pluginId = 8795 } = req.params;
  const { fields, user_id } = req.query;

  if (!pluginId || !user_id) {
    return res.json({
      success: false,
      message: "Invalid request",
    });
  }

  const user = await User.findOne({ _id: user_id });

  if (!user) {
    return next("User Not Found");
  }

  try {
    const api = new FreemiusApi("user", user?.freemius?.id, user?.freemius?.public_key as string, user?.freemius?.secret_key as string);
    // const api = new FreemiusApi("developer", process.env.DEVELOPER_ID, process.env.PUBLIC_KEY, process.env.SECRET_KEY);
    const response = await api.getInstalls(pluginId);

    res.status(200).json({
      success: true,
      data: response,
    });
  } catch (error) {
    res.json({
      success: false,
      error: error,
    });
  }
};

export const getPlugins: RequestHandler = async (req, res, next) => {
  const { userId } = req.params;

  const user = await User.findOne({ _id: userId });

  if (!user) {
    return next("User Not Found");
  }

  try {
    const api = new FreemiusApi("user", user?.freemius?.id, user?.freemius?.public_key as string, user?.freemius?.secret_key as string);
    const response = await api.makeRequest(`/plugins.json`);

    res.status(200).json({
      success: true,
      data: response,
    });
  } catch (error) {
    res.json({
      success: false,
      error: error,
    });
  }
};

export const syncPlugins: RequestHandler = async (req, res, next) => {
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

    res.status(200).json({
      success: true,
      data: response.plugins,
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

export const deactivateLicense: RequestHandler = async (req, res) => {
  const { plugin_id, install_id } = req.params;
  const { user_id } = req.query;

  // /plugins/plugin_id/installs/install_id/licenses/license_id.json;

  try {
    const user = await User.findOne({ _id: user_id });

    if (!user?.freemius) {
      return res.status(403).json({
        success: false,
        messages: "Something went wrong",
      });
    }

    // return res.json({ plugin_id, install_id });

    // const api = new FreemiusApi("developer", process.env.DEVELOPER_ID, process.env.PUBLIC_KEY, process.env.SECRET_KEY);
    const api = new FreemiusApi("user", user?.freemius?.id, user?.freemius?.public_key as string, user?.freemius?.secret_key as string);
    const response = await api.deleteInstall(plugin_id, install_id);

    res.status(200).json({
      success: true,
      url: api.lastUsedEndpoint,
      headers: api.lastUsedHeader,
      data: response,
    });
  } catch (error) {
    res.status(403).json({
      success: false,
      message: "Something went wrong!",
    });
  }
};
