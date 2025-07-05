const mongoose = require("mongoose");

const UsertSchema = new mongoose.Schema({
 Uname:{
    type:String,
   
 },
 email:{
    type:String,
    
 },
 address:{
    type:String,
  
 },
  mobile:{
    type:String,
  
 },
 password:{
    type:String,
  
 },
  role:{
    type:String,
     default: "user" ,
     
   
 },
createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("User", UsertSchema);
