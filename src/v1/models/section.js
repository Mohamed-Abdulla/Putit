import mongoose from "mongoose";

import { schemaOptions } from "./modelOptions.js";
const Schema = mongoose.Schema;

const sectionSchema = new Schema(
  {
    board: {
      type: Schema.Types.ObjectId,
      ref: "Board",
      required: true,
    },
    title: {
      type: String,
      default: "",
    },
  },
  schemaOptions
);

export default mongoose.model("Section", sectionSchema);
