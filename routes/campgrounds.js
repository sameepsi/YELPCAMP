var express = require("express");
var router = express.Router();
var geocoder = require("geocoder");

var middleware = require("../middleware");
var {camp} = require("../db/models/campModel");

router.get("/", async(req, res)=>{
  try{
    var campgrounds = await camp.find();
    res.render("campgrounds/campgrounds",{campgrounds, page:"campgrounds"});
  }catch(e){
    res.redirect("back");
  }
});

router.get("/new",middleware.isLoggedIn, async(req, res)=>{
  res.render("campgrounds/newCampground");
});

router.post("/",middleware.isLoggedIn, async(req, res)=>{
  try{
    geocoder.geocode(req.body.location, async function (err, data) {
      var lat = data.results[0].geometry.location.lat;
      var lng = data.results[0].geometry.location.lng;
      var location = data.results[0].formatted_address;
      var newcamp = new camp(
        {
          name:req.body.name,
          image:req.body.image,
          description:req.body.description,
          price:req.body.price,
          location,
          lat,
          long:lng,
          "author.id":req.user._id,
          "author.username":req.user.username
        }
      );
      await newcamp.save();
      req.flash("success","Campground Created successfully");
      res.redirect("/campgrounds");
    });
  }catch(e){
    req.flash("error","Failed To Create Campground");
    res.redirect("back");
  }
});

router.get("/:id", async(req, res)=>{
  try{
    var campGround  = await camp.findById(req.params.id).populate("comment").exec();
    res.render("campgrounds/show",{campground:campGround});
  }catch(e){
    res.redirect("back");
  }
});

router.get("/:id/edit",middleware.isLoggedIn, async(req, res)=>{
  try{
    var campGround  = await camp.findById(req.params.id).populate("comment").exec();
    if(campGround.author.id.equals(req.user._id)){
      return res.render("campgrounds/edit",{campground:campGround});
    }
    res.redirect("back")
  }catch(e){
    res.redirect("back")
  }
});

router.put("/:id",middleware.isLoggedIn, async(req, res)=>{
  try {
    var campGround = await camp.findById(req.params.id);
    if(campGround.author.id.equals(req.user._id)){
      geocoder.geocode(req.body.location, async function (err, data) {
        var lat = data.results[0].geometry.location.lat;
        var lng = data.results[0].geometry.location.lng;
        var location = data.results[0].formatted_address;
      await camp.findByIdAndUpdate(req.params.id,{
        $set:{
          name:req.body.name,
          image:req.body.image,
          description:req.body.description,
          price:req.body.price,
          location,
          lat,
          long:lng
        }
      });
      req.flash("success","Campground Updated");
      return res.redirect("/campgrounds/"+req.params.id);
    });

    }
    else{
      req.flash("error","Failed To Update Campground");
      res.redirect("back")
    }
  } catch (e) {
    req.flash("error","Failed To Update Campground");
    res.redirect("back")
  }
});

router.delete("/:id",middleware.isLoggedIn, async(req, res)=>{
  try {
    var campGround = await camp.findById(req.params.id);
    if(campGround.author.id.equals(req.user._id)){

      await camp.findByIdAndRemove(req.params.id);
      req.flash("success","Campground Deleted Successfully");
      return  res.redirect("/campgrounds");
    }
    req.flash("error","Failed To Delete Campground");
    res.redirect("back")
  } catch (e) {
    req.flash("error","Failed To Delete Campground");
    res.redirect("back")
  }
});

module.exports = router;
