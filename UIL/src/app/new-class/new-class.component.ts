import { Component, OnInit } from '@angular/core';
import { ControllerService } from '../controller.service'
import { Class } from '../shared/models/Class';
import { Person } from '../shared/models/Person';

@Component({
  selector: 'app-new-class',
  templateUrl: './new-class.component.html',
  styleUrls: ['./new-class.component.css']
})
export class NewClassComponent implements OnInit {

  public newClass: Class;
  public thisTeacher: Person;
  public classNames: String[] = ["History", "Math", "English"];
  public grades: String[] = ["", "a", "b", "c"];
  public subCounter = 0;
  public stuCounter = 0;

  constructor(private service: ControllerService) {
    this.newClass = this.service.class;
    this.thisTeacher = this.service.person;
    this.service.teacherEmitter.subscribe(t => this.thisTeacher = t);
    this.service.classEmitter.subscribe(c => this.newClass = c);
  }

  ngOnInit() {
    this.service.getTeacher();
    this.newClass.classSubject = [];
    this.newClass.classStudents = [];
  }

  public createClass(name: String, grade: String) {
    if (name == "")
      return alert("Please enter a name");
    if (grade == "")
      return alert("Please select a grade");

    this.newClass.className = name;
    this.newClass.grade = grade;
    this.newClass.classTeacher = this.thisTeacher._id;
    this.service.postClass(this.newClass);
  }

  public addSub(sub: String) {
    if (sub) {
      if (this.subCounter < 10) {
        if (sub) {
          this.newClass.classSubject[this.subCounter] = sub;
          this.subCounter++;
        }
      }
      else
        alert("Max class subjects has reached");
    }
  }

  public addStudent(id: String) {
    if (this.stuCounter < 40) {
      if (id) {
        for (let i = 0; i < this.newClass.classStudents.length; i++)
          if (this.newClass.classStudents[i] == id)
            return alert("Student already exists");

        this.newClass.classStudents[this.stuCounter] = id;
        this.stuCounter++;
      }
    }
    else
      alert("Max class students has reached");
  }

  public goBack() {
    this.service.tNavigate(this.thisTeacher._id);
  }
}
