import { Request, Response } from "express";
import PluginList from "./pluginList.model";
import mongoose from "mongoose";

export const getPluginList = async (req: Request, res: Response) => {
  try {
    const list = await PluginList.find();
    res.status(200).json({
      success: true,
      data: list,
    });
  } catch (error) {
    res.json({
      success: false,
      message: "Something went wrong!",
    });
  }
};

export const getPluginListById = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const list = await PluginList.findOne({ _id: id });
    res.status(200).json({
      success: true,
      data: list,
    });
  } catch (error) {
    res.json({
      success: false,
      message: "Something went wrong!",
    });
  }
};

export const addPluginItem = async (req: Request, res: Response) => {
  try {
    const item = new PluginList(req.body);
    await item.save();
    res.status(200).json({
      success: true,
      data: item,
    });
  } catch (error) {
    res.status(403).json({
      success: false,
      message: "Something went wrong!",
    });
  }
};

export const updatePluginItem = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const response = await PluginList.updateOne({ _id: new mongoose.Types.ObjectId(id) }, { $set: req.body }, { new: true });
    res.status(200).json({
      success: Boolean(response.modifiedCount),
      data: await PluginList.findOne({ _id: id }),
    });
  } catch (error) {
    res.status(403).json({
      success: false,
      message: "Something went wrong!",
    });
  }
};

export const deletePluginItem = async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    const { deletedCount } = await PluginList.deleteOne({ _id: new mongoose.Types.ObjectId(id) });
    res.status(200).json({
      success: Boolean(deletedCount),
      deletedCount,
    });
  } catch (error) {
    res.status(403).json({
      success: false,
      message: "Something went wrong!",
    });
  }
};
