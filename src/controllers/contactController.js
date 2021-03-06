import {contact} from '../services/index';
import {validationResult} from 'express-validator/check';

let finndUsersContact = async (req,res) => {
  let errorsArr = [];
  
  if(!validationResult(req).isEmpty()){
   let validatorError = Object.values(validationResult(req).mapped());

    validatorError.forEach(validatorError => {
      errorsArr.push(validatorError.msg);
    });
    
    return res.status(500).send(errorsArr);
  }

  try {
    let currentUserId = req.user._id;
    let keyWord = req.params.keyWord;

    let users = await contact.finndUsersContact(currentUserId,keyWord); 
    return res.render("main/contact/sessions/_findUsersContact",{users});
  } catch (error) {
    return res.status(500).send(error);
  }
};

let addNew = async (req,res) => {
  
  try {
    let currentUserId = req.user._id;
    let contactId = req.body.uid;

    let newContact = await contact.addNew(currentUserId, contactId);
    res.status(200).send({success: !!newContact});
  } catch (error) {
    return res.status(500).send(error);
  }
};

let removeContact = async (req, res)=>{
  try {
    let currentUserId = req.user._id;
    let contactId = req.body.uid;

    let removeContact = await contact.removeContact(currentUserId, contactId);
    res.status(200).send({success: !!removeContact});
  } catch (error) {
    return res.status(500).send(error);
  }
};

let removeRequestContactSent = async (req,res) => {
  
  try {
    let currentUserId = req.user._id;
    let contactId = req.body.uid;

    let removeReq = await contact.removeRequestContactSent(currentUserId, contactId);
    res.status(200).send({success: !!removeReq});
  } catch (error) {
    return res.status(500).send(error);
  }
};

let removeRequestContactReceived = async (req,res) => {
  
  try {
    let currentUserId = req.user._id;
    let contactId = req.body.uid;

    let removeReq = await contact.removeRequestContactReceived(currentUserId, contactId);
    res.status(200).send({success: !!removeReq});
  } catch (error) {
    return res.status(500).send(error);
  }
};

let approveRequestContactReceived = async (req,res) => {
  
  try {
    let currentUserId = req.user._id;
    let contactId = req.body.uid;

    let approveReq = await contact.approveRequestContactReceived(currentUserId, contactId);
    res.status(200).send({success: !!approveReq});
  } catch (error) {
    return res.status(500).send(error);
  }
};

let readMoreContacts = async (req, res) => {
  try {
    let skipNumberContacts = +(req.params.skipNumber);
    let newContactUsers = await contact.readMoreContacts(req.user._id, skipNumberContacts);
    
    return res.status(200).send(newContactUsers);
  } catch (error) {
    return res.status(500).send(error);
  }
}

let readMoreContactsSent = async (req, res) => {
  try {
    let skipNumberContacts = +(req.params.skipNumber);
    let newContactUsers = await contact.readMoreContactsSent(req.user._id, skipNumberContacts);
    
    return res.status(200).send(newContactUsers);
  } catch (error) {
    return res.status(500).send(error);
  }
}

let readMoreContactsReceived = async (req, res) => {
  try {
    let skipNumberContacts = +(req.params.skipNumber);
    let newContactUsers = await contact.readMoreContactsReceived(req.user._id, skipNumberContacts);
    
    return res.status(200).send(newContactUsers);
  } catch (error) {
    return res.status(500).send(error);
  }
}

let searchFriends = async (req,res) => {
  let errorsArr = [];
  
  if(!validationResult(req).isEmpty()){
   let validatorError = Object.values(validationResult(req).mapped());

    validatorError.forEach(validatorError => {
      errorsArr.push(validatorError.msg);
    });
    
    return res.status(500).send(errorsArr);
  }

  try {
    let currentUserId = req.user._id;
    let keyWord = req.params.keyword;

    let users = await contact.searchFriends(currentUserId,keyWord); 
    return res.render("main/groupChat/sessions/_searchFriends",{users});
  } catch (error) {
    return res.status(500).send(error);
  }
};

module.exports = {
  finndUsersContact : finndUsersContact,
  addNew : addNew,
  removeContact : removeContact,
  removeRequestContactSent : removeRequestContactSent,
  removeRequestContactReceived: removeRequestContactReceived,
  readMoreContacts : readMoreContacts,
  readMoreContactsSent : readMoreContactsSent,
  readMoreContactsReceived : readMoreContactsReceived,
  approveRequestContactReceived : approveRequestContactReceived,
  searchFriends : searchFriends
}