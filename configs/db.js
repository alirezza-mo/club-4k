import mongoose from "mongoose";

let isConnected = false; // وضعیت اتصال رو نگه می‌داره

const connectToDb = async () => {
  if (isConnected) {
    // اگر قبلاً وصل بودیم، دوباره وصل نشویم
    return;
  }

  try {
    await mongoose.connect(process.env.MONGO_URL, {
      dbName: "4K-CLUB", 
    });
    isConnected = true;
    console.log("✅ MongoDB connected successfully");
  } catch (err) {
    console.error("❌ MongoDB connection error:", err.message);
    throw err; // خطا را به بالا پاس بده تا بتوانی هندلش کنی
  }
};

export default connectToDb;
