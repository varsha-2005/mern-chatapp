const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  name: { type:String, required: true },
  email: { type: String, unique: true },
  password: { type:String, required: true },
  status:{ type:String,default: "Hey there! I'm using this app" },
},{
    timestamps:true
});

module.exports = mongoose.model("User", UserSchema);
