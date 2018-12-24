var SawtoothService = require('../sawtooth/sawtooth-service');
const PrivateKeyUtil = require('../crypto/privatekeyutil');
class EnergyService{
  
    constructor() { 
        this.FAMILY_NAME = 'energy';
        this.FAMILY_VERSION = '1.0';
        
        this.sawtoothService = new SawtoothService('http://localhost:4200/api', this.FAMILY_NAME, this.FAMILY_VERSION);
    }

  
    generateEnergy(energyQuantity, privateKey){
        console.log("Going to update generated energy unit");
  
        let address =  this.sawtoothService.hash(this.FAMILY_NAME).substr(0, 6);
        //this.sawtoothService.hash(this.FAMILY_TYPE_SOLAR).substr(0, 4);
        
        let response = this.sawtoothService.sendData("update", [energyQuantity], address, privateKey)//;
       
        console.log("updateGeneratedEnergyUnit = " + response);
    }

    getBalance(user, privateKey){
        console.log("Get User account balance " + user.email);
        let address =  this.sawtoothService.hash(this.FAMILY_NAME).substr(0, 6);
        let userAddress = address + this.sawtoothService.getAddress(privateKey);
        return this.sawtoothService.getState(userAddress)
        .then((response) => {
            console.log(response);
            return response.json();
          })
          .then((responseJson) => {
              console.log(responseJson);
              let response = this.sawtoothService.getDecodedData(responseJson);
            return response;
          })
        console.log('Balance =' + JSON.stringify(state));

        
    }
  
    updateGeneratedSolarEnergyUnit(genValue){
      console.log("Going to update generated energy unit");
  
      let address =  this.sawtoothService.hash(this.FAMILY_NAME).substr(0, 6);
      //this.sawtoothService.hash(this.FAMILY_TYPE_SOLAR).substr(0, 4);
      
      
      
      let response = this.sawtoothService.sendData("generate", [genValue], address)//;
      console.log("updateGeneratedEnergyUnit = " + response);
    }
  
    updateGeneratedWindEnergyUnit(genValue){
      console.log("Going to update generated energy unit");
  
      let address =  this.sawtoothService.hash(this.FAMILY_NAME).substr(0, 6) 
      //this.sawtoothService.hash(this.FAMILY_TYPE_WIND).substr(0, 4);

      let response = this.sawtoothService.sendData("generate_wind", [genValue], address)//;
      console.log("updateGeneratedEnergyUnit = " + response);
    }
}

module.exports = EnergyService;
