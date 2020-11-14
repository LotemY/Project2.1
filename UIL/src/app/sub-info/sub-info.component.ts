import { Component, OnInit } from '@angular/core';
import { ControllerService } from '../controller.service';
import { ActivatedRoute } from '@angular/router';
import { Class } from '../shared/models/Class';
import { Person } from '../shared/models/Person';
import { ClassSubject } from '../shared/models/ClassSubject';
import { SubSubject } from '../shared/models/SubSubject';

@Component({
  selector: 'app-sub-info',
  templateUrl: './sub-info.component.html',
  styleUrls: ['./sub-info.component.css']
})
export class SubInfoComponent implements OnInit {
  public thisPerson: Person;
  public thisClass: Class;
  public info: ClassSubject = new ClassSubject();
  public counterNumSubfinish: number;


  constructor(private service: ControllerService, private route: ActivatedRoute) {
    this.thisPerson = this.service.person;
    this.thisClass = this.service.class;
    this.info = this.service.info;
    this.service.teacherEmitter.subscribe(p => this.thisPerson = p);
    this.service.classEmitter.subscribe(c => this.thisClass = c);
    this.service.infoEmitter.subscribe(i => this.info = i);
    this.info.subsubject = [];
    this.counterNumSubfinish = 0;
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
    setTimeout(() => {
      this.counterNumSubfinish = 0;
      for (let i = 0; i < this.thisClass.classSubject.length; i++)
        if (this.thisClass.classSubject[i].name == this.info.name)
          for (let j = 0; j < this.thisClass.classSubject[i].subsubject.length; j++)
            if (this.thisClass.classSubject[i].subsubject[j].subComp)
              this.counterNumSubfinish++;
    }, 200);
  }

  public complete() {
    alert("?זהו כפתור חד פעמי, האם אתה בטוח שאתה רוצה להשלים את הנושא")
    let answer = prompt("הכנס כן כדי להשלים")
    if (answer == "כן") {
      this.info.comp = true;
      let c;
      for (c = 0; c < this.thisClass.classSubject.length; c++)
        if (this.thisClass.classSubject[c].name == this.info.name) {
          this.thisClass.classSubject[c] = this.info;
          break;
        }
      for (let s = 0; s < this.thisClass.classSubject[c].subsubject.length; s++)
        this.thisClass.classSubject[c].subsubject[s].subComp = true;

      for (let i = 0; i < this.thisClass.classStudents.length; i++) {
        this.thisClass.classStudents[i].classPoints += Number(this.info.points);
        for (let j = 0; j < this.thisClass.classStudents[i].subPoints.length; j++)
          if (this.thisClass.classStudents[i].subPoints[j].subName == this.info.name)
            this.thisClass.classStudents[i].subPoints[j].points = Number(this.info.points);
      }
      this.service.updatePoints(this.thisClass);
    }
  }

  public subComplete(sub: SubSubject) {
    alert("?זהו כפתור חד פעמי, האם אתה בטוח שאתה רוצה להשלים את התת-נושא")
    let answer = prompt("הכנס כן כדי להשלים")
    if (answer == "כן") {
      let c;
      for (c = 0; c < this.thisClass.classSubject.length; c++)
        if (this.thisClass.classSubject[c].name == this.info.name)
          break;
      for (let s = 0; s < this.thisClass.classSubject[c].subsubject.length; s++)
        if (sub.name == this.thisClass.classSubject[c].subsubject[s].name) {
          this.thisClass.classSubject[c].subsubject[s].subComp = true;
          break;
        }

      for (let i = 0; i < this.thisClass.classStudents.length; i++) {
        this.thisClass.classStudents[i].classPoints += Number(sub.points);
        for (let j = 0; j < this.thisClass.classStudents[i].subPoints.length; j++)
          if (this.thisClass.classStudents[i].subPoints[j].subName == this.info.name)
            this.thisClass.classStudents[i].subPoints[j].points += Number(sub.points);
      }
      let com
      for (com = 0; com < this.thisClass.classSubject[c].subsubject.length; com++)
        if (!this.thisClass.classSubject[c].subsubject[com].subComp)
          break;

      if (com == this.thisClass.classSubject[c].subsubject.length)
        this.thisClass.classSubject[c].comp = true;
      this.counterNumSubfinish++;
      this.service.updatePoints(this.thisClass);
    }
  }

  public findSub(subs: any[]) {
    for (let i = 0; i < subs.length; i++)
      if (subs[i].subName == this.info.name)
        return subs[i].points;
  }

  public back() {
    if (this.thisPerson._id == this.thisClass.classTeacher)
      this.service.goTeacherClass(this.thisPerson._id, this.thisClass._id);
    else {
      this.service.goStudentClass(this.thisPerson._id, this.thisClass._id);
    }
  }
}
