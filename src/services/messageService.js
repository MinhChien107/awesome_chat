import ContactModel from '../models/contactModel';
import UserModel from '../models/userModel';
import ChatGroupModel from '../models/chatGroupModel';
import MessageModel from '../models/messageModel';
import _ from 'lodash';
import {transError} from '../../lang/vi';
import {app} from '../config/app';
import fsExtra from 'fs-extra';

const LIMIT_CONVERSATIONS_TAKEN = 15;
const LIMIT_MESSAGES_TAKEN = 30;

// Lấy dnah sách người và nhóm chat theo user
let getAllConversationItems = (currentUserId) =>{ 
  return new Promise( async(resolve, reject) =>{
    try {
      // Lấy Thông tin những người chat với currentUserId
      let contacts = await ContactModel.getContacts(currentUserId,LIMIT_CONVERSATIONS_TAKEN);
      let userConversationsPromise = contacts.map( async (contact) =>{
        if(contact.contactId == currentUserId){
          let getUserContact = await UserModel.getNormalUserDataById(contact.userId);
          getUserContact.updatedAt = contact.updatedAt;
          return getUserContact;
        } else {
          let getUserContact = await UserModel.getNormalUserDataById(contact.contactId);
          getUserContact.updatedAt = contact.updatedAt;
          return getUserContact;
        }        
      });
      let userConversations = await Promise.all(userConversationsPromise);

      // Lấy danh sách nhóm chat của currentUserId
      let groupConversations = await ChatGroupModel.getChatGroups(currentUserId,LIMIT_CONVERSATIONS_TAKEN );
      // Ghép 2 mảng với nhau 
      let allConversations = userConversations.concat(groupConversations);

      // xắp xếp 2 mảng theo uodatedAt
      allConversations = _.sortBy(allConversations, (item) =>{ 
        return -item.updatedAt;
      });

      // Lấy tin nhắn theo các cuộc trò truyện trên
      let allConversationWithMessagePromise = allConversations.map( async (conversation) =>{
        //conversation = conversation.toObject();
        if(conversation.members){
          let getMessages = await MessageModel.model.getMessagesInGroup(conversation._id,LIMIT_MESSAGES_TAKEN);
          conversation.messages = _.reverse(getMessages);
        }
        else{
          let getMessages = await MessageModel.model.getMessagesInPersonal(currentUserId,conversation._id,LIMIT_MESSAGES_TAKEN);
          conversation.messages = _.reverse(getMessages);  
        }
        
        return conversation;
      });

      let allConversationWithMessage = await Promise.all(allConversationWithMessagePromise);

      allConversationWithMessage = _.sortBy(allConversationWithMessage, (item) =>{ 
        return -item.updatedAt
      });

      resolve({
        userConversations : userConversations,
        groupConversations : groupConversations,
        allConversations : allConversations,
        allConversationWithMessage : allConversationWithMessage
      });
    } catch (error) {
      reject(error);
    }
  });
};

// gửi tin nhắn dạng emoij , text
let addNewTextEmoij = (sender,receiverId,messageVal,isChatGroup) =>{
  return new Promise( async (resolve, reject) =>{
    try {
      if(isChatGroup) {
        let getChatGroupReceiver = await ChatGroupModel.getChatGroupById(receiverId);
        if(!getChatGroupReceiver){
          return reject(transError.conversation_not_found);
        }
        let receiver = {
          id: getChatGroupReceiver._id,
          name: getChatGroupReceiver.name,
          avatar: app.general_avatar_group_chat
        };

        let newMessageItem = {
          senderId: sender.id,
          receiverId: receiver.id,
          conversationType: MessageModel.conversationType.GROUP,
          messageType: MessageModel.messageType.TEXT,
          sender : sender,
          receiver : receiver,
          text : messageVal,
          createdAt : Date.now()
        };

        // create new message
        let newMessage = await MessageModel.model.createNew(newMessageItem);
        // update group chat
        await ChatGroupModel.updateWhenAddNewMessage(getChatGroupReceiver._id,getChatGroupReceiver.messageAMount + 1);
        resolve(newMessage);
      }else{
        let getUserReceiver = await UserModel.getNormalUserDataById(receiverId);
        if(!getUserReceiver){
          return reject(transError.conversation_not_found);
        }

        let receiver = {
          id: getUserReceiver._id,
          name: getUserReceiver.username,
          avatar: getUserReceiver.avatar
        };

        let newMessageItem = {
          senderId: sender.id,
          receiverId: receiver.id,
          conversationType: MessageModel.conversationType.PERSONAL,
          messageType: MessageModel.messageType.TEXT,
          sender : sender,
          receiver : receiver,
          text : messageVal,
          createdAt : Date.now()
        };
        // create new message
        let newMessage = await MessageModel.model.createNew(newMessageItem);
        // update contact
        await ContactModel.updateWhenAddNewMessage(sender.id,getUserReceiver._id);
        resolve(newMessage);

      }
    } catch (error) {
      reject(error);
    }
  });
};

