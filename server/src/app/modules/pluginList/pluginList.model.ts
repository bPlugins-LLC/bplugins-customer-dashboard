import { Schema, model } from "mongoose";
import { IPluginList } from "./pluginList.interface";

const pluginListSchema = new Schema({
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
});

const PluginList = model<IPluginList>("pluginList", pluginListSchema);

export default PluginList;
