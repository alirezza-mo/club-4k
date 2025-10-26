import mongoose from "mongoose";

let isConnected = false; 
const connectToDb = async () => {
  if (isConnected) {
    return;
  }

  try {
    await mongoose.connect(process.env.MONGO_URL, {
      dbName: "4K-CLUB",
      serverSelectionTimeoutMS: 30000, // افزایش تایم‌اوت به 30 ثانیه
      socketTimeoutMS: 30000,
      connectTimeoutMS: 30000,
      maxPoolSize: 10,
      minPoolSize: 5,
      maxIdleTimeMS: 60000
    });
    isConnected = true;
    console.log("✅ MongoDB connected successfully");
  } catch (err) {
    console.error("❌ MongoDB connection error:", err.message);
    throw err; 
  }
};

export default connectToDb;
