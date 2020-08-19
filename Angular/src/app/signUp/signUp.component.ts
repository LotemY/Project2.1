import { Component } from '@angular/core';
import { ServiceService } from '../service.service'
import { Person } from '../../../../models/Person';

@Component({
  selector: 'app-signUp',
  templateUrl: './signUp.component.html',
  styleUrls: ['./signUp.component.css']
})

export class signUpComponent {

  public myPerson: Person;

  constructor(private service: ServiceService) {
  }

  public createPerson(name: String, lastName: String, email: String, password: String) {
    this.myPerson.userName = name;
    this.myPerson.lastName = lastName;
    this.myPerson.email = email;
    this.myPerson.password = password;
    this.service.postPerson(this.myPerson);
  }
}