import session from "express-session";
import MongoStore from 'connect-mongo'

/**
 * This variable is where save session, In this case is mongodb
 */
let sessionStore = MongoStore.create({
  mongoUrl: `${process.env.DB_CONNECTION}://${process.env.DB_HOST}:${process.env.DB_PORT}/${process.env.DB_NAME}`,
  autoReconnect: true,
  // autoRemove: 'native' // Default
})

/**
 * config session for app
 * @param app from exacly express module
 */
let config = (app) =>{
app.use(session({
  key: process.env.SESSION_KEY,
  secret: process.env.SESSION_SECRET,
  store: sessionStore,
  resave: true,
  saveUninitialized : false,
  cookie: {
    maxAge: 1000*60*60*24
  }
}));
};

module.exports = {
  config: config,
  sessionStore : sessionStore
};