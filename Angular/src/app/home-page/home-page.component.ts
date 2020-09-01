import { Component, OnInit } from '@angular/core';
import { ServiceService } from '../service.service'
import { Class } from '../../../../models/Class';
import { Person } from '../../../../models/Person';

@Component({
  selector: 'app-home-page',
  templateUrl: './home-page.component.html',
  styleUrls: ['./home-page.component.css']
})
export class HomePageComponent implements OnInit {
  public myClass: Class;
  public classNames: String[] = ["History", "Math", "English"];
  public grades: String[] = ["a", "b", "c"];

  constructor(private service: ServiceService) {
    this.myClass = this.service.class;
  }

  ngOnInit() {
  }
  public createClass(className: String, grade: String) {
    this.myClass.className = className;
    this.myClass.grade = grade;
    //this.myClass.classSubject = classSubject;
    this.service.postClass(this.myClass);
  }
}
