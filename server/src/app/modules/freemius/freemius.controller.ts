import { Response, Request } from "express";
import Book from "./freemius.model";
import Freemius from "./freemius.model";

export const getCollectionById = async (req: Request, res: Response) => {
  const { id } = req.params;

  const collection = await Freemius.findById(id);

  res.send(collection);
};
