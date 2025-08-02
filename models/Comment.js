const mongoose = require("mongoose");
import "./Users"

const schema = mongoose.Schema(
  {
    isAccept: {
      type: Boolean,
      required: false,
    },
    user: {
      type: mongoose.Types.ObjectId,
      ref: "Users",
      required: true,
    },
    message: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const model = mongoose.models.Comment || mongoose.model("Comment", schema);
export default model;
