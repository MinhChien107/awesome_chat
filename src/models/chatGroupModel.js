import mongoose from "mongoose";

let Schema = mongoose.Schema;

let ChatGroupSchema = new Schema({
  name: String,
  userAmount: { type: Number, min: 3, max: 177 },
  mesageAmount: { type: Number, default: 0 },
  userId: String,
  menbers: [
    { userId: String }
  ],
  createdAt: { type: Number, default: Date.now },
  updatedAt: { type: Number, default: Date.now },
  deletedAt: { type: Number, default: null },
})

ChatGroupSchema.statics = {
  //Tạo nhóm chát
  createNew(item) {
    return this.create(item);
  },

  // Lấy nhóm chat của userId có giới hạn
  getChatGroups(userId, limit) {
    return this.find({
      "members": { $elemMatch: { "userId": userId } }
    }).sort({ "updatedAt": -1 }).limit(limit).exec();
  },

  //Lấy nhóm chát của userId theo skip và limit
  readMoreChatGroups(userId, skip, limit) {
    return this.find({
      "members": { $elemMatch: { "userId": userId } }
    }).sort({ "updatedAt": -1 }).skip(skip).limit(limit).exec();
  },

  //Lấy nhóm chát theo id
  getChatGroupById(id) {
    return this.findById(id).exec();
  },

  //Cập nhật lại updatedAt và tổng số message trog nhóm khi có người thêm tin nhắn mới theo id
  updateWhenAddNewMessage(id, newMessageAmount) {
    return this.findByIdAndUpdate(id, {
      "messageAMount": newMessageAmount,
      "updatedAt": Date.now()
    }).exec();
  },
  //Lấy nhóm hết chát của userId
  getChatGroupIdsByUser(userId) {
    return this.find({
      "members": { $elemMatch: { "userId": userId } }
    }, { _id: 1 }).exec();
  },
  //Lấy thêm nhóm chát của userId
  readMoreChatGroups(userId, skip, limit) {
    return this.find({
      "members": { $elemMatch: { "userId": userId } }
    }).sort({ "updatedAt": -1 }).skip(skip).limit(limit).exec();
  }
};
module.exports = mongoose.model("chat-groups", ChatGroupSchema)
