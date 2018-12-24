import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { map } from 'rxjs/operators';


@Injectable()
export class EnergyService {
    AUTH_URL ="http://localhost:3000/energy";
    constructor(private http: HttpClient) { }

    updateEnergy(energyUnit: Number, email: string):any {
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
          
          return fetch(this.AUTH_URL +"/update", fetchOptions)
            .then(function(response) {
                return response;
            })
            .then(function(response) {
                 console.log(response);
                 return response;
             });
    }

    getBalance(email: string):any {
        const fetchOptions = {
          method: 'POST',
          
          headers: {
            'Content-Type': 'application/json'
          },
          body : JSON.stringify({
            email: email
        })
        }
        
        return fetch(this.AUTH_URL +"/getBalance", fetchOptions)
          .then(function(response) {
              return response.json();
          })
          .then(function(response) {
               console.log(response);
               return response;
           });
  }

  updateTariff(peak: string, offpeak: string, normal: string, email: string):any {
    const fetchOptions = {
      method: 'POST',
      
      headers: {
        'Content-Type': 'application/json'
      },
      body : JSON.stringify({
        peak: peak,
        offpeak : offpeak,
        normal: normal,
        email: email
    })
    }
    
    return fetch(this.AUTH_URL +"/updatetariff", fetchOptions)
      .then(function(response) {
          return response;
      })
      .then(function(response) {
           console.log(response);
           return response;
       });
}

}