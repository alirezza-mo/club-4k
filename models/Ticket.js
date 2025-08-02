  const mongoose = require("mongoose");
  require("./Users");

  const schema = new mongoose.Schema(
    {
      title: {
        type: String,
        required: true,
      },
      body: {
        type: String,
        required: true,
      },
      user: {
        type: mongoose.Types.ObjectId,
        ref: "Users",
        required: true,
      },
      department: {
        type: String,
        required: true,
      },
      priority: {
        type: Number,
        default: 1,
        enum: [1, 2, 3],
      },
      hasAnswer : {
        type : Boolean ,
        default : false
      },
      isAnswer: {
        type: Boolean,
        default: false,
      },
      mainTicket: {
        type: mongoose.Types.ObjectId,
        ref: "Ticket",
        required: false,
      },
    },
    {
      timestamps: true,
    }
  );

  const model = mongoose.models.Ticket || mongoose.model("Ticket", schema);

  export default model;
