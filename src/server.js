import express from "express";
import ConnectDB from "./config/connectDB";
import configViewEngine from "./config/viewEngine"
import initRouters from "./routers/web"
import bodyParser from "body-parser";
import connectFlash from "connect-flash";
import configSession from "./config/session";

const app = express();

//Connect to mongoDB 
ConnectDB();

//configSession
configSession(app);

//config view engine
configViewEngine(app);

// Enable post data for request
app.use(bodyParser.urlencoded({extended: true}));

//Enable flash message
app.use(connectFlash());

// Init all routers
initRouters(app)

app.listen(process.env.APP_PORT, process.env.APP_HOST, ()=> {
  console.log(`Running at ${process.env.APP_HOST}:${process.env.APP_PORT}`)
})

