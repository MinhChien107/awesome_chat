import express from "express";
import ConnectDB from "./config/connectDB";
import configViewEngine from "./config/viewEngine"
const app = express();

//Connect to mongoDB 
ConnectDB();

//config view engine
configViewEngine(app)

app.get("/", async(req, res)=>{
  res.render("main/master")
});

app.get("/login-register", async(req, res)=>{
  res.render("auth/loginRegister")
});


app.listen(process.env.APP_PORT, process.env.APP_HOST, ()=> {
  console.log(`Running at ${process.env.APP_HOST}:${process.env.APP_PORT}`)
})

