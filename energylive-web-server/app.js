var express = require('express');
var app = express();


var UserController = require('./user/UserController');
app.use('/users/authenticate', UserController);

module.exports = app;