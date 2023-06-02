import { Response, Request, NextFunction } from "express";

const verifyGumroadPing = (req: Request, res: Response, next: NextFunction) => {
  const { full_name, email, permalink, product_name, license_key, sale_id, refunded, variants, sale_timestamp, product_id, order_number } = req.body;

  const firstName = full_name?.split(" ")?.[0];
  const lastName = full_name?.split(" ")?.[1];

  req.body = {
    user: {
      name: {
        firstName,
        lastName,
      },
      email,
    },
    plugin: {
      licenseKey: license_key,
      name: product_name,
      isMarketingAllowed: false,
    },
    gumroad: {
      productId: product_id,
      permalink,
      saleId: sale_id,
      refunded,
      variants,
      saleTimestamp: sale_timestamp,
      orderNumber: order_number,
    },
  };
  next();
};

export default verifyGumroadPing;
