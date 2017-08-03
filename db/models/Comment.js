var mongoose=require('mongoose');

var commentModel = mongoose.Schema({
text:{
  type:String,
  required:true
},
author:{
  id:{
    type:mongoose.Schema.Types.ObjectId,
    ref:"user"
  },
  username:String
},
createdAt : {
  type:Date,
  default:Date.now
}
});

var Comment = mongoose.model("comment", commentModel);

module.exports = {
  Comment
};
