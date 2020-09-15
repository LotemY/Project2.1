import { Component, OnInit } from '@angular/core';
import { ControllerService } from '../controller.service'
import { Class } from '../../../../models/Class';
import { Person } from '../../../../models/Person';


@Component({
  selector: 'app-teacher-hp',
  templateUrl: './teacher-hp.component.html',
  styleUrls: ['./teacher-hp.component.css']
})
export class TeacherHPComponent implements OnInit {

  public myClass: Class;
  public thisTeacher: Person;
  public classNames: String[] = ["History", "Math", "English"];
  public grades: String[] = ["a", "b", "c"];
  public subCounter = 0;
  public stuCounter = 0;

  constructor(private service: ControllerService) {
    this.myClass = this.service.class;
    this.thisTeacher = this.service.person;
    this.service.teacherEmitter.subscribe(t => this.thisTeacher = t);
    this.service.classEmitter.subscribe(c => this.myClass = c);
  }

  ngOnInit() {
    this.myClass.classSubject = [];
    this.myClass.classStudents = [];
  }

  public goCreateClass() {
    this.service.goCreateClass(this.thisTeacher._id);
  }

  public goClass() {
    this.service.goClass(this.thisTeacher._id, this.myClass._id);
  }

  // SETTINGS
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
