import { Component, OnInit } from '@angular/core';
import { ControllerService } from '../controller.service';
import { ActivatedRoute } from '@angular/router';
import { Person } from '../shared/models/Person';
import { Class } from '../shared/models/Class';

@Component({
  selector: 'app-student-hp',
  templateUrl: './student-hp.component.html',
  styleUrls: ['./student-hp.component.css']
})
export class StudentHPComponent implements OnInit {
  public thisStudent: Person;
  public myClasses: Class[] = [];

  constructor(private service: ControllerService, private route: ActivatedRoute) {
    this.thisStudent = this.service.person;
    this.myClasses = this.service.classArr;
    this.service.studentEmitter.subscribe(s => this.thisStudent = s);
    this.service.classesEmitter.subscribe(c => this.myClasses = c);
  }

  ngOnInit() {
    this.route.paramMap.subscribe(params => {
      this.service.getUser(params.get('id'));
      this.service.getClasses(params.get('id'));
    })
  }

  public goClass(c: Class) {
    this.service.goStudentClass(this.thisStudent._id, c._id);
  }
}
