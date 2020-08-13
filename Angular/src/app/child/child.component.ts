import { Component } from '@angular/core';
import { ServiceService } from '../service.service'
import { Person } from '../../../../models/Person';

@Component({
  selector: 'app-child',
  templateUrl: './child.component.html',
  styleUrls: ['./child.component.css']
})

export class ChildComponent {

  public myPerson: Person;

  constructor(private service: ServiceService) {
    this.myPerson = service.person;
  }

  public createPerson(name: String, password: String) {
    this.myPerson.userName = name;
    this.myPerson.password = password;
    this.service.postPerson(this.myPerson);
  }
}
