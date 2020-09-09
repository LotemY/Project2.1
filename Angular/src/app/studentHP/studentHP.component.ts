import { Component, OnInit } from '@angular/core';
import { ServiceService } from '../service.service';
import { Class } from '../../../../models/Class';
import { Person } from '../../../../models/Person';

@Component({
  selector: 'app-studentHP',
  templateUrl: './studentHP.component.html',
  styleUrls: ['./studentHP.component.css']
})
export class studentHPComponent implements OnInit {
  public thisStudent: Person;

  constructor(private service: ServiceService) {
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
