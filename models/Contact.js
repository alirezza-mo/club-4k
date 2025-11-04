// models/Contact.js
import mongoose from "mongoose";

const contactSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "نام الزامی است"],
      trim: true,
    },
    email: {
      type: String,
      required: [true, "ایمیل الزامی است"],
      match: [/^[^\s@]+@[^\s@]+\.[^\s@]+$/, "ایمیل معتبر نیست"],
    },
    title: {
      type: String,
      required: [true, "موضوع پیام الزامی است"],
      trim: true,
    },
    message: {
      type: String,
      required: [true, "متن پیام الزامی است"],
      minlength: [5, "پیام باید حداقل ۵ کاراکتر داشته باشد"],
    },
    isRead: {
      type: Boolean,
      default: false, 
    },
  },
  {
    timestamps: true, 
  }
);

export default mongoose.models.Contact || mongoose.model("Contact", contactSchema);
