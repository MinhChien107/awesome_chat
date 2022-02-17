import express from "express";
import {home, auth} from "./../controllers"
import {authValid} from "./../validation/index"

let router = express.Router();

/**
 * Innit all routers
 * @param app from exacly express module
 */

let initRouters = (app) => {
  router.get("/", home.getHome);

  router.get("/login-register", auth.getLoginRegister);

  router.post("/register", authValid.register, auth.postRegister)

  router.get("/verify/:token", auth.verifyAccout);

  return app.use("/", router)
}

module.exports = initRouters
