var express = require('express');
var app = express();


var UserController = require('./user/UserController');
var EnergyController = require('./energy/EnergyController');
app.use('/users/authenticate', UserController);
app.use('/energy/updateEnergy', EnergyController);

module.exports = app;