// Tạo tin nhắn theo dạng ảnh
let addNewImage = (sender,receiverId,messageVal,isChatGroup) =>{
  return new Promise( async (resolve, reject) =>{
    try {
      if(isChatGroup) {
        let getChatGroupReceiver = await ChatGroupModel.getChatGroupById(receiverId);
        if(!getChatGroupReceiver){
          return reject(transError.conversation_not_found);
        }
        let receiver = {
          id: getChatGroupReceiver._id,
          name: getChatGroupReceiver.name,
          avatar: app.general_avatar_group_chat
        };
        let imageBuffer = await fsExtra.readFile(messageVal.path);
        let imageContentType = messageVal.mimetype;
        let imageName = messageVal.originalname;
        let newMessageItem = {
          senderId: sender.id,
          receiverId: receiver.id,
          conversationType: MessageModel.conversationType.GROUP,
          messageType: MessageModel.messageType.IMAGE,
          sender : sender,
          receiver : receiver,
          file : {data : imageBuffer , contentType : imageContentType, fileName : imageName},
          createdAt : Date.now()
        };
        // create new message
        let newMessage = await MessageModel.model.createNew(newMessageItem);
        // update group chat
        await ChatGroupModel.updateWhenAddNewMessage(getChatGroupReceiver._id,getChatGroupReceiver.messageAMount + 1);
        resolve(newMessage);
      }else{
        let getUserReceiver = await UserModel.getNormalUserDataById(receiverId);
        
        if(!getUserReceiver){
          return reject(transError.conversation_not_found);
        }

        let receiver = {
          id: getUserReceiver._id,
          name: getUserReceiver.username,
          avatar: getUserReceiver.avatar
        };

        let imageBuffer = fsExtra.readFile(messageVal.path);
        let imageContentType = messageVal.mimetype;
        let imageName = messageVal.originalname;

        let newMessageItem = {
          senderId: sender.id,
          receiverId: receiver.id,
          conversationType: MessageModel.conversationType.PERSONAL,
          messageType: MessageModel.messageType.IMAGE,
          sender : sender,
          receiver : receiver,
          file : {data : imageBuffer , contentType : imageContentType, fileName : imageName},
          createdAt : Date.now()
        };
        // create new message
        let newMessage = await MessageModel.model.createNew(newMessageItem);
        // update contact
        await ContactModel.updateWhenAddNewMessage(sender.id,getUserReceiver._id);
        resolve(newMessage);

      }
    } catch (error) {
      reject(error);
    }
  });
};

