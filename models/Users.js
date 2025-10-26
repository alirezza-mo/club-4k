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
      type: String,
    },
    xp: {
      type: Number,
      default: 0,
    },
    lastResultAt: {
      type: Date,
      required: false,
    },
    age : {
      type: String,
    } ,
    firstName : {
      type: String,
    } ,
    lastName : {
      type: String,
    } ,
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true  }
);

const model = mongoose.models.Users || mongoose.model("Users", schema);
export default model;
