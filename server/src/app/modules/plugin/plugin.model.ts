import { Schema, model } from "mongoose";

import IPlugin from "./plugin.interface";

const PluginSchema = new Schema<IPlugin>(
  {
    userId: {
      type: String,
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    licenseKey: {
      type: String,
      required: true,
      unique: true,
    },
    platform: {
      type: String,
      required: true,
    },
    icon: {
      svg: {
        type: String,
      },
      img: {
        type: String,
      },
    },
    isMarketingAllowed: {
      type: Boolean,
      required: true,
      default: false,
    },
  },
  { timestamps: true }
);

// Create the Plugin model
const Plugin = model<IPlugin>("Plugin", PluginSchema);

export default Plugin;
