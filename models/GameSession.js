const mongoose = require("mongoose");

require("./Users");
require("./Console");

const schema = new mongoose.Schema(
  {
    console: {
      type: mongoose.Types.ObjectId,
      ref: "Console",
      required: true,
      index: true,
    },
    player1: {
      type: mongoose.Types.ObjectId,
      ref: "Users",
      required: false,
    },
    player2: {
      type: mongoose.Types.ObjectId,
      ref: "Users",
      required: false,
    },
    status: {
      type: String,
      enum: ["pendingStart", "active", "pendingEnd", "ended"],
      default: "pendingStart",
      index: true,
    },
    pendingByUser: {
      type: mongoose.Types.ObjectId,
      ref: "Users",
      required: false,
    },
    startedAt: {
      type: Date,
      required: false,
    },
    endedAt: {
      type: Date,
      required: false,
    },
    durationSeconds: {
      type: Number,
      required: false,
    },
  },
  { timestamps: true }
);

const model = mongoose.models.GameSession || mongoose.model("GameSession", schema);
export default model;


