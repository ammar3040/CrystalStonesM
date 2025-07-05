const express = require("express");
const database=require("./config/db")
const Routeroutes = require("./routes/index"); 
const cookieParser = require('cookie-parser');
const session = require('express-session');
const passport = require('passport');
require('./config/passportConfig')(passport); 
require('./config/passport-google')(passport);

const cors = require("cors");
const jwt = require('jsonwebtoken');
const app = express();
const path = require("path");
const exp = require("constants");
app.use(session({
  secret: `${process.env.SECRET_KEY}`,
  resave: false,
  saveUninitialized: false
}));
require('dotenv').config({ path: `${__dirname}/.env` }); // Explicit path
const port = process.env.PORT;


app.use(passport.initialize());
app.use(passport.session());

app.use(cookieParser());
app.set("view engine","ejs")
app.set("views",path.join(__dirname,"views"))

app.use(express.urlencoded({ extended: true }))

app.use(express.json()); 
require("./config/passportConfig")(passport); // Ensure this is after passport initialization


const allowedOrigins = process.env.ALLOWED_ORIGINS.split(",");

app.use(cors({
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps, curl, Postman)
    if (!origin) return callback(null, true);
    if (allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true
}));
app.use("/", Routeroutes);
app.use (express.static(path.join(__dirname,"assets")))
app.use ("/uploads",express.static(path.join(__dirname,"uploads")))

app.listen(port, () => {
  console.log("Server is running on port " + port);
}); 