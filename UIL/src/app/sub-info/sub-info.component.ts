import { Component, OnInit } from '@angular/core';
import { ControllerService } from '../controller.service';
import { ActivatedRoute } from '@angular/router';
import { Class } from '../shared/models/Class';
import { Person } from '../shared/models/Person';
import { classSubject } from '../shared/models/classSubject';
import { Student } from '../shared/models/Student';

@Component({
  selector: 'app-sub-info',
  templateUrl: './sub-info.component.html',
  styleUrls: ['./sub-info.component.css']
})
export class SubInfoComponent implements OnInit {
  public thisTeacher: Person;
  public thisClass: Class;
  public info: classSubject = new classSubject();

  constructor(private service: ControllerService, private route: ActivatedRoute) {
    this.thisTeacher = this.service.person;
    this.thisClass = this.service.class;
    this.info = this.service.info;
    this.service.teacherEmitter.subscribe(t => this.thisTeacher = t);
    this.service.classEmitter.subscribe(c => this.thisClass = c);
    this.service.infoEmitter.subscribe(i => this.info = i);
  }

  ngOnInit(): void {
    this.route.paramMap.subscribe(async params => {
      this.service.getClass(params.get('id'), params.get('cId'));
      this.service.getUser(params.get('id'));
      let i;
      setTimeout(() => {
        for (i = 0; i < this.thisClass.classSubject.length; i++) {
          if (params.get('info') == this.thisClass.classSubject[i].name) {
            this.info = this.thisClass.classSubject[i];
            break;
          }
        }
        if (i == this.thisClass.classSubject.length)
          this.service.noAccess();
      }, 200);
    })
  }

  public complete() {
    alert("This is one time button, Are you sure you finished the subject?")
    let answer = prompt("Enter yes to procced")
    if (answer == "yes") {
      this.info.comp = true;
      for (let c = 0; c < this.thisClass.classSubject.length; c++)
        if (this.thisClass.classSubject[c].name == this.info.name) {
          this.thisClass.classSubject[c] = this.info;
          break;
        }
      this.service.comp(this.thisClass);
      for (let i = 0; i < this.thisClass.classStudents.length; i++)
        for (let j = 0; j < this.thisClass.classStudents[i].subPoints.length; j++)
          if (this.thisClass.classStudents[i].subPoints[j].subName == this.info.name)
            this.thisClass.classStudents[i].subPoints[j].points = this.info.points;

      this.service.updatePoints(this.thisClass);
    }
  }

  public back() {
    this.service.goTeacherClass(this.thisTeacher._id, this.thisClass._id);
  }
}
