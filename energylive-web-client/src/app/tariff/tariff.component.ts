import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { first } from 'rxjs/operators';
import { EnergyService } from '../_services';

@Component({
  selector: 'app-tariff',
  templateUrl: './tariff.component.html',
  styleUrls: ['./tariff.component.css']
})
export class TariffComponent implements OnInit {

  tariffUpdateForm :FormGroup;

  constructor(private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,private energyService: EnergyService) { 

    }

  ngOnInit() {
    this.tariffUpdateForm = new FormGroup({
      peaktariff: new FormControl(),
      offpeaktariff: new FormControl(),
      normaltariff: new FormControl()
      });
  }
  save(){
    let peaktariff = this.tariffUpdateForm.get('peaktariff').value;
    let offpeaktariff = this.tariffUpdateForm.get('offpeaktariff').value;
    let normaltariff = this.tariffUpdateForm.get('normaltariff').value;
    let user = JSON.parse(localStorage.getItem("currentUser"))[0];
    this.energyService.updateTariff(peaktariff, offpeaktariff, normaltariff, user.email);

    this.router.navigate(['/adminhome']);
  }

}
