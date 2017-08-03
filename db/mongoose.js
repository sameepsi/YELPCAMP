var mongoose = require('mongoose');


var db = process.env.MONGODB_URI || "mongodb://localhost:27017/YelpCamp"
mongoose.connect(db);

module.exports={
  mongoose
};
