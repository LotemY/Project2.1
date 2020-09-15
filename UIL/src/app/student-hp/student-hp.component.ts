import { Component, OnInit } from '@angular/core';
import { ControllerService } from '../controller.service';
import { Class } from '../shared/models/Class';
import { Person } from '../shared/models/Person';

@Component({
  selector: 'app-student-hp',
  templateUrl: './student-hp.component.html',
  styleUrls: ['./student-hp.component.css']
})
export class StudentHPComponent implements OnInit {
public thisStudent: Person;

  constructor(private service: ControllerService) {
    this.thisStudent = this.service.person;
    this.service.studentEmitter.subscribe(s => this.thisStudent = s);
  }

  ngOnInit() { }

  public save(email?: String, password?: String, nickName?: String) {
    let edit = new Person();
    if (email)
      edit.email = email;
    if (password)
      edit.password = password;
    if (nickName)
      edit.nickName = nickName;
    if (!email && !password && !nickName)
      alert("Nothing to change");
    else {
      edit._id = this.thisStudent._id;
      edit.token = this.thisStudent.token;
      this.service.editStudent(edit);
    }
  }

  public del() {
    this.service.deleteStudent(this.thisStudent);
  }

}
