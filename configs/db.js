import mongoose from "mongoose";

let isConnected = false; 
const connectToDb = async () => {
  if (isConnected) {
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
    throw err; 
  }
};

export default connectToDb;
