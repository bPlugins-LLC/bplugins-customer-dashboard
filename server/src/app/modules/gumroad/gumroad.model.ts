import { Schema, model } from "mongoose";

import IGumroad from "./gumroad.interface";

const GumroadSchema = new Schema<IGumroad>(
  {
    pluginId: {
      type: String,
      required: true,
    },
    productId: {
      type: String,
      required: true,
    },
    permalink: {
      type: String,
      required: true,
    },
    saleId: {
      type: String,
      required: true,
      unique: true,
    },
    refunded: {
      type: Boolean,
      required: true,
    },
    saleTimestamp: {
      type: String,
      required: true,
    },
    variants: {
      type: String,
      required: true,
    },
    versions: {
      type: [String],
    },
    orderNumber: {
      type: Number,
      required: true,
      unique: true,
    },
  },
  { timestamps: true }
);

// Create the Gumroad model
const Gumroad = model<IGumroad>("Gumroad", GumroadSchema);

export default Gumroad;
