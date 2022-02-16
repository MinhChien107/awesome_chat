import mongoose from "mongoose";

let Schema = mongoose.Schema;

let ChatGroupSchema = new Schema({
  name  : String,
  userAmount: {type: Number, min:3, max: 177},
  mesageAmount: {type: Number, default: 0},
  userId: String,
  menbers: [
    {userId: String}
  ],
  createdAt : {type:Number, default:Date.now},
  updatedAt : {type:Number, default:null},
  deletedAt : {type:Number, default:null},
})

module.exports = mongose.model("chat-group", ChatGroupSchema)
