const mongoose = require("mongoose")

const schema = mongoose.Schema({
  gameNet: {
      type: String,
      required: true,
    } ,
    code : {
      type: String,
      required: true,
    } ,
    password : {
      type: String,
      required: true,
    } , 
    phone : {
      type: String,
      required: true,
    }
})

const model = mongoose.models.Admin || mongoose.model("Admin", schema);
export default model;