import express from 'express';
import {home,auth,user,contact, notification,message,groupChat} from '../controllers/index';
import validator from '../validation/authValidation';
import userValid from '../validation/userValidation';
import contactValid from '../validation/contactValidation';
import passport from 'passport';
import initPassportLocal from '../controllers/passportController/local';
import initPassportFacebook from '../controllers/passportController/facebook';
import initPassportGoogle from '../controllers/passportController/google'; 
import messageValidation from '../validation/messageValidation';
import groupChatValidation from '../validation/groupChatValidation';

//Khởi tạo login local facebook google
initPassportLocal();
initPassportFacebook();
initPassportGoogle();

let router = express.Router();

let initRoutes = (app) =>{
  //Vào màn đăng ký
  router.get('/login-register',auth.checkLoggedOut ,auth.loginRegister);
  //Gửi thông tin đăng ký tài khoản lên
  router.post('/register',auth.checkLoggedOut, validator.register,auth.postRegister);
  //Active tài khoản
  router.get('/verify/:token',auth.checkLoggedOut, auth.verifyAccount);
  //Gửi thông tin đăng nhập
  router.post('/login',auth.checkLoggedOut, passport.authenticate('local',{
    successRedirect: "/",
    failureRedirect: "/login-register",
    successFlash: true,
    failureFlash: true
  }));

  //Login bằng facebook
  router.get('/auth/facebook',auth.checkLoggedOut, passport.authenticate("facebook",{scope : ["email"]}));
  //Xử lý login facebook
  router.get('/auth/facebook/callback',auth.checkLoggedOut, passport.authenticate("facebook",{
    successRedirect: "/",
    failureRedirect: "/login-register"
  }));

  //Login bằng google
  router.get('/auth/google',auth.checkLoggedOut, passport.authenticate("google",{scope : ["email"]}));
  //xử lý login gg
  router.get('/auth/google/callback',auth.checkLoggedOut, passport.authenticate("google",{
    successRedirect: "/",
    failureRedirect: "/login-register"
  }));

  //Vào trang home
  router.get('/',auth.checkLoggedIn ,home);
  
  //Logout ra ngoài
  router.get('/logout',auth.checkLoggedIn ,auth.getLogout);

  //Cập nhật thông tin từ avatar, thông tin cá nhân và password
  router.put('/user/update-avatar',auth.checkLoggedIn , user.upDateAvatar );
  router.put('/user/update-infor',auth.checkLoggedIn , userValid.updateInfor ,user.updateInfor );
  router.put('/user/update-password',auth.checkLoggedIn, userValid.updatePassword ,user.updatePassword);

  //Tìm kiếm người dùng để kết bạn
  router.get('/contact/find-users/:keyWord',auth.checkLoggedIn, contactValid.findUserContact , contact.findUsersContact);
  //Gửi đi yêu cầu kết bạn  
  router.post('/contact/add-new',auth.checkLoggedIn, contact.addNew);
  // Xóa kết bạn
  router.delete('/contact/remove-contact',auth.checkLoggedIn, contact.removeContact);
  // Hủy yêu cầu kết bạn đã gửi đi
  router.delete('/contact/remove-request-contact-sent',auth.checkLoggedIn, contact.removeRequestContactSent);
  // Từ chối kết bạn
  router.delete('/contact/remove-request-contact-received',auth.checkLoggedIn, contact.removeRequestContactReceived);
  // Đồng ý kết bạn
  router.put('/contact/approve-request-contact-received',auth.checkLoggedIn, contact.approveRequestContactReceived);
  // Lấy thêm danh sách bạn bè
  router.get('/contact/read-more-contacts/:skipNumber',auth.checkLoggedIn, contact.readMoreContacts);
  // Lấy thêm danh sách yêu cầu kết bạn được gửi đii
  router.get('/contact/read-more-contacts-sent/:skipNumber',auth.checkLoggedIn, contact.readMoreContactsSent);
  // Lấy thêm danh sách yêu cầu chập nhận bạn bè
  router.get('/contact/read-more-contacts-received/:skipNumber',auth.checkLoggedIn, contact.readMoreContactsReceived);
  
  // Lấy thêm thông báo của user
  router.get('/notification/read-more/:skipNumber',auth.checkLoggedIn ,notification.readMore);
  //Đánh dấu đã đọc thông báo của user
  router.put('/notification/mark-all-as-read',auth.checkLoggedIn ,notification.markAllAsRead);
  
  // Gửi tin nhắn từ text-emoji -image - file tài liệu
  router.post('/message/add-new-text-emoji',auth.checkLoggedIn,messageValidation.checkMessageLength,message.addNewTextEmoij);
  router.post('/message/add-new-message',auth.checkLoggedIn,message.addNewImage);
  router.post('/message/add-new-attachment',auth.checkLoggedIn,message.addNewAttachment);
  // Lấy ra danh sách người chát và nhóm chat của user
  router.get('/message/read-more-all-chat',auth.checkLoggedIn,message.readMoreAllChat);

  // TÌm kiếm bạn bè của user theo keyword 
  router.get('/contact/search-friends/:keyword',auth.checkLoggedIn, contactValid.searchFriends , contact.searchFriends);
  // Lấy thêm danh sách tin nhắn 
  router.get('/message/read-more',auth.checkLoggedIn, message.readMore);
  // Add thêm người vào group chat
  router.post('/group-chat/add-new',auth.checkLoggedIn, groupChatValidation.addNewGroup, groupChat.addNewGroup);

  return app.use('/',router);

}

module.exports = initRoutes;