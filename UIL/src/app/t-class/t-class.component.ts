import { Component, OnInit } from '@angular/core';
import { ControllerService } from '../controller.service';
import { ActivatedRoute } from '@angular/router';
import { Class } from '../shared/models/Class';
import { Person } from '../shared/models/Person';
import { Student } from '../shared/models/Student';
import { Reason } from '../shared/models/Reason';

@Component({
  selector: 'app-t-class',
  templateUrl: './t-class.component.html',
  styleUrls: ['./t-class.component.css']
})
export class TClassComponent implements OnInit {
  public thisTeacher: Person;
  public thisClass: Class;
  public reasons: String[] = ["","הגשת שיעורי בית","עזרה לחבר","השתתפות בשיעור","הגשת מבחן","התחצפות למורה","אי הכנת שיעורי בית","איחור","אי הגעה לשיעור","אחר"];


  constructor(private service: ControllerService, private route: ActivatedRoute) {
    this.thisTeacher = this.service.person;
    this.thisClass = this.service.class;
    this.service.teacherEmitter.subscribe(t => this.thisTeacher = t);
    this.service.classEmitter.subscribe(c => {
      this.thisClass = c;
    });
    this.thisClass.classStudents = [];
    this.thisClass.classSubject = [];
    this.thisClass.rewards = [];
  }

  ngOnInit() {
    this.route.paramMap.subscribe(params => {
      this.service.getClass(params.get('id'), params.get('cId'));
      this.service.getUser(params.get('id'));
    })
  }

  public goEditClass() {
    this.service.goEditClass(this.thisTeacher._id, this.thisClass._id);
  }

  public goBack() {
    this.service.tNavigate(this.thisTeacher._id);
  }

  public subInfo(info: String) {
    this.service.goSubInfo(this.thisTeacher._id, this.thisClass._id, info);
  }

  public editPoints(s: Student, num: Number) {
    let doc = document.getElementById('reason') as HTMLSelectElement;
    let r = doc.options[doc.selectedIndex].value;
    let reason: Reason = new Reason();

    if (r == "")
      return alert("בחר סיבה קודם");
    reason.reasonName = r;
    let temp = prompt(`סיבה: ${r}\nנקודות כרגע: ${s.classPoints}`);
    if (!Number(temp))
      return;
    if (Number(temp) < 0)
      return alert("לא יכול להיות שלילי");

    if (num == 1) {
      if (s.classPoints + Number(temp) > 1000)
        return alert("הגעת למקסימום");
      s.classPoints += Number(temp);
      reason.reasonPoints = temp;
    }
    else {
      if (s.classPoints - Number(temp) < 0)
        return alert("לא יכול להיות שלילי");
      s.classPoints -= Number(temp);
      reason.reasonPoints = "-" + temp;
    }
    s.reason[s.reason.length] = reason;
    this.service.updatePoints(this.thisClass);
  }

}
