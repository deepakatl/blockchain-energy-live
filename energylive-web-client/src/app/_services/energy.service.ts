import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { map } from 'rxjs/operators';


@Injectable()
export class EnergyService {
    AUTH_URL ="http://localhost:3000/energy/update";
    constructor(private http: HttpClient) { }

    updateEnergy(energyUnit: string, email: string):any {
          const fetchOptions = {
            method: 'POST',
            
            headers: {
              'Content-Type': 'application/json'
            },
            body : JSON.stringify({
              email: email,
              energyunit : energyUnit
          })
          }
          
          return fetch(this.AUTH_URL , fetchOptions)
            .then(function(response) {
                return response.json();
            })
            .then(function(user) {
                 console.log(JSON.stringify(user));
                 return user;
             });
    }
}