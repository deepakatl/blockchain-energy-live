import { Component, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { SawtoothService } from '../sawtooth.service';


@Component({templateUrl: 'energy.component.html'})
  selector: 'app-generate', `
  <div class="generate">
  <div class="form">
    <form class="generate" (submit)="generateEnergy($event)">
  <input id="energy_id" type="text" placeholder="Energy units in KWh"/>
 
  <button id="submit" type="submit" >generate</button>

  </form>
  </div>
</div>

  `,
  styles: [
    "../node_modules/angular2-busy/build/style/busy.css",
    "styles.css"
  ]
})
export class GenerateComponent implements OnInit {

  constructor(private Data : SawtoothService,private router :RouterModule) { }

  ngOnInit() {
  }
    generateEnergy(event){
   
      event.preventDefault()
      const target = event.target
      const energyvalue = target.querySelector('#energy_id').value;
      this.Data.sendData("generate", energyvalue);
      console.log(energyvalue);
    }
  

}




import { Component, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { SawtoothService } from '../sawtooth.service';

@Component({
  selector: 'app-consume',
  template: `
  <div class="consume">
  <div class="form">
    <form class="consume" (submit)="consumeEnergy($event)">
  <input id="consume_id" type="text" placeholder="Energy in units KWh"/>
 
  <button id="submit" type="submit" >Consume</button>

  </form>
  </div>
</div>

  `,
  styles: [
    "../node_modules/angular2-busy/build/style/busy.css",
    "styles.css"
  ]
})
export class ConsumeComponent implements OnInit {

  constructor(private Data : SawtoothService,private router :RouterModule) { }

  ngOnInit() {
  }
    consumeEnergy(event){
   
      event.preventDefault()
      const target = event.target
      const energyvalue = target.querySelector('#energy_id').value;
      this.Data.sendData("consume", energyvalue);
      console.log(energyvalue);
    }
  

}

import { Component, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { SawtoothService } from '../sawtooth.service';

@Component({
  selector: 'app-count',
  template: `
  <div class="count">
  <div class="form">
    <form class="count" (submit)="countEnergy($event)">
  <input id="count_id" type="text" placeholder="Energy in units KWh"/>
 
  <button id="submit" type="submit" >count</button>

  </form>
  </div>
</div>

  `,
  styles: [
    "../node_modules/angular2-busy/build/style/busy.css",
    "styles.css"
  ]
})
export class CountComponent implements OnInit {

  constructor(private Data : SawtoothService,private router :RouterModule) { }

  ngOnInit() {
  }
    countEnergy(event){
   
      event.preventDefault()
      const target = event.target
      const energyvalue = target.querySelector('#energy_id').value;
      this.Data.sendData("consume", energyvalue);
      console.log(energyvalue);
    }
  

}
