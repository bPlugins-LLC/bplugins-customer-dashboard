import jwt from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";

const verifyToken = (req: Request, res: Response, next: NextFunction) => {
  if (req.headers.authorization) {
    const token = req.headers.authorization.split(" ")?.[1];

    try {
      jwt.verify(token, process.env.JWT_SECRET as string, (err: any, user: any) => {
        if (err) {
          return res.status(403).json({
            success: false,
            message: "invalid access token",
          });
        } else {
          req.headers.user = user;
          next();
        }
      });
    } catch (error: any) {
      return res.status(404).json({
        success: false,
        message: "invalid access token",
      });
    }
  } else {
    return res.status(403).json({
      success: false,
      message: "Unauthorized Access",
    });
  }
};

export default verifyToken;
