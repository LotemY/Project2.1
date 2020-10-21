import { Component, OnInit } from '@angular/core';
import { ControllerService } from '../controller.service'
import { ActivatedRoute } from '@angular/router';
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
  public positiveReason: String[] = ["הגשת שיעורי בית","עזרה לחבר","השתתפות בשיעור","הגשת מבחן"];
  public negativeReason: String[] = ["התחצפות למורה","אי הכנת שיעורי בית","אי הגעה לשיעור","איחור"];

  constructor(private service: ControllerService, private route: ActivatedRoute) {
    this.thisTeacher = this.service.person;
    this.myClasses = this.service.classArr;
    this.service.teacherEmitter.subscribe(t => this.thisTeacher = t);
    this.service.classesEmitter.subscribe(c => this.myClasses = c);
  }

  ngOnInit() {
    this.route.paramMap.subscribe(params => {
      this.service.getUser(params.get('id'));
      this.service.getClasses(params.get('id'));
    })
  }

  public goCreateClass() {
    this.service.goCreateClass(this.thisTeacher._id);
  }

  public goClass(c: Class) {
    this.service.goTeacherClass(c.classTeacher, c._id);
  }
}
