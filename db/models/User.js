var mongoose = require("mongoose");
var passportLocalMongoose = require("passport-local-mongoose");

var UserSchema = mongoose.Schema({
  username:String,
  password:String
});

UserSchema.plugin(passportLocalMongoose);

var User = mongoose.model("user", UserSchema);
module.exports = {
  User
};
