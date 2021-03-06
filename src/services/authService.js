import Usermodel from '../models/userModel';
import bcrypt from 'bcrypt';
import { v4 as uuidv4 } from 'uuid';
import {transError, transSuccess, transmail} from '../../lang/vi';
import sendMail from '../config/mailler';

//Muối dùng để mã hóa mật khẩu
let saultRounds = 7;

// Hàm sử lý đăng ký tài khoản và gửi mail
let register = (email,gender,password, protocol, host) =>{

  return new Promise( async (resolve, reject) =>{
  let userByEmail = await Usermodel.findByEmail(email);
  if(userByEmail) {
    if(userByEmail.removedAt != null) {
      return reject(transError.account_removed);
    }
    if(!userByEmail.local.isActive) {
      return reject(transError.account_not_active);
    }
    return reject(transError.account_in_use);
  }

  let salt = bcrypt.genSaltSync(saultRounds);

  let userItem = {
    username: email.split('@')[0],
    gemder : gender,
    local : {
      email : email,
      password : bcrypt.hashSync(password,salt), 
      verifytoken : uuid()
    }
  };
  // Sử lý gửi mail
  let user = await Usermodel.createNew(userItem);
  let linkVeryfy = protocol + '://' + host + '/verify/' + user.local.verifytoken;

  sendMail(email, transmail.subject, transmail.template(linkVeryfy))
    .then(success =>{
      resolve(transSuccess.userCreated(user.local.email)); 
    })
    .catch( async(error) =>{
      await Usermodel.removeById(user._id);
      console.log(error);
      reject(transmail.send_fail);
    });
  });
};

// hàm active tài khản
let verifyAccount = (token) =>{
  return new Promise( async (resolve, reject) =>{
    await Usermodel.verify(token);
    resolve(transSuccess.account_actived);
  });
}

module.exports = {
  register : register,
  verifyAccount : verifyAccount
};