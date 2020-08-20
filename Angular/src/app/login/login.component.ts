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
  
  constructor(private service: ServiceService) {
    this.exitUser = service.person;
  }

  public loginReq(name: String, password: String) {
    this.exitUser.firstName = name;
    this.exitUser.password = password;
    
  }
}



