import express from "express";
import ConnectDB from "./config/connectDB";
import configViewEngine from "./config/viewEngine"
import initRouters from "./routers/web"

const app = express();

//Connect to mongoDB 
ConnectDB();

//config view engine
configViewEngine(app)

// Init all routers
initRouters(app)

app.listen(process.env.APP_PORT, process.env.APP_HOST, ()=> {
  console.log(`Running at ${process.env.APP_HOST}:${process.env.APP_PORT}`)
})

