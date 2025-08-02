const mongoose = require("mongoose")

const schema = mongoose.Schema({
  message : {
    type : String , 
    required : true
  } , 
  user : {
    type : mongoose.Types.ObjectId ,
    ref : "Users" ,
    required : true
  } ,
  isAccept : {
    type : Boolean ,
    required : true ,
    default : false
  }
}, {
  timestamps : true
})

const model = mongoose.models.Echo || mongoose.model("Echo" , schema)

export default model