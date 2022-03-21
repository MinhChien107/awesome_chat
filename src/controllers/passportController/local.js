import passport from 'passport';
import passportLocal from 'passport-local';
import UserModel from '../../models/userModel';
import ChatGroupModel from '../../models/chatGroupModel';
import {transError,transSuccess} from '../../../lang/vi';

let LocalStrategy = passportLocal.Strategy;

let initPassportLocal = () => {
  passport.use(new LocalStrategy({
    usernameField: 'email',
    passwordField: 'password',
    passReqToCallback: true
  },async (req, email, password, done) => {
    try {
      //Lấy user theo email
      let user = await UserModel.findByEmail(email);
      //Không tồn tại gửi thông báo 
      if(!user) {
        return done(null,false,req.flash('errors', transError.loginFalse));
      }
      //Kiểm tra đã kích hoạt tài khoản chưa
      if(!user.local.isActive){
        return done(null,false,req.flash('errors', transError.account_not_active));
      }
      //Kiểm tra pass đã đúng chưa
      let checkPassword = await user.comparePassword(password);
      //Sai trả về lỗi
      if(!checkPassword){
        return done(null,false,req.flash('errors', transError.loginFalse));
      }
      //pass
      return done(null,user, req.flash('success',transSuccess.loginSuccess(user.username)))
    } catch (error) {
      console.log(error);
      return done(null,false,req.flash('errors', transError.server_error));
    }
  }));

  // Lưu user và và seesion
  passport.serializeUser((user,done) =>{
    done(null,user._id);
  });

  //lấy user theo id mỗi lần req
  passport.deserializeUser( async(id, done) =>{
    try {
      let user = await UserModel.findUserByIdForSessionToUse(id);
      let getChatGroupIds = await ChatGroupModel.getChatGroupIdsByUser(user._id);

      //let user = user.toObject();
      user.chatGroupIds = getChatGroupIds;
      return done(null,user);
    } catch (error) {
      return done(error,null);
    }
  });
}

module.exports = initPassportLocal;