import { Component, OnInit } from '@angular/core';
import { ControllerService } from '../controller.service';
import { ActivatedRoute } from '@angular/router';
import { Class } from '../shared/models/Class';
import { Person } from '../shared/models/Person';
import { Student } from '../shared/models/Student';
import { ClassSubject } from '../shared/models/ClassSubject';
import { SubSubject } from '../shared/models/SubSubject';

@Component({
  selector: 'app-new-class',
  templateUrl: './new-class.component.html',
  styleUrls: ['./new-class.component.css']
})
export class NewClassComponent implements OnInit {

  public newClass: Class;
  public thisTeacher: Person;
  public classNames = [`אזרחות`, `אנגלית`, `ביולוגיה`, `גיאוגרפיה`, `היסטוריה`, `חנ"ג`, `כימיה`, `מוסיקה`, `מתמטיקה`, `פיזיקה`, `ספרות`, `עברית`, `תנ"ך`];
  public grades: String[] = ["", "א", "ב", "ג", "ד", "ה", "ו", "ז", "ח", "ט", "י", "יא", "יב",];

  constructor(private service: ControllerService, private route: ActivatedRoute) {
    this.newClass = this.service.class;
    this.thisTeacher = this.service.person;
    this.service.teacherEmitter.subscribe(t => this.thisTeacher = t);
    this.service.classEmitter.subscribe(c => this.newClass = c);
    this.newClass.classSubject = [];
    this.newClass.classStudents = [];
    this.newClass.rewards = [];
  }

  ngOnInit() {
    this.route.paramMap.subscribe(params => {
      this.service.getUser(params.get('id'));
    })
  }

  public createClass(name: String, grade: String) {
    if (name[0] == " " || name == "")
      return alert("בחר שם כיתה");
    if (Number(name))
      return alert("השם לא יכול להיות מספר");
    if (name.length > 11)
      return alert("השם ארוך מדי");
    if (name.length < 3)
      return alert("השם קצר מדי");
    if (grade == "")
      return alert("הכנס שכבת הכיתה");

    this.newClass.className = name;
    this.newClass.grade = grade;
    this.newClass.classTeacher = this.thisTeacher._id;
    this.service.postClass(this.newClass);
  }

  public addSub(sub: String) {
    if (sub) {
      if (Number(sub))
        return alert("לא ניתן להכניס מספר");
      if (sub[0] == " " || sub == "")
        return alert("בחר שם נושא");
      if(sub.length > 20)
        return alert("שם הנושא ארוך מידי");
      if(sub.length < 3)
        return alert("שם הנושא קצר מידי");
      let counter = this.newClass.classSubject.length
      for (let i = 0; i < counter; i++)
        if (this.newClass.classSubject[i].name == sub)
          return alert("הנושא כבר קיים");

      if (counter < 10) {
        if (sub) {
          let subject: ClassSubject = new ClassSubject;
          subject.name = sub;
          subject.points = 100;
          subject.subsubject = [];

          this.newClass.classSubject[counter] = subject;
        }
      }
      else
        alert("הגעת למספר נושאים מקסימאלי");
    }
  }

  public removeElement(element: any, subsub?: String) {
    if (subsub || !Number(element))
      this.newClass.classSubject = this.service.removeElement(element, subsub, this.newClass.classSubject);
    else {
      this.newClass.classStudents = this.service.removeElement(element, "", this.newClass.classSubject, this.newClass.classStudents);
    }
  }

  public addSubsub(name: String) {
    let thisSubsub = prompt("הכנס את שם התת נושא");
    if (thisSubsub[0] == " " || thisSubsub == "")
      return alert("בחר שם תת נושא");

    if(name.length > 20)
      return alert("שם תת הנושא ארוך מידי");

    if(name.length < 3)
      return alert("שם תת הנושא קצר מידי");

    for (let i = 0; i < this.newClass.classSubject.length; i++) {
      if (name == this.newClass.classSubject[i].name) {
        if (this.newClass.classSubject[i].subsubject.length >= 5)
          return alert("הגעת למספר תת נושאים מקסימאלי");

        if (name == thisSubsub)
          return alert("השם קיים");

        for (let j = 0; j < this.newClass.classSubject[i].subsubject.length; j++)
          if (this.newClass.classSubject[i].subsubject[j].name == thisSubsub)
            return alert("שם לא יכול להיות דומה לשם הכיתה");

        let sub: SubSubject = {
          name: thisSubsub,
          subComp: false,
          points: 0
        }

        this.newClass.classSubject[i].subsubject[this.newClass.classSubject[i].subsubject.length] = sub;;
        break;
      }
    }
  }

  public addStudent(id: String) {
    let counter = this.newClass.classStudents.length;
    if (counter < 40) {
      if (id) {
        for (let i = 0; i < counter; i++)
          if (this.newClass.classStudents[i]._id == id)
            return alert("התלמיד כבר קיים");

        this.newClass.classStudents[counter] = new Student();
        this.newClass.classStudents[counter]._id = id;
        this.newClass.classStudents[counter].subPoints = [];
      }
    }
    else
      return alert("הגעת לכמות תלמידים מקסימאלי");
  }

  public addReward(item: String, cost: Number) {
    if (this.newClass.rewards.length >= 5)
      return alert("הגעת למספר הטבות מקסימאלי");
    if (item[0] == " " || item == "")
      return alert("בחר שם הטבה");
    if (!item || !cost)
      return alert("חייב להכניס את כל הפרמטרים");
    if (Number(item))
      return alert("שם ההטבה לא יכול להיות מספר");
    if (cost > 1000)
      return alert("עלות ההטבה גבוהה מדי");
    if (cost <= 0)
      return alert("לא ניתן להכניס מספר שלילי");
    if(item.length > 20)
      return alert("שם ההטבה ארוך מידי");
    if(item.length < 3)
      return alert("שם ההטבה קצר מידי");
    for (let i = 0; i < this.newClass.rewards.length; i++)
      if (this.newClass.rewards[i].item == item)
        return alert("ההטבה כבר נמצאת");

    let reward = { item, cost };
    reward.item = item;
    reward.cost = cost;
    this.newClass.rewards[this.newClass.rewards.length] = reward;
  }

  public removeReward(name: String) {
    let temp = [];
    for (let i = 0; i < this.newClass.rewards.length; i++)
      if (this.newClass.rewards[i].item != name)
        temp[temp.length] = this.newClass.rewards[i];

    this.newClass.rewards = temp;
  }

  public goBack() {
    this.service.tNavigate(this.thisTeacher._id);
  }
}