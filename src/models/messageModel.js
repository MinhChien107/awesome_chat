import mongoose from "mongoose";

let Schema = mongoose.Schema;

let MessageSchema = new Schema({
  senderId: String,
  receiverId: String,
  conversationType: String,
  messageType: String,
  sender: {
    id : String,
    name : String,
    avatar : String
  },
  reciver: {
    id : String,
    name : String,
    avatar : String
  },
  text: String,
  file: {
    data: Buffer,
    contentType: String,
    fileName: String
  },
  createdAt : {type:Number, default:Date.now},
  updatedAt : {type:Number, default:null},
  deletedAt : {type:Number, default:null},
});

MessageSchema.statics = {
  createNew(item){
    return this.create(item);
  },

  //Lấy danh sách tin nhắn trong cuộc tn 1-1
  getMessagesInPersonal(senderId,receiverId, limit){
    return this.find({
      $or: [
        {$and:[
          {"senderId" : senderId},
          {"receiverId" : receiverId}
        ]},
        {$and:[
          {"receiverId" : senderId},
          {"senderId" : receiverId}
        ]}
      ]
    }).sort({"createdAt": -1}).limit(limit).exec();
  },

  //Lấy danh sách message trong  nhóm
  getMessagesInGroup(receiverId, limit){
    return this.find({"receiverId" : receiverId}).sort({"createdAt": -1}).limit(limit).exec();
  },

  //Lấy thêm danh sách tin nhắn trong cuộc tn 1-1
  readMoreMessagesInPersonal(senderId,receiverId,skip, limit){
    return this.find({
      $or: [
        {$and:[
          {"senderId" : senderId},
          {"receiverId" : receiverId}
        ]},
        {$and:[
          {"receiverId" : senderId},
          {"senderId" : receiverId}
        ]}
      ]
    }).sort({"createdAt": -1}).skip(skip).limit(limit).exec();
  },
  //Lấy danh thêm sách message trong  nhóm
  readMoreMessagesInGroup(receiverId,skip, limit){
    return this.find({"receiverId" : receiverId}).sort({"createdAt": -1}).skip(skip).limit(limit).exec();
  },
}
const MESSAGES_CONVERSATION_TYPE = {
  PERSONAL : "personal",
  GROUP : "group"
};

const MESSAGES_TYPE = {
  TEXT : "text",
  IMAGE : "image",
  FILE : "file"
};

module.exports = {
  model : mongoose.model('messages',MessageSchema),
  conversationType : MESSAGES_CONVERSATION_TYPE,
  messageType : MESSAGES_TYPE
}