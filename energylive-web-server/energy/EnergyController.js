var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');
var EnergyService = require('./energy-service');
const User = require('../user/User');
const PrivateKeyUtil = require('../crypto/privatekeyutil');

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
            console.log("Request reach here - update solar energy" + energy);
            let energyService = new EnergyService();
            energyService.generateEnergy(energy, privateKey);
            res.status(200).send({result: 'success',
			energy	
            });

        }
        res.status(200).send("Success");
    });
});

module.exports = router;
