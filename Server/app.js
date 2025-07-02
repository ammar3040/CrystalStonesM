const express = require("express");
const database=require("./config/db")
const Routeroutes = require("./routes/index"); 
const cookieParser = require('cookie-parser');

const cors = require("cors");
const jwt = require('jsonwebtoken');
const app = express();
const path = require("path");
const exp = require("constants");




require('dotenv').config({ path: `${__dirname}/.env` }); // Explicit path
const port = process.env.PORT;



app.use(cookieParser());
app.set("view engine","ejs")
app.set("views",path.join(__dirname,"views"))

app.use(express.urlencoded({ extended: true }))

app.use(express.json()); 


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