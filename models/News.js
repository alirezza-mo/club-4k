const mongoose = require("mongoose");
import "./Admin";

const schema = mongoose.Schema(
  {
    admin: {
      type: mongoose.Types.ObjectId,
      ref: "Admin",
      required: true,
    },
    content: {
      type: String,
      required: true,
    },
    image: { type: String },
    publishedAt: { type: Date, default: Date.now },
    confirmed: { type: String, default: false, required: false },
  },
  {
    timestamps: true,
  }
);

const model = mongoose.models.News || mongoose.model("News", schema);
export default model;