// Tạo tin nhắn theo dạng file
let addNewAttachment = (sender,receiverId,messageVal,isChatGroup) =>{
  return new Promise( async (resolve, reject) =>{
    try {
      if(isChatGroup) {
        let getChatGroupReceiver = await ChatGroupModel.getChatGroupById(receiverId);
        if(!getChatGroupReceiver){
          return reject(transError.conversation_not_found);
        }
        let receiver = {
          id: getChatGroupReceiver._id,
          name: getChatGroupReceiver.name,
          avatar: app.general_avatar_group_chat
        };
        let attachmentBuffer = await fsExtra.readFile(messageVal.path);
        let attachmentContentType = messageVal.mimetype;
        let attachmentName = messageVal.originalname;

        let newMessageItem = {
          senderId: sender.id,
          receiverId: receiver.id,
          conversationType: MessageModel.conversationType.GROUP,
          messageType: MessageModel.messageType.FILE,
          sender : sender,
          receiver : receiver,
          file : {data : attachmentBuffer , contentType : attachmentContentType, fileName : attachmentName},
          createdAt : Date.now()
        };
        // create new message
        let newMessage = await MessageModel.model.createNew(newMessageItem);
        // update group chat
        await ChatGroupModel.updateWhenAddNewMessage(getChatGroupReceiver._id,getChatGroupReceiver.messageAMount + 1);
        resolve(newMessage);
      }else{
        let getUserReceiver = await UserModel.getNormalUserDataById(receiverId);
        
        if(!getUserReceiver){
          return reject(transError.conversation_not_found);
        }

        let receiver = {
          id: getUserReceiver._id,
          name: getUserReceiver.username,
          avatar: getUserReceiver.avatar
        };

        let attachmentBuffer = await fsExtra.readFile(messageVal.path);
        let attachmentContentType = messageVal.mimetype;
        let attachmentName = messageVal.originalname;

        let newMessageItem = {
          senderId: sender.id,
          receiverId: receiver.id,
          conversationType: MessageModel.conversationType.PERSONAL,
          messageType: MessageModel.messageType.FILE,
          sender : sender,
          receiver : receiver,
          file : {data : attachmentBuffer , contentType : attachmentContentType, fileName : attachmentName},
          createdAt : Date.now()
        };
        // create new message
        let newMessage = await MessageModel.model.createNew(newMessageItem);
        // update contact
        await ContactModel.updateWhenAddNewMessage(sender.id,getUserReceiver._id);
        resolve(newMessage);

      }
    } catch (error) {
      reject(error);
    }
  });
};
// Lấy thêm danh sách  tin nhắn chát theo currentUserId
let readMoreAllChat = (currentUserId,skipPersonal,skipGroup) => {
  return new Promise( async(resolve, reject) =>{
    try {
      let contacts = await ContactModel.readMoreContacts(currentUserId,skipPersonal,LIMIT_CONVERSATIONS_TAKEN);

      let userConversationsPromise = contacts.map( async (contact) =>{
        if(contact.contactId == currentUserId){
          let getUserContact = await UserModel.getNormalUserDataById(contact.userId);
          getUserContact.updatedAt = contact.updatedAt;
          return getUserContact;
        } else {
          let getUserContact = await UserModel.getNormalUserDataById(contact.contactId);
          getUserContact.updatedAt = contact.updatedAt;
          return getUserContact;
        }        
      });
      // convert data 
      let userConversationsArr = await Promise.all(userConversationsPromise);
      let groupConversationsArr = await ChatGroupModel.readMoreChatGroups(currentUserId,skipGroup,LIMIT_CONVERSATIONS_TAKEN );

      let userConversations = [];
      let groupConversations = [];

      userConversationsArr.forEach(data => {
        userConversations.push(data._doc);
      })

      groupConversationsArr.forEach(data => {
        groupConversations.push(data._doc);
      })
      // end convert data
     
      let allConversations = userConversations.concat(groupConversations);

      allConversations = _.sortBy(allConversations, (item) =>{ 
        return -item.updatedAt;
      });

      let allConversationWithMessagePromise = allConversations.map( async (conversation) =>{
        //conversation = conversation.toObject();
        if(conversation.members){
          let getMessages = await MessageModel.model.getMessagesInGroup(conversation._id,LIMIT_MESSAGES_TAKEN);
          conversation.messages = _.reverse(getMessages);
        }
        else{
          let getMessages = await MessageModel.model.getMessagesInPersonal(currentUserId,conversation._id,LIMIT_MESSAGES_TAKEN);
          conversation.messages = _.reverse(getMessages);  
        }
        
        return conversation;
      });

      let allConversationWithMessage = await Promise.all(allConversationWithMessagePromise);

      allConversationWithMessage = _.sortBy(allConversationWithMessage, (item) =>{ 
        return -item.updatedAt
      });

      resolve(allConversationWithMessage);
    } catch (error) {
      reject(error);
    }
  });
};

// Lấy danh sách tin nhắn
let readMore = (currentUserId,skipMessage,targetId,chatInGroup) => {
  return new Promise( async(resolve, reject) =>{
    try {
      if(chatInGroup){
        let getMessages = await MessageModel.model.readMoreMessagesInGroup(targetId,skipMessage,LIMIT_MESSAGES_TAKEN);
        getMessages = _.reverse(getMessages);

        return resolve(getMessages);
      }
      
        let getMessages = await MessageModel.model.readMoreMessagesInPersonal(currentUserId,targetId,skipMessage,LIMIT_MESSAGES_TAKEN);
        getMessages = _.reverse(getMessages);  

        return resolve(getMessages);
      
    } catch (error) {
      reject(error);
    }
  });
};

module.exports = {
  getAllConversationItems : getAllConversationItems,
  addNewTextEmoij : addNewTextEmoij,
  addNewImage : addNewImage,
  addNewAttachment: addNewAttachment,
  readMoreAllChat: readMoreAllChat,
  readMore : readMore
}


