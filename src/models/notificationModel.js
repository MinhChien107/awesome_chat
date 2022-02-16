import mongoose from "mongoose";

let Schema = mongoose.Schema;

let NotificationSchema = new Schema({
  sender: {
    id: String,
    username: String,
    avatar: String
  },
  reciver: {
    id: String,
    username: String,
    avatar: String
  },
  type: String,
  createdAt : {type:Number, default:Date.now},
  updatedAt : {type:Number, default:null},
  deletedAt : {type:Number, default:null},
})

module.exports = mongoose.model("notification", NotificationSchema)
