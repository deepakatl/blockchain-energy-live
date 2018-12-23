import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { User } from '../_models';

@Injectable()
export class UserService {
    AUTH_URL ="http://localhost:3000/users";
    constructor(private http: HttpClient) { }

    register(firstName: string, lastName: string, email: string, mobile: string, password: string):any {
          const fetchOptions = {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body : JSON.stringify({firstName: firstName, 
                lastName: lastName,
                email: email,
                mobile: mobile,
                password : password
            })
          }
          
          return fetch(this.AUTH_URL + "/register" , fetchOptions)
            .then(function(response) {
                return response.json();
            })
            .then(function(user) {
                 console.log(JSON.stringify(user));
                 return user;
             });
    }
    getApprovalRequiredUsers(){
        const fetchOptions = {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body : JSON.stringify({
            })
          }
          
          return fetch(this.AUTH_URL + "/getapprovalrequiredusers" , fetchOptions)
            .then(function(response) {
                return response.json();
            })
            .then(function(users) {
                 console.log(JSON.stringify(users));
                 //localStorage.setItem('currentUser', JSON.stringify(user));
                 return users;
             });

    }

    approve(user){
        const fetchOptions = {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body : JSON.stringify(user
            )
          }
          
          return fetch(this.AUTH_URL + "/approve" , fetchOptions)
            .then(function(response) {
                return response.json();
            })
            .then(function(users) {
                 console.log(JSON.stringify(users));
                 //localStorage.setItem('currentUser', JSON.stringify(user));
                 return users;
             });

    }
}