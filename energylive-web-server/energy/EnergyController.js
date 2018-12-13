var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');

router.use(bodyParser.urlencoded({ extended: true }));
router.use(bodyParser.json());

//Update produced solar energy
router.post('/', function (req, res) {
    // User.create({
    //         name : req.body.name,
    //         email : req.body.email,
    //         password : req.body.password
    //     }, 
    //     function (err, user) {
    //         if (err) return res.status(500).send("There was a problem adding the information to the database.");
    //         res.status(200).send(user);
    //     });
    console.log("Request reach here - update solar energy");
    res.status(200).send({result: 'success',
			token: 101,
            name: 'Deepak',
            totalEnergy : 1000     	
	});
});

module.exports = router;