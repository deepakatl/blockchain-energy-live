var SawtoothService = require('../sawtooth/sawtooth-service');
const PrivateKeyUtil = require('../crypto/privatekeyutil');
class UserService{
  
    constructor() { 
        this.FAMILY_NAME = 'user';
        this.sawtoothService = new SawtoothService('http://localhost:4200/api', 'user', '1.0');
    }

  
    createUser(user, privateKey){
        console.log("Going to create new User " + JSON.stringify(user));
        let address =  this.sawtoothService.hash(this.FAMILY_NAME).substr(0, 6);
        //this.sawtoothService.hash(this.FAMILY_TYPE_SOLAR).substr(0, 4);
        user = JSON.stringify(user);
        user = JSON.parse(user);
        delete user.privatekey;
        let response = this.sawtoothService.sendData("create", [JSON.stringify(user)], address, privateKey)//;
        console.log("Created User = " + user);
    }

    updateUser(user, privateKey){
        console.log("Update User =" + user);
        this.createUser(user, privateKey);
    }


    authenticate(user, privateKey){
        console.log("Going to authenticate  User in chain");
        let address =  this.sawtoothService.hash(this.FAMILY_NAME).substr(0, 6);
        let response = this.sawtoothService.sendData("authenticate", [user], address, privateKey)//;
        console.log("Authentication response =" + response);
    }

    print(){
        console.log("User Service");
    }
}

// let u = new UserService();
// let privateKey = new PrivateKeyUtil().getRandomPK();
// u.createUser(JSON.stringify({
//     firstName : 'ddd',
//     lastName: 'ssss',
//     email : 'eeeee',
//     mobile: '99999',
//     password : 'oooo',
    
// }), privateKey);

module.exports = UserService;