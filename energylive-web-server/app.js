var express = require('express');
const bodyParser = require("body-parser");
var app = express();

app.use(bodyParser.urlencoded({
    extended: false
}));
app.use(bodyParser.json());
var UserController = require('./user/UserController');
//var EnergyController = require('./energy/EnergyController');
app.use('/users', UserController);
//app.use('/energy/updateEnergy', EnergyController);

module.exports = app;