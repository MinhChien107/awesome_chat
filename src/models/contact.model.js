import mongoose from "mongoose";

let Schema = mongoose.Schema;

let ContactSchema = new Schema({
  userId  : String,
  contactId: String,
  status: {type: Boolean, default: false},
  createdAt : {type:Number, default:Date.now},
  updatedAt : {type:Number, default:null},
  deletedAt : {type:Number, default:null},
})

module.exports = mongose.model("contact", ContactSchema)
