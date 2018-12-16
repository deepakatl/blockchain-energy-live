import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { map } from 'rxjs/operators';


@Injectable()
export class AuthenticationService {
    AUTH_URL ="http://localhost:3000/users/login";
    constructor(private http: HttpClient) { }

    login(email: string, password: string):any {
        const fetchOptions = {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body : JSON.stringify({
                email: email,
                password : password
            })
          }
          
          return fetch(this.AUTH_URL , fetchOptions)
            .then(function(response) {
                return response.json();
            })
            .then(function(user) {
                 console.log(JSON.stringify(user));
                 localStorage.setItem('currentUser', JSON.stringify(user));
                 return user;
             });
        // return this.http.post<any>(this.AUTH_URL +'/users/authenticate', { username: username, password: password })
        //     .pipe(map(user => {
        //         // login successful if there's a jwt token in the response
        //         // if (user && user.token) {
        //         //     // store user details and jwt token in local storage to keep user logged in between page refreshes
        //         //     localStorage.setItem('currentUser', JSON.stringify(user));
        //         // }

        //         return user;
        //      }));
    }

   

    logout() {
        // remove user from local storage to log user out
        localStorage.removeItem('currentUser');
    }
}