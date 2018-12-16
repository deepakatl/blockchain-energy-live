var SawtoothService = require('../sawtooth/sawtooth-service');
class UserService{
  
    constructor() { 
        this.FAMILY_NAME = 'users';
        this.sawtoothService = new SawtoothService('http://localhost:4200/api');
    }

  
    createUser(user, privateKey){
        console.log("Going to create new User");
        let address =  this.sawtoothService.hash(this.FAMILY_NAME).substr(0, 6);
        //this.sawtoothService.hash(this.FAMILY_TYPE_SOLAR).substr(0, 4);
        
        let response = this.sawtoothService.sendData("create_user", [user], address, privateKey)//;
        console.log("Created User = " + user);
    }

    print(){
        console.log("User Service");
    }
}

module.exports = UserService;