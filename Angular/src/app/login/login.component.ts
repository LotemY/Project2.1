import { Component } from '@angular/core';
import { Person } from '../../../../models/Person';
import { ServiceService } from '../service.service'

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class loginComponent {
  public exitUser: Person;
  private bool: boolean = false;

  constructor(private service: ServiceService) {
    this.exitUser = service.person;
  }

  public loginReq(email: String, password: String) {
    this.exitUser.email = email;
    this.exitUser.password = password;
    this.service.loginPerson(this.exitUser);
  }
}



