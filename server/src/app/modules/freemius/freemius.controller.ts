import { Response, Request, RequestHandler } from "express";
import Book from "./freemius.model";
import Freemius from "./freemius.model";

import FreemiusApi from "../../../lib/Freemius";

export const getCollectionById = async (req: Request, res: Response) => {
  const { id } = req.params;

  const collection = await Freemius.findById(id);

  res.send(collection);
};

export const getPluginTags: RequestHandler = (req, res) => {
  const { id } = req.params;

  try {
    const api = new FreemiusApi("developer", process.env.DEVELOPER_ID, process.env.PUBLIC_KEY, process.env.SECRET_KEY);
    const response = api.getTags(id);
    res.status(200).json({
      success: true,
      data: response,
    });
  } catch (error) {
    res.status(403).json({
      success: false,
      message: "Invalid Request",
    });
  }
};
