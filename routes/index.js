var express = require("express");
var router = express.Router();
var passport = require("passport");

var {User} = require("../db/models/User");

router.get("/", async(req, res)=>{
  res.render("campgrounds/home");
});

//AUTH ROUTES

router.get("/register", (req, res)=>{
  res.render("register",{page:"register"});
});

router.post("/register",async(req, res)=>{
  try{
    var user = await User.register(new User({
      username:req.body.username
    }), req.body.password, (err, user)=>{
      if(err){
        req.flash("error",err.message);

        return res.redirect("back")
      }
      passport.authenticate("local")(req,res, ()=>{
        req.flash("success","User Registered successfully");
        res.redirect("/campgrounds");
      });
    });


  }catch(e){
    console.log(e);
    res.render("register");
  }
});

router.get("/login", (req, res)=>{
  res.render("login",{page:"login"});
})

router.post("/login", passport.authenticate("local",{
  successRedirect :"/campgrounds",
  failureRedirect:"/login"
}), (req, res)=>{

});

router.get("/logout", (req, res) => {
  req.logout();
  req.flash("success","Logged Out successfully");
  res.redirect("/")
});
module.exports = router;
