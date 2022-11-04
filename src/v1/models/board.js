import mongoose from "mongoose";

import { schemaOptions } from "./modelOptions.js";
const Schema = mongoose.Schema;

const boardSchema = new Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    icon: {
      type: String,
      default: "📃",
    },
    title: {
      type: String,
      default: "Untitled",
    },
    description: {
      type: String,
      default: `Add description here
     💠You can add multiline description
     💠Let's start...`,
    },
    position: {
      type: Number,
    },
    favourite: {
      type: Boolean,
      default: false,
    },
    favouritePosition: {
      type: Number,
      default: 0,
    },
  },
  schemaOptions
);
export default mongoose.model("Board", boardSchema);
