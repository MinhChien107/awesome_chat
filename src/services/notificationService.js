import NotificationModel from "../models/notificationModel";
import UserModel from "../models/userModel";

const LIMIT_NUMBER_TAKEN = 10;
// Hàm lấy ra danh sách thông báo (10 cái 1 lần)
let getNotifications  =  (currentUserId) => {
  return new Promise( async (resolve, reject) => {
    try {
      let notificationsArr = await NotificationModel.model.getByUserIdAndLimit(currentUserId,LIMIT_NUMBER_TAKEN);
      
      let getNotifContents = notificationsArr.map( async (notification) =>{
        let sender = await UserModel.getNormalUserDataById(notification.senderId); 
        return NotificationModel.contents.getContent(notification.type,notification.isRead,sender._id,sender.username, sender.avatar);
      });
      resolve(await Promise.all(getNotifContents));
    } catch (error) {
      reject(error);
    }
  })
};
// Đếm số thông báo chưa đọc của userId
let countNotifUnread  =  (currentUserId) => {
  return new Promise( async (resolve, reject) => {
    try {
      let notificationsUnread = await NotificationModel.model.countNotifUnread(currentUserId);
      resolve(notificationsUnread);
    } catch (error) {
      reject(error);
    }
  })
};

// Lấy thêm thông báo
let readMore  =  (currentUserId,skipNumberNotification) => {
  return new Promise( async (resolve, reject) => {
    try {
      let newNotificationsArr = await NotificationModel.model.readMore(currentUserId,skipNumberNotification,LIMIT_NUMBER_TAKEN);
      let getNotifContents = newNotificationsArr.map( async (notification) =>{
        let sender = await UserModel.getNormalUserDataById(notification.senderId); 
        return NotificationModel.contents.getContent(notification.type,notification.isRead,sender._id,sender.username, sender.avatar);
      });
      resolve(await Promise.all(getNotifContents));
      
    } catch (error) {
      reject(error);
    }
  });
};

// Đánh dấu thông báo đã đọc
let markAllAsRead  =  (currentUserId,targetUsers) => {
  return new Promise( async (resolve, reject) => {
    try {
      await NotificationModel.model.markAllAsRead(currentUserId,targetUsers);
      resolve(true);
    } catch (error) {
      reject(false);
    }
  })
};

module.exports = {
  getNotifications : getNotifications,
  countNotifUnread : countNotifUnread,
  readMore : readMore,
  markAllAsRead : markAllAsRead
};