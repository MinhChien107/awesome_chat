import express from "express";
import {home, auth} from "./../controllers"

let router = express.Router();

/**
 * Innit all routers
 * @param app from exacly express module
 */

let initRouters = (app) => {
  router.get("/", home.getHome);

  router.get("/login-register", auth.getLoginRegister);

  return app.use("/", router)
}

module.exports = initRouters