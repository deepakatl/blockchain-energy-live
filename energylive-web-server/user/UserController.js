const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');
const UserService = require('./user-service');
const userService = new UserService();

router.use(bodyParser.urlencoded({ extended: false }));
router.use(bodyParser.json());
const User = require('./User');
const PrivateKeyUtil = require('../crypto/privatekeyutil');

function toHexString(byteArray) {
    return Array.from(byteArray, function(byte) {
      return ('0' + (byte & 0xFF).toString(16)).slice(-2);
    }).join('')
  }

// CREATES A NEW USER
router.post('/register', function (req, res) {
    let privateKey = new PrivateKeyUtil().getRandomPK();
    let privateKeyBytes = toHexString(privateKey.asBytes());
    console.log("PK =" + privateKeyBytes);
    let newUser = {
        firstName : req.body.firstName,
        lastName: req.body.lastName,
        email : req.body.email,
        mobile: req.body.mobile,
        password : req.body.password,
        type: 'customer',
        status:'',
        meterid: '',
        privatekey : privateKeyBytes
    }
    User.create(newUser, 
    function (err, user) {
        if (err) return res.status(500).send("There was a problem adding the information to the database.");
        console.log("Going to create user in chain " + user);
        delete newUser.privatekey;
        userService.createUser(JSON.stringify(newUser), privateKey);

        // userService.createUser({
        //     firstName : 'ddd',
        //     lastName: 'ssss',
        //     email : 'eeeee',
        //     mobile: '99999',
        //     password : 'oooo',
        //     privatekey : privateKey.asBytes()
        // }, privateKey);
        res.status(200).send(user);
    });    
});

router.post('/login', function (req, res) {
    User.find({
        email : req.body.email,
        status: 'active',
        password : req.body.password
    }, 
    function (err, user) {
        if (err) return res.status(500).send("There was a problem adding the information to the database.");
        if(user[0] !== undefined && user[0] !== '' ){
            console.log(user);
            let privateKey = user[0].privatekey;
            console.log(typeof privateKey);
            //const hexPrivateKey = new Buffer(privateKey).toString('hex');
            const hexPrivateKey = privateKey.toString('hex');
            privateKey = PrivateKeyUtil.getPrivateKeyFromString(hexPrivateKey);
            delete user[0].privatekey;
            delete user[0]._id;
            delete user[0].__v;
            userService.authenticate(JSON.stringify(user[0]), privateKey);

        }
        res.status(200).send(user);
    });    
});

router.post('/getapprovalrequiredusers', function (req, res) {
    User.find({
       type: 'customer',
       status:{ $nin: ["active"] }
    }, 
    function (err, users) {
        if (err) return res.status(500).send("There was a problem adding the information to the database.");
        if(users !== '' || users !== undefined){
            console.log(users);
            
        }
        res.status(200).send(users);
    });    

});

router.post('/approve', function (req, res) {
    console.log("User " + JSON.stringify(req.body));
    let options = { multi: true };
    req.body.status = 'active';
    User.findByIdAndUpdate(
        req.body._id,
        req.body, {new: true},
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
