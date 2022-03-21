import ContactModel from "../models/contactModel";
import UserModel from "../models/userModel";
import NotificationModel from "../models/notificationModel";
import _ from "lodash";

const LIMIT_NUMBER_TAKEN = 10;
// Tìm kiếm user theo keyword
let findUsersContact = (currentUserId,keyWord) => {
  return new Promise( async (resolve, reject) =>{
    
    let deprecatedUserId = [currentUserId]; 
    let contactByUser = await ContactModel.findAllByUser(currentUserId);
    contactByUser.forEach(contact =>{
      deprecatedUserId.push(contact.userId);
      deprecatedUserId.push(contact.contactId);
    });
   
    deprecatedUserId = _.uniqBy(deprecatedUserId);
    let users = await UserModel.findAllForAddContact(deprecatedUserId,keyWord);
    resolve(users);
  });

}
// Tạo liên lạc và thông báo
let addNew = (currentUserId,contactId) => {
  return new Promise( async (resolve, reject) =>{
    let contactExists = await ContactModel.checkExists(currentUserId,contactId);
    if(contactExists){
      return reject(false);
    }
    // create contact
    let newContactItem = {
      userId: currentUserId,
      contactId: contactId
    };
    let newContact = await ContactModel.createNew(newContactItem);

    // create notification
    let notificationItem = {
      senderId : currentUserId,
      receiverId : contactId,
      type : NotificationModel.types.ADD_CONTACT
    };
    await NotificationModel.model.createNew(notificationItem);

    resolve(newContact);
  }); 

} 

// Xóa thông tin liên lạc
let removeContact = (currentUserId,contactId) =>{
  return new Promise( async (resolve, reject) =>{
    let removeContact = await ContactModel.removeContact(currentUserId,contactId);

      if(removeContact.result.n === 0){
        return reject(false);
      }
    resolve(true);
  }); 
}

// Xóa yêu cầu gửi đi kết bạn 
let removeRequestContactSent = (currentUserId,contactId) => {
  return new Promise( async (resolve, reject) =>{
    let removeReq = await ContactModel.removeRequestContactSent(currentUserId,contactId);
    if(removeReq.result.n === 0){
      return reject(false);
    }
    // remove notification
    let notifTypeAddContact = NotificationModel.types.ADD_CONTACT;
    await NotificationModel.model.removeRequestContactSentNotification(currentUserId,contactId,notifTypeAddContact);
    resolve(true);
  }); 

} 

// Xóa yêu cầu lời mời kết bạn
let removeRequestContactReceived = (currentUserId,contactId) => {
  return new Promise( async (resolve, reject) =>{
    let removeReq = await ContactModel.removeRequestContactReceived(currentUserId,contactId);
    if(removeReq.result.n === 0){
      return reject(false);
    }
    // remove notification
    // let notifTypeAddContact = NotificationModel.types.ADD_CONTACT;
    // await NotificationModel.model.removeRequestContactReceivedNotification(currentUserId,contactId,notifTypeAddContact);
    resolve(true);
  }); 

} 

// Đồng ý yêu câu kết bạn
let approveRequestContactReceived = (currentUserId,contactId) => {
  return new Promise( async (resolve, reject) =>{
    let approveReq = await ContactModel.approveRequestContactReceived(currentUserId,contactId);
    if(approveReq.nModified === 0){
      return reject(false);
    }
    // create notification
    let notificationItem = {
      senderId : currentUserId,
      receiverId : contactId,
      type : NotificationModel.types.APPROVE_CONTACT
    };
    await NotificationModel.model.createNew(notificationItem);
    resolve(true);
  }); 

} 

// Lấy danh sách bạn bè theo limit
let getContacts = (currentUserId) => {
  return new Promise( async (resolve, reject) =>{
    try {
      let contacts = await ContactModel.getContacts(currentUserId,LIMIT_NUMBER_TAKEN);
      let users = contacts.map( async (contact) =>{
        if(contact.contactId == currentUserId){
          return await UserModel.getNormalUserDataById(contact.userId);
        } else {
          return await UserModel.getNormalUserDataById(contact.contactId);
        }
        
      });
      resolve(await Promise.all(users));
  } catch (error) {
      reject(error);  
    }
  }); 

}
// Lấy ra danh sách người đã được gửi kết bạn
let getContactsSent = (currentUserId) => {
  return new Promise( async (resolve, reject) =>{
    try {
      let contacts = await ContactModel.getContactsSent(currentUserId,LIMIT_NUMBER_TAKEN);
      let users = contacts.map( async (contact) =>{
        return await UserModel.getNormalUserDataById(contact.contactId)
      });
      resolve(await Promise.all(users));
    } catch (error) {
      reject(error);
    }
  }); 

}

