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

ContactSchema.statics = {
  createNew(item){
    return this.create(item);
  },

  //Tìm tất cả các contact của userId
  findAllByUser(userId) {
    return this.find({
      $or : [
        {userId: userId},
        {contactId : userId}
      ]
    }).exec();
  },

  //check xem userId và contacId đã gửi kết bạn hay bạn bè chưa
  checkExists(userId,contactId) {
    return this.findOne({
      $or: [
        {$and: [
          {"userId": userId},
          {"contactId" : contactId}
        ]},
        {$and : [
          {"userId" : contactId},
          {"contactId": userId}
        ]}
      ]
    })
  },

  //Xóa kết bạn
  removeContact(userId,contactId){
    return this.remove({
      $or: [
        {$and: [
          {"userId": userId},
          {"contactId" : contactId},
          {"status": true}
        ]},
        {$and : [
          {"userId" : contactId},
          {"contactId": userId},
          {"status": true}
        ]}
      ]
    }).exec();
  },

  //Hủy yêu cầu gửi kết bạn
  removeRequestContactSent(userId, contactId){
    return this.remove({
      $and: [
        {"userId": userId},
        {"contactId" : contactId},
        {"status": false}
      ]
    }).exec();
  },

  //Từ chối yêu cầu kết bạn
  removeRequestContactReceived(userId, contactId){
    return this.remove({
      $and: [
        {"contactId": userId},
        {"userId" : contactId},
        {"status": false}
      ]
    }).exec();
  },

  //Đồng ý yêu cầu kết bạn
  approveRequestContactReceived(userId, contactId){
    return this.update({
      $and: [
        {"contactId": userId},
        {"userId" : contactId},
        {"status": false}
      ]
    },{"status":true,"updatedAt":Date.now() }).exec();
  },

  //Lấy danh sách bạn bè
  getContacts(userId, limit){
    return this.find({
      $and: [
        {$or:[
          {"userId": userId},
          {"contactId": userId}
        ]},
        {"status": true}
      ]
    }).sort({"updatedAt": -1}).limit(limit).exec();
  },

  //Lấy danh sách gửi lời mời kết bạn của userId
  getContactsSent(userId, limit){
    return this.find({
      $and: [
        {"userId": userId},
        {"status": false}
      ]
    }).sort({"createdAt": -1}).limit(limit).exec();
  },

  //Đếm tất cả số lượng bạn bè
  countAllContacts(userId){
    return this.count({
      $and: [
        {$or:[
          {"userId": userId},
          {"contactId": userId}
        ]},
        {"status": true}
      ]
    }).exec();
  },

  //Đếm tất cả yêu cầu kết bạn của userId
  countAllContactsSent(userId){
    return this.count({
      $and: [
        {"userId": userId},
        {"status": false}
      ]
    }).exec();
  },

  //Đếm tất cả lời mời kết bạn đến userId
  countAllContactsReceived(userId){
    return this.count({
      $and: [
        {"contactId": userId},
        {"status": false}
      ]
    }).exec();
  },

  //Lấy thêm danh sách bạn bè của user ID
  readMoreContacts(userId,skip,limit){
    return this.find({
      $and: [
        {$or:[
          {"userId": userId},
          {"contactId": userId}
        ]},
        {"status": true}
      ]
    }).sort({"updatedAt": -1}).skip(skip).limit(limit).exec();
  },

  //Lấy thêm danh sách gửi đi lời nời kết bạn của userId
  readMoreContactsSent(userId,skip,limit){
    return this.find({
      $and: [
        {"userId": userId},
        {"status": false}
      ]
    }).sort({"createdAt": -1}).skip(skip).limit(limit).exec();
  }, 

  //Lấy thêm danh sách gửi lời kết bạn đến userId
  readMoreContactsReceived(userId,skip,limit){
    return this.find({
      $and: [
        {"contactId": userId},
        {"status": false}
      ]
    }).sort({"createdAt": -1}).skip(skip).limit(limit).exec();
  },

  //Cập nhật updatedAt khi có tin nhắn mới
  updateWhenAddNewMessage(userId, contactId){
    return this.update({
      $or: [
        {$and: [
          {"userId": userId},
          {"contactId" : contactId}
        ]},
        {$and : [
          {"userId" : contactId},
          {"contactId": userId}
        ]}
      ]
    },{
      "updatedAt" : Date.now()
    }).exec();
  },

  //Lấy tất cả danh sách bạn bè
  getFriends(userId){
    return this.find({
      $and: [
        {$or:[
          {"userId": userId},
          {"contactId": userId}
        ]},
        {"status": true}
      ]
    }).sort({"updatedAt": -1}).exec();
  }
};

module.exports = mongoose.model("contacts", ContactSchema)
