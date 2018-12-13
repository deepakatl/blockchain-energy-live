var SawtoothService = require('./sawtooth-service');
class EnergyService{
  
    constructor() { 
        this.FAMILY_NAME = 'energyunit';
        this.FAMILY_TYPE_SOLAR = 'solar';
        this.FAMILY_TYPE_WIND = 'wind';
        
        this.sawtoothService = new SawtoothService('http://localhost:4200/api');
    }

  
    generateEnergy(energyQuantity){
        console.log("Going to update generated energy unit");
  
        let address =  this.sawtoothService.hash(this.FAMILY_NAME).substr(0, 6);
        //this.sawtoothService.hash(this.FAMILY_TYPE_SOLAR).substr(0, 4);
        
        
        
        let response = this.sawtoothService.sendData("generate_solar", [energyQuantity], address)//;
        console.log("updateGeneratedEnergyUnit = " + response);
    }
  
    updateGeneratedSolarEnergyUnit(genValue){
      console.log("Going to update generated energy unit");
  
      let address =  this.sawtoothService.hash(this.FAMILY_NAME).substr(0, 6);
      //this.sawtoothService.hash(this.FAMILY_TYPE_SOLAR).substr(0, 4);
      
      
      
      let response = this.sawtoothService.sendData("generate_solar", [genValue], address)//;
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
