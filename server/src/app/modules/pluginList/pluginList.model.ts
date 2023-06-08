import { Schema, model } from "mongoose";
import { IPluginList } from "./pluginList.interface";

const pluginListSchema = new Schema<IPluginList>(
  {
    name: {
      type: String,
      required: true,
    },
    prefix: {
      type: String,
    },
    tableName: {
      type: String,
    },
    permalinks: {
      type: [String],
    },
    IDs: {
      type: [String],
    },
    icon: {
      svg: {
        type: String,
      },
      img: {
        type: String,
      },
    },
    folderName: {
      type: String,
    },
    versions: [
      {
        version: { type: String, required: true },
        downloadSlug: {
          type: String,
          required: true,
        },
        enabled: {
          type: Boolean,
          default: false,
        },
      },
    ],
    docsURL: {
      type: String,
    },
    demoURL: {
      type: String,
    },
  },
  { timestamps: true }
);

const PluginList = model<IPluginList>("pluginList", pluginListSchema);

export default PluginList;
