const mongoose = require("mongoose");

const UsertSchema = new mongoose.Schema({
 Uname:{
    type:String,
    require:true
 },
 email:{
    type:String,
    require:true
 },
 address:{
    type:String,
    require:true
 },
  mobile:{
    type:String,
    require:true
 },
 password:{
    type:String,
    require:true
 },
  role:{
    type:String,
     default: "user" ,
    require:true
 },
createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("User", UsertSchema);
