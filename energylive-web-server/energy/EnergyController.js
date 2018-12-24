var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');
var EnergyService = require('./energy-service');
const User = require('../user/User');
const PrivateKeyUtil = require('../crypto/privatekeyutil');
const Tariff = require('./Tariff');

router.use(bodyParser.urlencoded({ extended: true }));
router.use(bodyParser.json());

//Update produced solar energy
router.post('/update', function (req, res) {
    
    User.find({
        email : req.body.email
    }, 
    function (err, user) {
        if (err) return res.status(500).send("There was a problem adding the information to the database.");
        if(user !== '' || user !== undefined){
            console.log(user);
            let privateKey = user[0].privatekey;
            console.log(typeof privateKey);
            //const hexPrivateKey = new Buffer(privateKey).toString('hex');
            const hexPrivateKey = privateKey.toString('hex');
            privateKey = PrivateKeyUtil.getPrivateKeyFromString(hexPrivateKey);
            let energy = {
                email : req.body.email,
                energyunit: req.body.energyunit,
            }
            let tariffAddress;
            Tariff.find({
                status:'active'
            }, function(err, tariff){
                if(tariff){
                    tariffAddress = tariff[0].address;
                    console.log("Request reach here - update solar energy" + energy);
                    let energyService = new EnergyService();
                    energy.tariffAddress = tariffAddress;
                    energyService.generateEnergy(JSON.stringify(energy), privateKey, tariffAddress);
                    res.status(200).send("Success");
                }
            });
            

        }
        //res.status(200).send("Success");
    });
});

router.post('/getBalance', function (req, res) {
    console.log("User " + JSON.stringify(req.body));
    
    User.find({
        email : req.body.email,
        status: 'active'
    },
    function (err, user) {
        if (err) return res.status(500).send("There was a problem adding the information to the database.");
        let privateKey = user[0].privatekey;
        const hexPrivateKey = privateKey.toString('hex');
        privateKey = PrivateKeyUtil.getPrivateKeyFromString(hexPrivateKey);
        let energyService = new EnergyService();
        let result = energyService.getBalance(user, privateKey);
        result.then((response) => {
            console.log(response);
            res.status(200).send(response);
          })
        
    });    

});

router.post('/updatetariff', function (req, res) {
    
    User.find({
        email : req.body.email
    }, 
    function (err, user) {
        if (err) return res.status(500).send("There was a problem adding the information to the database.");
        if(user !== '' || user !== undefined){
            console.log(user);
            let privateKey = user[0].privatekey;
            console.log(typeof privateKey);
            //const hexPrivateKey = new Buffer(privateKey).toString('hex');
            const hexPrivateKey = privateKey.toString('hex');
            privateKey = PrivateKeyUtil.getPrivateKeyFromString(hexPrivateKey);
            let tariff = {
                peak : req.body.peak,
                offpeak: req.body.offpeak,
                normal: req.body.normal
            }
            console.log("Request reach here - update solar energy" + tariff);
            let energyService = new EnergyService();
            let tariffAddress = energyService.updateTariff(JSON.stringify(tariff), privateKey);
            Tariff.remove({},
                function(err, docs){
                    if(err) console.log("Error remove Tariff")
                });
            Tariff.create({
                createdBy: user.email,
                address: tariffAddress,
                status: 'active'
            }, 
                function (err, tariff) {
                    if (err) return res.status(500).send("There was a problem adding the information to the database.");
                    console.log("New Tariff updated " + tariff);
                    
                    res.status(200).send(tariff);
                });

        }
        //res.status(200).send("Success");
    });
});



module.exports = router;
