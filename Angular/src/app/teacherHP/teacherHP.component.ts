import { Component, OnInit } from '@angular/core';
import { ServiceService } from '../service.service'
import { Class } from '../../../../models/Class';
import { Person } from '../../../../models/Person';
import { ActivatedRoute } from '@angular/router';

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
  public id: String;

  constructor(private service: ServiceService, private route: ActivatedRoute) {
    this.myClass = this.service.class;
    this.thisTeacher = this.service.person;
  }

  ngOnInit() {
    this.route.paramMap.subscribe(params => {
      this.id = params.get('id');
    })
    this.service.getTeacher(this.id);
    this.service.teacherEmitter.subscribe(t => this.thisTeacher = t);
  }

  public createClass(className: String, grade: String) {
    this.myClass.className = className;
    this.myClass.grade = grade;
    //this.myClass.classSubject = classSubject;
    this.service.postClass(this.myClass);
  }

  public save(email: String) {
    let edit=new Person();
    edit._id=this.thisTeacher._id;
    edit.email=email;
    this.service.editTeacher(edit);
  }

  public del(){
    this.service.deletePerson(this.thisTeacher._id);
  }
}
