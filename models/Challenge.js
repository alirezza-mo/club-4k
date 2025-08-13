const mongoose = require("mongoose");

const schema = mongoose.Schema(
  {
    inviter: { type: mongoose.Types.ObjectId, ref: "Users", required: true },
    invited: { type: mongoose.Types.ObjectId, ref: "Users", required: true },
    location: { type: mongoose.Types.ObjectId, ref: "Admin", required: true },
    fightTime: { type: Date, required: true },
    status: {
      type: String,
      enum: ["pending", "accepted", "rejected"],
      default: "pending",
    },
    // result: { type: String },
    // session: { type: mongoose.Types.ObjectId, ref: "Session" },
    game: { type: String , required: true },
    message: { type: String , default: "" },
  },
  { timestamps: true }
);

const model = mongoose.models.Challenge || mongoose.model("Challenge", schema);
export default model;
