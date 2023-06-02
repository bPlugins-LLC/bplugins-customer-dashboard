import { Request, Response } from "express";
import bcrypt from "bcrypt";

import generatePassword from "../../../utils/generatePassword";
import User from "../user/user.model";
import Plugin from "../plugin/plugin.model";
import Gumroad from "../gumroad/gumroad.model";
import Freemius from "../freemius/freemius.model";

export const processPluginPurchase = async (req: Request, res: Response) => {
  let platform = null;
  let currentUser;
  try {
    const { user, plugin, gumroad, freemius } = req.body;

    const existUser = await User.findOne({ email: user.email });

    // create user if doesn't exist
    if (existUser) {
      currentUser = existUser;
    } else {
      const salt = bcrypt.genSaltSync(10);
      const hash = bcrypt.hashSync(generatePassword(), salt);

      const newUser = new User({ ...user, password: hash });
      await newUser.save();
      currentUser = newUser;
    }

    // failed request if user doesn't exist or can't create new user
    if (!currentUser) {
      return res.json({
        success: false,
        data: {
          message: "could not create user",
        },
      });
    }

    // create plugin
    plugin.userId = currentUser._id;
    const newPlugin = new Plugin(plugin);
    await newPlugin.save();

    if (gumroad) {
      gumroad.pluginId = newPlugin._id;
      platform = new Gumroad(gumroad);
      await platform.save();
    } else if (freemius) {
      freemius.pluginId = newPlugin._id;
      platform = new Freemius(freemius);
      await platform.save();
    }

    res.json({
      status: "success",
      data: {
        user: currentUser,
        plugin: newPlugin,
        platform,
        gumroad,
      },
    });
  } catch (error) {
    res.json({
      success: false,
      status: "failed",
      error: error,
    });
  }
};
