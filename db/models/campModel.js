var mongoose=require('mongoose');

var campModel = mongoose.Schema({
  name:{
    type:String,
    required:true
  },
  image:{
    type:String
  },
  description:{
    type:String
  },
  comment:[
    {
      type:mongoose.Schema.Types.ObjectId,
      ref:"comment"
    }
  ],
  author:{
    id:{
      type:mongoose.Schema.Types.ObjectId,
      ref:"user"
    },
    username:String
  },
  price:String,
  location:String,
  lat:Number,
  long:Number,
  createdAt : {
    type:Date,
    default:Date.now
  }
});

var camp = mongoose.model("camp", campModel);

module.exports = {
  camp
};
