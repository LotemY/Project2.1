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
  public nickName="T";
  
  constructor(private service: ServiceService) {
    this.myPerson=service.person;
  }

  public createPerson(firstName: String, lastName: String, email: String, password: String) {
    this.myPerson.firstName = firstName;
    this.myPerson.lastName = lastName;
    this.myPerson.email = email;
    this.myPerson.password = password;
    if(this.nickName!='T')
      this.myPerson.nickName=this.nickName;
    this.service.postPerson(this.myPerson);
  }
}