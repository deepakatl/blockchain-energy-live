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
    //this.router.navigate(['login/home']);
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
          router.navigate(['login/home']);
        }

    };
    
    reader.onerror = (e) => {
      console.log(e);
     
    };
    reader.readAsArrayBuffer(file);
    
  }
    
 }
    
 



