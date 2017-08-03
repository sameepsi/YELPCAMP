var express = require("express");
var app = express();
var bodyParser = require("body-parser");
var {ObjectID} = require('mongodb');
var passport = require("passport");
var LocalStrategy = require("passport-local");
var expressSession = require("express-session");
var mongoose = require('mongoose');
var methodOverride = require("method-override");
var flash = require("connect-flash");

var{seedDb} = require("./seeds");
var {User} = require("./db/models/User");
var commentRoutes = require("./routes/comments");
var campgroundRoutes = require("./routes/campgrounds");
var authRoutes = require("./routes/index");

require("./db/mongoose");

app.use(expressSession({
  secret:"I am the best",//generate secret randomly
  resave:false,
  saveUninitialized:false
}));

app.use(flash());
app.locals.moment = require('moment');
//setting passport
app.use(passport.initialize());
app.use(passport.session());

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());
passport.use(new LocalStrategy(User.authenticate()));

app.use(bodyParser.urlencoded({
  extended:true
}));
app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));
app.use(function(req, res, next){
  res.locals.user=req.user;
  res.locals.error=req.flash("error");
  res.locals.success=req.flash("success");
  next();
})
app.use(methodOverride("_method"));

app.use("/campgrounds/:id/comment",commentRoutes);
app.use(authRoutes);
app.use("/campgrounds",campgroundRoutes);
//seeding database
//seedDb();
var port=process.env.PORT||3000

app.listen(port, (err) => {
  console.log(`Server started on port ${port}!!);
})
