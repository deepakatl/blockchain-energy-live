var mongoose = require('mongoose');  
var db = require('../db');
var UserSchema = new mongoose.Schema({  
  firstName: String,
  lastName: String,
  email: String,
  mobile: String,
  password: String,
  type: String,
  privatekey: String,
  status: String,
  meterid: String
});
mongoose.model('User', UserSchema);

module.exports = mongoose.model('User');