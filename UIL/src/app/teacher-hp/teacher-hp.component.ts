import { Component, OnInit } from '@angular/core';
import { ControllerService } from '../controller.service'
import { Class } from '../shared/models/Class';
import { Person } from '../shared/models/Person';

@Component({
  selector: 'app-teacher-hp',
  templateUrl: './teacher-hp.component.html',
  styleUrls: ['./teacher-hp.component.css']
})
export class TeacherHPComponent implements OnInit {

  public myClasses: Class[] = [];
  public thisTeacher: Person;

  constructor(private service: ControllerService) {
    this.myClasses = this.service.classArr;
    this.thisTeacher = this.service.person;
    this.service.teacherEmitter.subscribe(t => this.thisTeacher = t);
    this.service.classesEmitter.subscribe(c => this.myClasses = c);
  }

  ngOnInit() {
    this.service.getTeacher();
    this.service.getClasses();
  }

  public goCreateClass() {
    this.service.goCreateClass(this.thisTeacher._id);
  }

  public goClass(c: Class) {
    this.service.goClass(c.classTeacher, c._id);
  }

  public goSettings() {
    this.service.goSettings(this.thisTeacher._id);
  }
}
