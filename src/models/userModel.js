import mongoose from "mongoose";

let Schema = mongoose.Schema;

let UserSchema = new Schema({
  username: String,
  gender: {type : String, default : "male"},
  phone: {type : String, default: null},
  address: {type: String, default: null},
  avatar: {type: String, default: "avatar-default.jpg"},
  role: {type: String, default: "user"},
  local: {
    email : {type: String, trim: true},
    password: String,
    isActive: {type: Boolean, default: false},
    verifyToken: String
  },
  facebook: {
    uid : String,
    token: String,
    email: {type: String, trim: true},
  },
  google: {
    euid : String,
    token: String,
    email: {type: String, trim: true},
  },
  createdAt : {type:Number, default:Date.now},
  updatedAt : {type:Number, default:null},
  deletedAt : {type:Number, default:null},
});

UserSchema.statics = {
  createNew(item){
    return this.create(item);
  },
  //Tìm user theo email
  findByEmail(email) {
    return this.findOne({ "local.email": email }).exec();
  },
  //Xóa user theo id
  removeById(id) {
    return this.findByIdAndRemove(id).exec();
  },
  //Kiểm tra xem đúng token không và active tài khoản
  verify(token) {
    return this.findOneAndUpdate(
      { "local.verifyToken": token },
      { "local.isActive": true, "local.verifyToken": null }
    ).exec();
  },
  // TÌm user theo id và cập nhật mật khẩu
  findUserByIdToUpdatePassword(id) {
    return this.findById(id).exec();
  }, 
  // Tìm user theo id để session dùng có loại bỏ pw
  findUserByIdForSessionToUse(id) {
    return this.findById(id,{"local.password" : 0}).exec();
  }, 
  // Giống trên nhưng cho facebook
  findByFacebookUid(uid) {
    return this.findOne({"facebook.uid" : uid}).exec();
  },

  // Giống trên nhưng cho google
  findByGoogleUid(uid) {this.update
    return this.findByIdAndUpdate(uid,item).exec();
  },

  //Cập nhật mật khẩu
  updatePassword(id,hashedPassword) {
    return this.findByIdAndUpdate(id,{"local.password" : hashedPassword}).exec();
  },
  //Tìm danh sách user để gửi đi lời mời kết bạn
  findAllForAddContact(deprecatedUserId, keyWord) {
    return this.find({
      $and: [
        {"_id" : {$nin: deprecatedUserId}},
        {"local.isActive": true},
        {$or: [
          {"username": {"$regex" : new RegExp(keyWord,"i")}},
          {"local.email": {"$regex" : new RegExp(keyWord,"i")}},
          {"facebook.email": {"$regex" : new RegExp(keyWord,"i")}},
          {"google.email": {"$regex" : new RegExp(keyWord,"i")}}
        ]}
      ]
    },{_id : 1, username : 1 , address : 1, avatar : 1}).exec();
  },

  //Lây thông tin user 
  getNormalUserDataById(id) {
    return this.findById(id,{_id : 1, username : 1 , address : 1, avatar : 1}).exec();
  },

  //Lấy danh sách bạn bè để add vào group chat
  findAllToAddGroupChat(friendIds, keyWord) {
    return this.find({
      $and: [
        {"_id" : {$in: friendIds}},
        {"local.isActive": true},
        {$or: [
          {"username": {"$regex" : new RegExp(keyWord,"i")}},
          {"local.email": {"$regex" : new RegExp(keyWord,"i")}},
          {"facebook.email": {"$regex" : new RegExp(keyWord,"i")}},
          {"google.email": {"$regex" : new RegExp(keyWord,"i")}}
        ]}
      ]
    },{_id : 1, username : 1 , address : 1, avatar : 1}).exec();
  }
};



UserSchema.methods = {
  //Hàm so sánh mật khẩu 
  comparePassword(password) {
    return bcrypt.compare(password, this.local.password);
  }
};

module.exports = mongoose.model("users", UserSchema)