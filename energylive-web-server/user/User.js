var mongoose = require('mongoose');  
var db = require('../db');
var UserSchema = new mongoose.Schema({  
  firstName: String,
  lastName: String,
  email: String,
  mobile: String,
  password: String,
  privatekey: String
});
mongoose.model('User', UserSchema);

module.exports = mongoose.model('User');