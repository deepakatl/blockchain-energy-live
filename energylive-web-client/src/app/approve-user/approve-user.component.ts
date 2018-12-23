import { Component, OnInit } from '@angular/core';
import { UserService } from '../_services';

@Component({
  selector: 'app-approve-user',
  templateUrl: './approve-user.component.html',
  styleUrls: ['./approve-user.component.css', 
  "../../../node_modules/bootstrap/dist/css/bootstrap.css"]
})
export class ApproveUserComponent implements OnInit {
  users;
  headElements = ['id', 'Email', 'Name', 'MeterId', 'Status', 'Approve', 'Decline']
  constructor(private userService: UserService) { 
    
  }

  ngOnInit() {
    let response = this.userService.getApprovalRequiredUsers();
    response.then((response)=> {
      this.users = response;
    });
    console.log( "Comp = " +  this.users);
  }

  approve(user){
    console.log("Approved user "+ user);
    let response = this.userService.approve(user);
    response.then((response)=> {
      this.users.splice(this.users.findIndex(function(i){
        return i._id === response._id;
    }), 1);
    });
  }

  decline(){
    console.log('User declined');
  }

}
