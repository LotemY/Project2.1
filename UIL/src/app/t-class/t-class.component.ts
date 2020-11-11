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
  public reasons: String[] = ["", "הגשת שיעורי בית", "עזרה לחבר", "השתתפות בשיעור", "הגשת מבחן", "התחצפות למורה", "אי הכנת שיעורי בית", "איחור", "אי הגעה לשיעור", "אחר"];
  public selectReason: String;  // test!
  public counterNumStudent: number;
  public counterNumrewards: number;
  public selectStudent: Student;

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
    this.counterNumStudent = 0;
    this.counterNumrewards = 0;
    this.selectStudent = new Student();
  }

  ngOnInit() {
    this.route.paramMap.subscribe(params => {
      this.service.getClass(params.get('id'), params.get('cId'));
      this.service.getUser(params.get('id'));
    })
    setTimeout(() => {
      for (let i = 0; i < this.thisClass.classStudents.length; i++) {
        this.counterNumStudent += 1;
      }
      for (let i = 0; i < this.thisClass.rewards.length; i++) {
        this.counterNumrewards += 1;
      }
    }, 200);
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


  public openForm(s: Student) {
    this.selectStudent = s;

    let name = document.getElementById('nameField') as HTMLInputElement;
    let point = document.getElementById('pointField') as HTMLInputElement;

    name.value = "";
    point.value = "";

    document.getElementById("myForm").style.display = "block";
  }

  public closeForm() {

    document.getElementById("myForm").style.display = "none";
  }

  public editPoints() {
    let r = document.getElementById('nameField') as HTMLInputElement;
    let p = document.getElementById('pointField') as HTMLInputElement;
    let radio = (<HTMLInputElement>document.getElementById('radioB'));

    let reason: Reason = new Reason();
    reason.reasonName = "";
    reason.reasonPoints = "";

    if (r.value == "")
      return alert("בחר סיבה קודם");
    reason.reasonName = r.value;

    if (!Number(p.value))
      return alert("הכנס רק מספר");
    if (Number(p.value) < 0)
      return alert("לא יכול להיות שלילי");

    if (radio.checked) {
      if (this.selectStudent.classPoints + Number(p.value) > 1000)
        return alert("הגעת למקסימום");
      this.selectStudent.classPoints += Number(p.value);
      reason.reasonPoints = p.value;
    }
    else {
      if (this.selectStudent.classPoints - Number(p.value) < 0)
        return alert("לא יכול להיות שלילי");
      this.selectStudent.classPoints -= Number(p.value);
      reason.reasonPoints = "-" + p.value;
    }

    let length = this.selectStudent.reason.length
    this.selectStudent.reason[length] = reason;
    for (let i = 0; i < this.thisClass.classStudents.length; i++)
      if (this.selectStudent._id == this.thisClass.classStudents[i]._id) {
        this.thisClass.classStudents[i] = this.selectStudent;
        break;
      }
    this.service.updatePoints(this.thisClass);
    document.getElementById("myForm").style.display = "none";
  }

  public selectAreason(str) {  // test!

    this.selectReason = str.value;
    console.log("str", this.selectReason);
  }

}
