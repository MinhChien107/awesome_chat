import {check} from "express-validator";
import {transValidation} from "./../../lang/vi";
let register = [
  check('email')
    .matches(/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/)
    .withMessage(transValidation.email_incorrect),
  check("gender", transValidation.gender_incorrect)
    .isIn(["male", "female"]),
  check("password", transValidation.password_incorrect)
    .isLength({min: 8})
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[$@$!%*?&])[A-Za-z\d$@$!%*?&]{8,}$/),
  check("password_confirmation", transValidation.password_confirmation_incorrect)
  .custom((value, {req}) =>{ 
    return value === req.body.password
  })
];

module.exports = {
  register
}