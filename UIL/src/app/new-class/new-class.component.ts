import { Component, OnInit } from '@angular/core';
import { ControllerService } from '../controller.service'
import { Class } from '../../../../models/Class';
import { Person } from '../../../../models/Person';

@Component({
  selector: 'app-new-class',
  templateUrl: './new-class.component.html',
  styleUrls: ['./new-class.component.css']
})
export class NewClassComponent implements OnInit {

  public newClass: Class;
  public thisTeacher: Person;
  public classNames: String[] = ["History", "Math", "English"];
  public grades: String[] = ["a", "b", "c"];
  public subCounter = 0;
  public stuCounter = 0;

  constructor(private service: ControllerService) {
    this.newClass = this.service.class;
    this.thisTeacher = this.service.person;
  }

  ngOnInit() {
    this.newClass.classSubject = [];
    this.newClass.classStudents = [];
  }

  public createClass(name: String, grade: String) {
    this.newClass.className = name;
    this.newClass.grade = grade;
    this.newClass.classTeacher = this.thisTeacher._id;
    this.service.postClass(this.newClass);
  }

  public addSub(sub: String) {
    if (this.subCounter <= 9) {
      if (sub) {
        this.newClass.classSubject[this.subCounter] = sub;
        this.subCounter++;
      }
    }
    else
      alert("Max class subjects has reached");
  }

  public addStudent(id: String) {
    if (this.stuCounter <= 40) {
      if (id) {
        this.newClass.classStudents[this.stuCounter] = id;
        this.stuCounter++;
      }
    }
    else
      alert("Max class students has reached");
  }
}
