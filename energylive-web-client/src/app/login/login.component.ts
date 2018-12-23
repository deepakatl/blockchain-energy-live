import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { first } from 'rxjs/operators';

import { AlertService, AuthenticationService } from '../_services';

@Component({templateUrl: 'login.component.html',
            styleUrls: ['login.component.css']
})
export class LoginComponent implements OnInit {
    loginForm: FormGroup;
    loading = false;
    loginFailed = false;
    submitted = false;
    returnUrl: string;

    constructor(
        private formBuilder: FormBuilder,
        private route: ActivatedRoute,
        private router: Router,
        private authenticationService: AuthenticationService,
        private alertService: AlertService) {}

    ngOnInit() {
        this.loginForm = this.formBuilder.group({
            username: ['', Validators.required],
            password: ['', Validators.required]
        });

        // reset login status
        this.authenticationService.logout();

        // get return url from route parameters or default to '/'
        this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';
        console.log(this.returnUrl);
    }

    // convenience getter for easy access to form fields
    get f() { return this.loginForm.controls; }

    onSubmit() {
        this.submitted = true;

        // stop here if form is invalid
        if (this.loginForm.invalid) {
            return;
        }

        this.loading = true;
        let loginResult = this.authenticationService.login(this.f.username.value, this.f.password.value);
        loginResult.then((result)=>{
            let currentUser = result[0];
            if(currentUser !== undefined){
                console.log(result + ' ' + this.router + currentUser);
                if(currentUser.type === 'admin'){
                    this.router.navigate(['adminhome']);
                }else{
                    this.router.navigate(['home']);
                }
            }else{
                this.loading = false;
                this.loginFailed = true;
                this.router.navigate(['login']); 
            }
            
        });
    }
}
