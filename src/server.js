import express from 'express';
import connectDB from './config/connectDB';
import conFigViewEngine from './config/viewEngine';
import initRoutes from './routes/web';
import bodyParser from 'body-parser';
import connectFlash from 'connect-flash'; 
import session from './config/session'
import passport from 'passport';
import http from 'http';
import socketio from 'socket.io';
import initSockets from './sockets/index';
import cookieParser from 'cookie-parser';
import configSocketIo from './config/socketio';
import events from 'events';
const app = express();
//Tăng giới hạn của socket
events.EventEmitter.defaultMaxListeners = 30;

let server = http.createServer(app);

let io = socketio(server);

//Connect to mongoDB 
connectDB();

// Config session
session.config(app);

//config view engine
conFigViewEngine(app);

// Enable post data for request
app.use(bodyParser.urlencoded({extended: true}));

//Enable flash message
app.use(connectFlash());

app.use(cookieParser());

//Cấu hình passport
app.use(passport.initialize());
app.use(passport.session());


// Init all routers
initRoutes(app)

// config for socket.io
configSocketIo(io,cookieParser,session.sessionStore );

initSockets(io);

server.listen(process.env.APP_port,process.env.APP_host,function(){
  console.log('khoi chay thanh cong');
}); 

