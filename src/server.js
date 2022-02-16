import express from "express";
const app = express();

const hostname = "localhost";
const port = 8017;

app.get("/helloword", (req, res)=>{
  res.send("<h1>Hello word!!</h1>")
});

app.listen(port, hostname, ()=> {
  console.log(`Running at ${hostname}:${port}`)
})

