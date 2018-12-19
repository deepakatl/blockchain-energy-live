var SawtoothService = require('../sawtooth/sawtooth-service');
const PrivateKeyUtil = require('../crypto/privatekeyutil');
class UserService{
  
    constructor() { 
        this.FAMILY_NAME = 'user';
        this.sawtoothService = new SawtoothService('http://localhost:4200/api');
    }

  
    createUser(user, privateKey){
        console.log("Going to create new User");
        let address =  this.sawtoothService.hash(this.FAMILY_NAME).substr(0, 6);
        //this.sawtoothService.hash(this.FAMILY_TYPE_SOLAR).substr(0, 4);
        
        let response = this.sawtoothService.sendData("create_user", [user], address, privateKey)//;
        console.log("Created User = " + user);
    }

    authenticate(user, privateKey){
        console.log("Going to authenticate  User in chain");
        let address =  this.sawtoothService.hash(this.FAMILY_NAME).substr(0, 6);
        let response = this.sawtoothService.sendData("authenticate_user", [user], address, privateKey)//;
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