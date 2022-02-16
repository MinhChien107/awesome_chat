import express from "express";
import { async } from "regenerator-runtime";
import ConnectDB from "./config/connectDB";
import ContactModel from './models/contact.model'

const app = express();

//Connect to mongoDB 
ConnectDB();

app.get("/test-database", async(req, res)=>{
  try {
    let item = {
      userId: "123151",
      contactId: "kfasdf"
    }
    let contact = await ContactModel.createNew(item);
    res.send(contact)
  } catch (error) {
    console.log(error)
  }
});

app.listen(process.env.APP_PORT, process.env.APP_HOST, ()=> {
  console.log(`Running at ${process.env.APP_HOST}:${process.env.APP_PORT}`)
})

