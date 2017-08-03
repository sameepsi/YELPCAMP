var express = require("express");
var router = express.Router({mergeParams:true});

var {Comment} = require("../db/models/Comment");
var {camp} = require("../db/models/campModel");
var middleware = require("../middleware")


var isLoggedIn = (req, res, next)=>{
  if(req.isAuthenticated()){
    return next();
  }
  res.redirect("/login");
}
router.get("/new",middleware.isLoggedIn, async(req, res)=>{
  var campground = await camp.findById(req.params.id);

  console.log(req.params.id);
  res.render("comments/new",{campground});
});


router.post("/",middleware.isLoggedIn, async(req, res)=>{
  try{
    var campground = await camp.findById(req.params.id);
    var comment = new Comment({
      text:req.body.comment,
      "author.id":req.user._id,
      "author.username":req.user.username
    });
    var newComment = await comment.save();
    campground.comment.push(newComment);
    await campground.save();
    req.flash("success","Comment Added Successfully");
    res.redirect("/campgrounds/"+campground._id);
  }catch(e){
    req.flash("error","Failed To Delete Comment");
    res.redirect("back")
  }
});

router.get("/:commentId/edit",middleware.isLoggedIn, async(req, res)=>{
  try {

    var comment = await Comment.findById(req.params.commentId);
    if(comment.author.id.equals(req.user._id)){
      var campground = await camp.findById(req.params.id);
      return  res.render("comments/edit",{comment, campground});
    }
    req.flash("error","Unauthorized Access");
    res.redirect("back");
  } catch (e) {
    res.redirect("back");
  }
});

router.put("/:commentId",middleware.isLoggedIn, async(req, res)=>{
  try {
    var comment = await Comment.findById(req.params.commentId);
    if(comment.author.id.equals(req.user._id)){
      await Comment.findByIdAndUpdate(req.params.commentId,{
        $set:{
          text:req.body.comment
        }
      });
      return  res.redirect("/campgrounds/"+req.params.id)
    }
    req.flash("error","Unauthorized Access");
    res.redirect("back")
  } catch (e) {
    res.redirect("back");
  }
});

router.delete("/:commentId", middleware.isLoggedIn, async(req, res)=>{
  try{
    var comment = await Comment.findById(req.params.commentId);
    if(comment.author.id.equals(req.user._id)){
      await Comment.findByIdAndRemove(req.params.commentId);
      return  res.redirect("/campgrounds/"+req.params.id)
    }
    req.flash("error","Unauthorized Access");
    res.redirect("back");
  }catch(e){
    res.redirect("back");
  }
});
module.exports = router;
