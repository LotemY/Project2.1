import { Component, OnInit } from '@angular/core';
import { Person } from '../shared/models/Person';
import { ControllerService } from '../controller.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit  {
  private exitUser: Person;

  constructor(private service: ControllerService) {
    this.exitUser = this.service.person;
  }

  ngOnInit(){
    this.service.autoLogin();
  }

  public loginReq(email: String, password: String) {
    this.exitUser.email = email;
    this.exitUser.password = password;
    this.service.loginPerson(this.exitUser);
  }

}