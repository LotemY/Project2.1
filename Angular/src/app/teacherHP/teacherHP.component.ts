import { Component, OnInit } from '@angular/core';
import { ServiceService } from '../service.service'
import { Class } from '../../../../models/Class';
import { Person } from '../../../../models/Person';

@Component({
  selector: 'app-teacherHP',
  templateUrl: './teacherHP.component.html',
  styleUrls: ['./teacherHP.component.css']
})
export class teacherHPComponent implements OnInit {
  public myClass: Class;
  public thisTeacher: Person;
  public classNames: String[] = ["History", "Math", "English"];
  public grades: String[] = ["a", "b", "c"];

  constructor(private service: ServiceService) {
    this.myClass = this.service.class;
    this.thisTeacher = this.service.person;
    this.service.teacherEmitter.subscribe(t => this.thisTeacher = t);
  }

  ngOnInit() { }

  public createClass(className: String, grade: String) {
    this.myClass.className = className;
    this.myClass.grade = grade;
    //this.myClass.classSubject = classSubject;
    this.service.postClass(this.myClass);
  }

  public save(email?: String, password?: String) {
    let edit = new Person();
    if (email)
      edit.email = email;
    if (password)
      edit.password = password;
    if (!email && !password)
      alert("Nothing to change");
    else {
      edit._id = this.thisTeacher._id;
      edit.token = this.thisTeacher.token;
      this.service.editTeacher(edit);
    }
  }

  public del() {
    this.service.deleteTeacher(this.thisTeacher);
  }
}
