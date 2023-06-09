import { NextFunction, Request, Response } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

import generatePassword from "../../../utils/generatePassword";
import User from "../user/user.model";
import Plugin from "../plugin/plugin.model";
import Gumroad from "../gumroad/gumroad.model";
import Freemius from "../freemius/freemius.model";
import FreemiusApi from "../../../lib/Freemius";

import * as authServices from "./auth.service";

export const processPluginPurchase = async (req: Request, res: Response, next: NextFunction) => {
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
      const password = bcrypt.hashSync("amiPassword", salt);
      // const password = bcrypt.hashSync(generatePassword(), salt);

      const newUser = new User({ ...user, password });
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
    let existPlugin = await Plugin.findOne({ licenseKey: plugin.licenseKey });

    if (!existPlugin) {
      plugin.userId = currentUser._id;

      const newPlugin = new Plugin(plugin);
      existPlugin = await newPlugin.save();

      if (gumroad) {
        gumroad.pluginId = newPlugin._id;
        platform = new Gumroad(gumroad);
        await platform.save();
      } else if (freemius) {
        const api = new FreemiusApi("developer", process.env.DEVELOPER_ID, process.env.PUBLIC_KEY, process.env.SECRET_KEY);
        const freemiusUser = await api.makeRequest(`/plugins/${plugin.productId}/users/${freemius.userId}.json?fields=email,public_key,secret_key,first,last`);

        if (!freemiusUser) {
          return next("Internal Server Error");
        }

        currentUser.freemius = freemiusUser;
        await currentUser.save();

        freemius.pluginId = newPlugin._id;
        platform = new Freemius(freemius);
        await platform.save();
      }
    }

    res.json({
      status: "success",
      data: {
        user: currentUser,
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

export const register = async (req: Request, res: Response) => {
  try {
    const salt = bcrypt.genSaltSync(10);
    const hash = bcrypt.hashSync(req.body.password, salt);

    const newUser = new User({
      ...req.body,
      password: hash,
    });

    await newUser.save();

    const { password, ...user } = newUser._doc;

    res.status(200).json(user);
  } catch (err) {
    res.status(403).json(err);
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const user = await User.findOne({ email: req.body.email });

    if (!user)
      return res.status(403).json({
        message: "User not found",
        success: false,
      });

    const isPasswordCorrect = await bcrypt.compare(req.body.password, user.password);
    if (!isPasswordCorrect)
      return res.status(403).json({
        message: "Email or password is incorrect",
      });

    const { password, ...otherDetails } = user._doc;

    const access_token = generateAccessToken({ id: user._id, email: otherDetails.email });
    const refresh_token = generateRefreshToken({ id: user._id, email: otherDetails.email });
    res
      .cookie("access_token", access_token, {})
      .status(200)
      .json({
        user: otherDetails,
        token: {
          access_token: access_token,
          refresh_token: refresh_token,
          expire_in: 60 * 60 * 24,
        },
      });
  } catch (err) {
    return res.json({
      success: false,
      data: err,
    });
  }
};

export const tokenVerified = async (req: Request, res: Response) => {
  const { id } = req.headers.user;
  try {
    const user = await User.findOne({ _id: id as string });
    res.status(200).json({
      success: true,
      user,
    });
  } catch (error) {
    res.status(404).json({
      success: false,
      message: "User not found",
    });
  }
};

export const refreshToken = (req: Request, res: Response) => {
  const { refresh_token } = req.query;
  // return res.send(refresh_token);
  jwt.verify(refresh_token as string, process.env.JWT_REFRESH_SECRET as string, (err: any, user: any) => {
    if (err) {
      res.status(403).json({ success: false, message: "invalid token" });
    }
    const access_token = generateAccessToken(user);
    res.status(200).json({ success: true, access_token: access_token, expire_in: 60 * 60 * 24 });
  });
};

export const generateAccessToken = (user: any) => {
  return jwt.sign(user, process.env.JWT_SECRET as string, { expiresIn: "24h" });
};
export const generateRefreshToken = (user: any) => {
  return jwt.sign(user, process.env.JWT_REFRESH_SECRET as string);
};

// jwt.sign({ id: user._id, email: otherDetails.email }, process.env.JWT as string);
