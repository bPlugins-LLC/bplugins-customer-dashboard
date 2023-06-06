import jwt from "jsonwebtoken";
export const refreshToken = () => {};

export const verifyToken = (token: string): any => {
  const decode = jwt.verify(token, process.env.JWT_SECRET as string);

  return decode;
};
