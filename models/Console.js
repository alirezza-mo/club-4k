const mongoose = require("mongoose");

const schema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    barcode: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    location: {
      type: String,
    },
    status: {
      type: String,
      enum: ["idle", "busy"],
      default: "idle",
      index: true,
    },
    currentSession: {
      type: mongoose.Types.ObjectId,
      ref: "GameSession",
      required: false,
    },
  },
  { timestamps: true }
);

const model = mongoose.models.Console || mongoose.model("Console", schema);
export default model;


