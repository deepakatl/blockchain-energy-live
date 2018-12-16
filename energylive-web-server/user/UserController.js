const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');

router.use(bodyParser.urlencoded({ extended: false }));
router.use(bodyParser.json());
const User = require('./User');
const PrivateKeyUtil = require('../crypto/privatekeyutil');

// CREATES A NEW USER
router.post('/register', function (req, res) {
    let privateKey = new PrivateKeyUtil().getRandomPK();
    console.log("PK =" + privateKey);
    User.create({
        firstName : req.body.firstName,
        lastName: req.body.lastName,
        email : req.body.email,
        mobile: req.body.mobile,
        password : req.body.password,
        privatekey : privateKey
    }, 
    function (err, user) {
        if (err) return res.status(500).send("There was a problem adding the information to the database.");
        res.status(200).send(user);
    });    
});

router.post('/login', function (req, res) {
    User.find({
        email : req.body.email,
        password : req.body.password
    }, 
    function (err, user) {
        if (err) return res.status(500).send("There was a problem adding the information to the database.");
        res.status(200).send(user);
    });    
});


// RETURNS ALL THE USERS IN THE DATABASE
router.get('/*', function (req, res) {
    // User.find({}, function (err, users) {
    //     if (err) return res.status(500).send("There was a problem finding the users.");
    //     res.status(200).send(users);
    // });
    console.log("Request reach here");
    res.status(200).send({resultget: 'success'});
});


module.exports = router;
