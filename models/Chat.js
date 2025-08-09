import mongoose from "mongoose";
import "./Admin";
import "./Users";

const chatSchema = new mongoose.Schema(
  {
    sender: {
      type: mongoose.Types.ObjectId,
      required: true,
      refPath: "senderModel",
    },
    senderModel: {
      type: String,
      required: true,
      enum: ["Admin", "Users"],
    }, 
    message: {
      type: String,
      required: true,
    }
  },
  {
    timestamps: true,
  }
);

const Chat = mongoose.models.Chat || mongoose.model("Chat", chatSchema);
export default Chat;
