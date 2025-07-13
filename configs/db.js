const mongoose = require("mongoose");

const connectToDb = async () => {
  
  try {
    if (mongoose.connections[0].readyState) {
      return false;
    }
    await mongoose.connect(`${process.env.MONGO_URL}`);
    console.log("connected");
  } catch (err) {
    console.log(err);
  }
};
export default connectToDb