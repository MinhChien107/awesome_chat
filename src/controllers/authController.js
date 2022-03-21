import {validationResult} from 'express-validator';
import {auth} from '../services/index';
import {transSuccess} from '../../lang/vi';

//Hàm render màn đăng nhập
let loginRegister = function(req,res){
  return res.render('auth/master',{
    errors: req.flash('errors'),
    success: req.flash('success')
  });
};
//đăng ký tài khoản
let postRegister = async (req,res) =>{
  let errorsArr = [];
  let successArr = [];
  if(!validationResult(req).isEmpty()){
   let validatorError = Object.values(validationResult(req).mapped());

    validatorError.forEach(validatorError => {
      errorsArr.push(validatorError.msg);
    });
    
    req.flash('errors', errorsArr);
    return res.redirect('/login-register');
  }
  try {
    let createUserSuccess =  await auth.register(req.body.email, req.body.gender ,req.body.password, req.protocol, req.get('host'));
    successArr.push(createUserSuccess);
    req.flash('success',successArr);
    return res.redirect('/login-register');
  } catch (error) {
    errorsArr.push(error);
    req.flash('errors', errorsArr);
    return res.redirect('/login-register');
  }
};

// Active tài khoản sau khi nhận được link từ email
let verifyAccount = async (req,res) => {
  let errorsArr = [];
  let successArr = [];

  try {
    let verifySuccess = await auth.verifyAccount(req.params.token);
    successArr.push(verifySuccess);
    req.flash('success',successArr);
    return res.redirect('/login-register');
  } catch (error) {
    errorsArr.push(error);
    req.flash('errors', errorsArr);
    return res.redirect('/login-register');
  }
};

// Hàm logout tài khản
let getLogout = (req,res) =>{
  req.logout();
  req.flash('success',transSuccess.logout_success);
  return res.redirect('/login-register');
}

// Hàm check xem đã login chưa
let checkLoggedIn = (req,res,next) =>{
  if(!req.isAuthenticated()){
    return res.redirect('/login-register');
  }
  next();
};

// check xem đã logout chưa
let checkLoggedOut = (req,res,next) =>{
  if(req.isAuthenticated()){
    return res.redirect('/');
  }
  next();
};


module.exports = {
  loginRegister : loginRegister,
  postRegister : postRegister,
  verifyAccount : verifyAccount,
  getLogout : getLogout,
  checkLoggedIn : checkLoggedIn,
  checkLoggedOut : checkLoggedOut
}