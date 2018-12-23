import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { first } from 'rxjs/operators';

import { EnergyService } from '../_services';

@Component({
  templateUrl: 'energy.component.html',
  })
export class EnergyComponent implements OnInit {

  energyUpdateForm :FormGroup;
  constructor(private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private energyService: EnergyService) {
      
     }

  ngOnInit() {
    this.energyUpdateForm = new FormGroup({
      energyUnit: new FormControl()
      }); 
  console.log(this.energyUpdateForm);

  }

  
    onSubmit() {
        console.log('energyUnit:' + this.energyUpdateForm.get('energyUnit').value);
        let user = JSON.parse(localStorage.getItem("currentUser"))[0];
        let loginResult = this.energyService.updateEnergy(this.energyUpdateForm.get('energyUnit').value, user.email);
        loginResult.then((result)=>{
            console.log(result + ' ' + this.router + result);
            this.router.navigate(['home']);
        });
    }

    generate() {
      console.log('energyUnit:' + this.energyUpdateForm.get('energyUnit').value);
      let user = JSON.parse(localStorage.getItem("currentUser"))[0];
      let value = this.energyUpdateForm.get('energyUnit').value;
      let energyQuantity = Number.parseInt(value);
      let loginResult = this.energyService.updateEnergy(energyQuantity , user.email);
      loginResult.then((result)=>{
          console.log(result + ' ' + this.router + result);
          this.router.navigate(['home']);
      });
    }

    consume() {
      console.log('energyUnit:' + this.energyUpdateForm.get('energyUnit').value);
      let user = JSON.parse(localStorage.getItem("currentUser"))[0];
      let value = this.energyUpdateForm.get('energyUnit').value;
      let energyQuantity = Number.parseInt(value) * -1;
      let loginResult = this.energyService.updateEnergy(energyQuantity , user.email);
      loginResult.then((result)=>{
          console.log(result + ' ' + this.router + result);
          this.router.navigate(['home']);
      });
  }

}
