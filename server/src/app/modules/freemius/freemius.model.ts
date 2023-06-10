import { Schema, model } from "mongoose";

import IFreemius from "./freemius.interface";

const FreemiusSchema = new Schema<IFreemius>(
  {
    // id: {
    //   type: Number,
    //   required: true,
    // },
    pluginId: {
      type: String,
      required: true,
      unique: true,
    },
    freemiusPluginId: {
      type: String,
      required: true,
    },
    userId: {
      type: String,
      required: true,
    },
    licenseId: {
      type: String,
      required: true,
      unique: true,
    },
    publicKey: {
      type: String,
    },
    isLive: {
      type: Boolean,
      required: true,
    },
    isCancelled: {
      type: Boolean,
      required: true,
    },
    expiration: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

// Create the Freemius model
const Freemius = model<IFreemius>("Freemius", FreemiusSchema);

export default Freemius;
