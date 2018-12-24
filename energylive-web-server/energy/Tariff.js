var mongoose = require('mongoose');  
var db = require('../db');
var TariffSchema = new mongoose.Schema({  
  createdBy: String,
  address: String,
  status: String
});
mongoose.model('Tariff', TariffSchema);

module.exports = mongoose.model('Tariff');