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
    this.selectStudent = new Student();
  }

  ngOnInit() {
    this.route.paramMap.subscribe(params => {
      this.service.getClass(params.get('id'),
        params.get('cId'));
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


  public openForm(s: Student) {
    this.selectStudent = s;
    let name = document.getElementById('nameField') as HTMLInputElement;
    let point = document.getElementById('pointField') as HTMLInputElement;
    this.clearRadio();
    name.value = "";
    point.value = "";

    document.getElementById("myForm").style.display = "block";
  }

  public closeForm() {
    this.clearRadio();
    document.getElementById("myForm").style.display = "none";
  }

  public editPoints() {
    let r = document.getElementById('nameField') as HTMLInputElement;
    let p = document.getElementById('pointField') as HTMLInputElement;
    let radio = (<HTMLInputElement>document.getElementById('radioB'));
    let radioS = (<HTMLInputElement>document.getElementById('radioA'));

    let reason: Reason = new Reason();
    reason.reasonName = "";
    reason.reasonPoints = "";

    if (r.value == "")
      return alert("בחר סיבה קודם");
    reason.reasonName = r.value;

    if (!Number(p.value))
      return alert("אנא הכנס מספר");
    if (Number(p.value) < 0)
      return alert("לא יכול להיות שלילי");

    if (radio.checked) {
      if (this.selectStudent.classPoints + Number(p.value) > 1000)
        return alert("הגעת למקסימום");
      this.selectStudent.classPoints += Number(p.value);
      reason.reasonPoints = "+" + p.value;
      radio.checked = false;
    }
    else if (radioS.checked) {
      if (this.selectStudent.classPoints - Number(p.value) < 0)
        return alert("לא יכול להיות שלילי");
      this.selectStudent.classPoints -= Number(p.value);
      reason.reasonPoints = "-" + p.value;
      radioS.checked = false;
    }
    else {
      return alert("בחר פעולה (הוספה/הסרה)");
    }

    for (let r = 3; r >= 0; r--)
      if (this.selectStudent.reason[r])
        this.selectStudent.reason[(r + 1)] = this.selectStudent.reason[r];

    this.selectStudent.reason[0] = reason;

    for (let i = 0; i < this.thisClass.classStudents.length; i++)
      if (this.selectStudent._id == this.thisClass.classStudents[i]._id) {
        this.thisClass.classStudents[i] = this.selectStudent;
        break;
      }
    this.service.updatePoints(this.thisClass);
    document.getElementById("myForm").style.display = "none";
  }

  public clearRadio() {
    let radio = (<HTMLInputElement>document.getElementById('radioB'));
    let radioS = (<HTMLInputElement>document.getElementById('radioA'));
    radio.checked = false;
    radioS.checked = false;
  }

}
