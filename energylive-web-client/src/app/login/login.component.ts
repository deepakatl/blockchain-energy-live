import { Component, OnInit } from '@angular/core';
import { SawtoothService } from '../sawtooth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  template: `
  <div class="count">
  <div class="form">  
  <form >
 
  <input type="file" id="files" name="files[]" multiple (change)="onChange($event)"  />
   <output id="list"></output>
   </form>
   </div>
 </div>
 
  `,
  styles: [
    "../node_modules/angular2-busy/build/style/busy.css",
    "styles.css"
  ]
})
export class LoginComponent implements OnInit {

  constructor(private router : Router ,private Data : SawtoothService) { 
  this.Data.clearLogin();
  }

  ngOnInit() {
   this.Data.clearLogin();
   this.router.navigate(['login/home']);
  } 

  
onChange(event) {
  event.preventDefault()
  console.log(event);
    var file = event.target.files[0];
    console.log("file",file);
    var reader = new FileReader();
    const dataService = this.Data;
    const router = this.router;
    reader.onload = function(event) {
      console.log("target",event.target);
      const result=(reader.result);
        console.log("target result",event.target);
        const login = dataService.setLogin(file.name,result);
        if(login!=false) {
        router.navigate(['login/home']);  }

    };
    
    reader.onerror = (e) => {
      console.log(e);
     
    };
    reader.readAsArrayBuffer(file);
    
  }
    
 }
    
 


/*import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { first } from 'rxjs/operators';

import { AlertService, AuthenticationService } from '../_services';

@Component({templateUrl: 'login.component.html'})
export class LoginComponent implements OnInit {
    loginForm: FormGroup;
    loading = false;
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
            console.log(result + ' ' + this.router);
            this.router.navigate(['home']);
        });
    }
}*/
