import { Component, OnInit } from '@angular/core';
import { first } from 'rxjs/operators';

import { User } from '../_models';
import { UserService, EnergyService } from '../_services';

@Component({templateUrl: 'home.component.html'})
export class HomeComponent implements OnInit {
    currentUser;
    energyBalance;
    

    constructor(private userService: UserService, private energyService: EnergyService) {
        this.currentUser = JSON.parse(localStorage.getItem('currentUser'))[0];
        
    }

    ngOnInit() {
        console.log("Going to fetch balance");
        let userAccount =this.energyService.getBalance(this.currentUser.email);
        userAccount.then((response) => {
            console.log(response);
            this.energyBalance = response.energyunit;
          })
        
    }

    deleteUser(id: number) {
        // this.userService.delete(id).pipe(first()).subscribe(() => { 
        //     this.loadAllUsers() 
        // });
    }

    private loadAllUsers() {
        // this.userService.getAll().pipe(first()).subscribe(users => { 
        //     this.users = users; 
        // });
    }
}