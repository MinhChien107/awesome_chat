import UserModel from './../models/userModel';
import bcrypt from "bcrypt";
import { v4 as uuidv4 } from 'uuid';
import { transErrors, transSuccess, transMail } from "./../../lang/vi";
import sendMail from "./../config/mailer";

const saltRounds = 7;

const register = (email, gender, password, protocol, host) => {
  return new Promise(async (resolve, reject) => {
    let userByEmail = await UserModel.findByEmail(email);
    if (userByEmail) {
      if (userByEmail.deletedAt !== null) {
        return reject(transErrors.account_removed);
      }
      if (!userByEmail.local.isActive) {
        return reject(transErrors.account_not_active);
      }
      return reject(transErrors.account_in_use);
    }

    let salt = bcrypt.genSaltSync(saltRounds);

    let userItem = {
      username: email.split("@")[0],
      gender: gender,
      local: {
        email,
        password: bcrypt.hashSync(password, salt),
        verifyToken: uuidv4()
      }
    };
    let user = await UserModel.createNew(userItem);
    // send email
    let linkVerify = `${protocol}://${host}/verify/${user.local.verifyToken}`;
    // protocel = http || https, host = localhost:3000

    sendMail(email, transMail.subject, transMail.template(linkVerify))
      .then(success => {
        resolve(transSuccess.userCreated(user.local.email));
      })
      .catch(async error => {
        // remove user
        await UserModel.removeById(user._id);
        console.log(error);
        return reject(transMail.send_fail);
      });
  });
};

module.exports = {
  register
}