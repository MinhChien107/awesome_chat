import {notification,contact, message} from './../services/index';
import {bufferToBase64, lastItemOfArr,convertTimestampToHumanTime} from '../helpers/clientHeper';

let homeController = async (req,res) => {
  // Lấy ra 10 thông báo 1 lần
  let notifications = await notification.getNotifications(req.user._id);
  // Đếm số thông báo chưa đọc
  let countNotifUnread = await notification.countNotifUnread(req.user._id);

  // Lấy ra 10 bạn bè 1 lần
  let contacts = await contact.getContacts(req.user._id);

  // Lấy danh sách chờ xác nhận
  let contactsSent = await contact.getContactsSent(req.user._id);

  // Lấy danh sách yêu cầu kết bạn
  let contactsReceived = await contact.getContactsReceived(req.user._id);

  // Count bạn bè, chờ xác nhận, yêu cầu kết bạn
  let countAllContacts = await contact.countAllContacts(req.user._id);
  let countAllContactsSent = await contact.countAllContactsSent(req.user._id);
  let countAllContactsReceived = await contact.countAllContactsReceived(req.user._id);

  let getAllConversationItems = await message.getAllConversationItems(req.user._id);
  let allConversations = getAllConversationItems.allConversations;
  let userConversations = getAllConversationItems.userConversations;
  let groupConversations = getAllConversationItems.groupConversations;
  // Danh sách các cuộc trò chuyện và tin nhắn theo từng user
  let allConversationWithMessage = getAllConversationItems.allConversationWithMessage;

  return res.render('main/home/home',{
    errors: req.flash('errors'),
    success: req.flash('success'),
    user: req.user,
    notifications: notifications,
    countNotifUnread : countNotifUnread,
    contacts : contacts,
    contactsSent: contactsSent,
    contactsReceived : contactsReceived,
    countAllContacts : countAllContacts,
    countAllContactsSent : countAllContactsSent,
    countAllContactsReceived : countAllContactsReceived,
    allConversations : allConversations,
    userConversations : userConversations,
    groupConversations : groupConversations,
    allConversationWithMessage : allConversationWithMessage,
    bufferToBase64 : bufferToBase64,
    lastItemOfArr : lastItemOfArr,
    convertTimestampToHumanTime : convertTimestampToHumanTime
  });
}

module.exports = homeController;
