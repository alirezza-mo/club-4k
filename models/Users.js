const mongoose = require("mongoose");

const schema = mongoose.Schema(
  {
    userName: {
      type: String,
      required: true,
      index: true,
      unique: true,
    },
    phone: {
      type: String,
      required: true,
      match: /^(\+98|0)?9\d{9}$/,
    },
    password: {
      type: String,
      required: true,
      minLength: 8,
    },
    gameNet: {
      // type: mongoose.Types.ObjectId,
      // ref: "GameNet",
      type : String ,
      required: true,
    },
    avatar: {
      type: String,
    },
    profile: {
      type: String,
    },
    bio: {
      Type: String,
    },
    xp: {
      type: String,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timeStamps: true }
);

const model = mongoose.models.Users || mongoose.model("Users", schema);
export default model;
