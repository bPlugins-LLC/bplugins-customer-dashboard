import { NextFunction } from "express";
import { Response } from "express";
import { Request } from "express";

import Freemius from "../lib/Freemius";

const verifyFreemiusPing = async (req: Request, res: Response, next: NextFunction) => {
  const { is_live, user_id, plugin_id } = req.body;
  const { user, license } = req.body?.objects;

  const freemius = new Freemius("developer", process.env.DEVELOPER_ID, process.env.PUBLIC_KEY, process.env.SECRET_KEY);

  const response = await freemius.getLicense(plugin_id, license?.id);

  const plugins: any = {
    "8795": "3D Viewer",
    "7003": "Office Viewer",
    "8824": "Panorama",
    "6433": "Streamcast",
    "6749": "Super Video Player",
    "5836": "YT Player",
  };

  req.body = {
    user: {
      name: {
        firstName: user.first,
        lastName: user.last,
      },
      email: user.email,
    },
    plugin: {
      productId: plugin_id,
      licenseKey: response?.secret_key,
      name: plugins[plugin_id],
      isMarketingAllowed: user.is_marketing_allowed,
      platform: "freemius",
    },
    freemius: {
      freemiusPluginId: plugin_id,
      userId: user_id,
      licenseId: license?.id,
      publicKey: user?.public_key,
      isLive: is_live,
      isCancelled: license?.is_cancelled,
    },
  };

  next();
};

export default verifyFreemiusPing;
