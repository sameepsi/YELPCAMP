var mongoose = require("mongoose");
var {camp} = require("./db/models/campModel");
var {Comment} = require("./db/models/Comment");


var data =[
  {
    name:"Cloud Rest",
    image:"http://www.wildnatureimages.com/images%203/060731-346..jpg",
    description:"Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum."
  },
  {
    name:"Desert Mesa",
    image:"http://res.cloudinary.com/simpleview/image/upload/v1460743623/clients/roanoke/Roanoke_Camping_0834e03c-8e39-4cb2-9365-47120180f959.jpg",
    description:"Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum."
  },
  {
    name:"Canyon Floor",
    image:"http://holidaysgenius.com/media/uploads/2016/03/Adventure-camping-in-himachal.jpg",
    description:"Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum."
  }
]
var seedDb = async()=>{
  try{
    await camp.remove({});

    data.forEach(async(campGround)=>{
      var newCamp = new camp({
        name:campGround.name,
        image:campGround.image,
        description:campGround.description,
        comments:[]
      });
      var savedCamp = await newCamp.save();
      var comment = new Comment({
        text:"Test comment",
        author:"Sameep Singhania"
      });
      var savedComment = await comment.save();
      savedCamp.comment.push(savedComment);
      await savedCamp.save();
      //create comment
    })
  }catch(e){
    console.log(e);
  }

}

module.exports = {
  seedDb
};