// Lấy ra danh sách người yêu cầu kết bạn
let getContactsReceived = (currentUserId) => {
  return new Promise( async (resolve, reject) =>{
    try {
      let contacts = await ContactModel.getContactsReceived(currentUserId,LIMIT_NUMBER_TAKEN);
      let users = contacts.map( async (contact) =>{
        return await UserModel.getNormalUserDataById(contact.userId)
      });
      resolve(await Promise.all(users));
    } catch (error) {
      reject(error);
    }
  }); 

}
// Đếm số bạn bè
let countAllContacts = (currentUserId) => {
  return new Promise( async (resolve, reject) =>{
    try {
      let count = await ContactModel.countAllContacts(currentUserId);
      resolve(count);
    } catch (error) {
      reject(error);
    }
  }); 
}
// Đếm số yêu cầu gửi đi kết bạn 
let countAllContactsSent = (currentUserId) => {
  return new Promise( async (resolve, reject) =>{
    try {
      let count = await ContactModel.countAllContactsSent(currentUserId);
      resolve(count);
    } catch (error) {
      reject(error);
    }
  }); 
}
// Đếm số yêu cầu nhận được kết bạn
let countAllContactsReceived = (currentUserId) => {
  return new Promise( async (resolve, reject) =>{
    try {
      let count = await ContactModel.countAllContactsReceived(currentUserId);
      resolve(count);
    } catch (error) {
      reject(error);
    }
  }); 
}

// Lấy thêm số bạn bè 
let readMoreContacts = (currentUserId,skipNumberContacts) => { 
  return new Promise( async (resolve, reject) => {
    try {
      let newContactsArr = await ContactModel.readMoreContacts(currentUserId,skipNumberContacts,LIMIT_NUMBER_TAKEN);
      
      let users = newContactsArr.map( async (contact) =>{
        if(contact.contactId == currentUserId){
          return await UserModel.getNormalUserDataById(contact.userId);
        } else {
          return await UserModel.getNormalUserDataById(contact.contactId);
        }
      });
      resolve(await Promise.all(users));
      
    } catch (error) {
      reject(error);
    }
  });
}
// Lấy thêm số yêu cầu kết bạn gửi đi 
let readMoreContactsSent = (currentUserId,skipNumberContacts) => { 
  return new Promise( async (resolve, reject) => {
    try {
      let newContactsArr = await ContactModel.readMoreContactsSent(currentUserId,skipNumberContacts,LIMIT_NUMBER_TAKEN);
      let users = newContactsArr.map( async (contact) =>{
        return await UserModel.getNormalUserDataById(contact.contactId)
      });
      resolve(await Promise.all(users));
      
    } catch (error) {
      reject(error);
    }
  });
}
// lấy thêm người yêu cầu kết bạn
let readMoreContactsReceived = (currentUserId,skipNumberContacts) => { 
  return new Promise( async (resolve, reject) => {
    try {
      let newContactsArr = await ContactModel.readMoreContactsReceived(currentUserId,skipNumberContacts,LIMIT_NUMBER_TAKEN);
      let users = newContactsArr.map( async (contact) =>{
        return await UserModel.getNormalUserDataById(contact.userId);
      });
      resolve(await Promise.all(users));
      
    } catch (error) {
      reject(error);
    }
  });
}
// Tìm kiếm bạn bè
let searchFriends = (currentUserId,keyWord) => {
  return new Promise( async (resolve, reject) =>{
    let friendIds = [];
    let friends = await ContactModel.getFriends(currentUserId);

    friends.forEach((item)=>{
      friendIds.push(item.userId);
      friendIds.push(item.contactId);
    });

    friendIds = _.uniqBy(friendIds);
    friendIds = friendIds.filter(userId => userId != currentUserId);

    let users = await UserModel.findAllToAddGroupChat(friendIds,keyWord);
    resolve(users);
  });

}

module.exports = {
  findUsersContact : findUsersContact,
  addNew : addNew,
  removeContact : removeContact,
  removeRequestContactSent : removeRequestContactSent,
  getContacts : getContacts,
  getContactsSent : getContactsSent,
  getContactsReceived : getContactsReceived,
  countAllContacts : countAllContacts,
  countAllContactsSent : countAllContactsSent,
  countAllContactsReceived : countAllContactsReceived,
  readMoreContacts: readMoreContacts,
  readMoreContactsSent : readMoreContactsSent,
  readMoreContactsReceived: readMoreContactsReceived,
  removeRequestContactReceived : removeRequestContactReceived,
  approveRequestContactReceived: approveRequestContactReceived,
  searchFriends : searchFriends
}