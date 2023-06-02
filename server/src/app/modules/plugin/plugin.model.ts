import { Schema, model } from "mongoose";

import IPlugin from "./plugin.interface";

const PluginSchema = new Schema<IPlugin>({
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
  isMarketingAllowed: {
    type: Boolean,
    required: true,
    default: false,
  },
});

// Create the Plugin model
const Plugin = model<IPlugin>("Plugin", PluginSchema);

export default Plugin;
