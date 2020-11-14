import { Component, OnInit } from '@angular/core';
import { ControllerService } from '../controller.service'
import { ActivatedRoute } from '@angular/router';
import { Class } from '../shared/models/Class';
import { ClassSubject } from '../shared/models/ClassSubject';
import { Student } from '../shared/models/Student';
import { SubPoints } from '../shared/models/SubPoints';
import { SubSubject } from '../shared/models/SubSubject';

@Component({
  selector: 'app-edit-class',
  templateUrl: './edit-class.component.html',
  styleUrls: ['./edit-class.component.css']
})
export class EditClassComponent implements OnInit {
  public thisClass: Class;
  public classNames = [`אזרחות`, `אנגלית`, `ביולוגיה`, `גיאוגרפיה`, `היסטוריה`, `חנ"ג`, `כימיה`, `מוסיקה`, `מתמטיקה`, `פיזיקה`, `ספרות`, `עברית`, `תנ"ך`];
  public grades: String[] = ["", "א", "ב", "ג", "ד", "ה", "ו", "ז", "ח", "ט", "י", "יא", "יב",];
  public totalPoints = 0;

  constructor(private service: ControllerService, private route: ActivatedRoute) {
    this.thisClass = this.service.class;
    this.thisClass.classSubject = [];
    this.thisClass.classStudents = [];
    this.thisClass.rewards = [];
    this.service.classEmitter.subscribe(c => {
      this.thisClass = c;
      this.checkPoints();
    });
  }

  ngOnInit() {
    this.route.paramMap.subscribe(params => {
      this.service.getClass(params.get('id'), params.get('cId'));
    });
  }

  public editClass(name: String, grade: String) {
    if (this.totalPoints != 1000)
      return alert("חייב להשתמש בכל הנקודות");
    if (name[0] == " " || name == "")
      return alert("בחר שם כיתה");
    if (grade != "")
      this.thisClass.grade = grade;
    if (Number(name))
      return alert("השם לא יכול להיות רק מספרים");
    if (name.length > 11)
      return alert("שם ארוך מדי");
    this.thisClass.className = name;
    this.service.editClass(this.thisClass);
  }

  public addSub(sub: String) {
    if (sub) {
      let counter = this.thisClass.classSubject.length;

      if (sub[0] == " " || sub == "")
        return alert("בחר שם נושא");

      if(sub.length > 20)
        return alert("שם הנושא ארוך מידי");

      if(sub.length < 3)
        return alert("שם הנושא קצר מידי");

      if (counter == 10)
        return alert("הגעת לכמות נושאים מקסימאלי");

      for (let i = 0; i < counter; i++)
        if (sub == this.thisClass.classSubject[i].name)
          return alert("הנושא כבר קיים");

      let subject: ClassSubject = new ClassSubject;
      subject.name = sub;
      subject.points = 0;
      subject.subsubject = [];
      this.thisClass.classSubject[counter] = subject;
      let temp: SubPoints = new SubPoints();
      temp.subName = sub;
      temp.points = 0;
      let t = 0;
      for (let j = 0; j < this.thisClass.classStudents.length; j++) {
        for (t = 0; t < this.thisClass.classStudents[j].subPoints.length; t++);
        this.thisClass.classStudents[j].subPoints[t] = temp;
      }
    }
  }

  public addSubsub(name: String) {
    let thisSubsub = prompt("הכנס את שם התת נושא");
    if (thisSubsub[0] == " " || thisSubsub == "")
      return alert("בחר שם תת נושא");

    for (let i = 0; i < this.thisClass.classSubject.length; i++) {
      if (name == this.thisClass.classSubject[i].name) {
        if (this.thisClass.classSubject[i].subsubject.length >= 5)
          return alert("הגעת לכמות תת נושאים מקסימאלי");

        if (name == thisSubsub)
          return alert("השם קיים");

        if(name.length > 20)
          return alert("שם תת הנושא ארוך מידי");

        if(name.length < 3)
          return alert("שם תת הנושא קצר מידי");

        for (let j = 0; j < this.thisClass.classSubject[i].subsubject.length; j++)
          if (this.thisClass.classSubject[i].subsubject[j].name == thisSubsub)
            return alert("שם לא יכול להיות דומה לשם הכיתה");

        let sub: SubSubject = {
          name: thisSubsub,
          subComp: false,
          points: 0
        }

        this.thisClass.classSubject[i].subsubject[this.thisClass.classSubject[i].subsubject.length] = sub;
        break;
      }
    }
  }

  public editPoints(sub: ClassSubject, subsub?: any) {
    let points = Number(prompt("הכנס נקודות"));
    let subPoints = 0;
    if (!Number(points))
      return alert("חייב להיות מספר");
    if (points < 0)
      return alert("לא יכול להיות מספר שלילי");
    if (subsub) {
      for (let i = 0; i < this.thisClass.classSubject.length; i++)
        if (this.thisClass.classSubject[i].name == sub.name) {
          for (let j = 0; j < this.thisClass.classSubject[i].subsubject.length; j++)
            subPoints += Number(this.thisClass.classSubject[i].subsubject[j].points);
          for (let x = 0; x < this.thisClass.classSubject[i].subsubject.length; x++)
            if (this.thisClass.classSubject[i].subsubject[x].name == subsub.name) {
              if ((subPoints - Number(this.thisClass.classSubject[i].subsubject[x].points) + points) > sub.points)
                return alert("מספר הנקודות עולה על הנקודות של הכיתה");
              this.thisClass.classSubject[i].subsubject[x].points = points;
              break;
            }
        }
    }
    else {
      if (Number(sub))
        return alert("לא יכול להיות רק מספרים");
      if (points < 100)
        return alert("לא יכול להיות מתחת ל-100 נקודות");
      if (points > 1000)
        return alert("לא יכול להיות מעל 1000 נקודות")
      for (let i = 0; i < this.thisClass.classSubject.length; i++)
        if (this.thisClass.classSubject[i].name == sub.name) {
          if (points + this.totalPoints - Number(this.thisClass.classSubject[i].points) > 1000)
            return alert(`סה"כ נקודות לא יכול להיות מעל 1000`);
          else {
            this.thisClass.classSubject[i].points = points;
            for (let j = 0; j < this.thisClass.classSubject[i].subsubject.length; j++)
              this.thisClass.classSubject[i].subsubject[j].points = 0;
            break;
          }
        }
      this.checkPoints();
    }
  }

  public addStudent(id: String) {
    if (id) {
      let counter = this.thisClass.classStudents.length;
      if (counter == 40)
        return alert("הגעת לכמות תלמידים מקסימאלי");
      else
        for (let i = 0; i < counter; i++)
          if (this.thisClass.classStudents[i]._id == id)
            return alert("התלמיד כבר קיים");
      let student: Student = new Student();
      student._id = id;
      student.classPoints = 0;
      student.subPoints = [];
      for (let i = 0; i < this.thisClass.classSubject.length; i++) {
        let temp: SubPoints = new SubPoints();
        temp.subName = this.thisClass.classSubject[i].name;
        temp.points = 0;
        student.subPoints[i] = temp;
      }
      this.thisClass.classStudents[counter] = student;
    }
  }

  public removeElement(element: any, subsub?: String) {
    if (subsub || !Number(element)) {
      this.thisClass.classSubject = this.service.removeElement(element, subsub, this.thisClass.classSubject);
      this.checkPoints();
    }
    else
      this.thisClass.classStudents = this.service.removeElement(element, "", this.thisClass.classSubject, this.thisClass.classStudents);
  }

  public checkPoints() {
    this.totalPoints = 0;
    for (let i = 0; i < this.thisClass.classSubject.length; i++)
      this.totalPoints += Number(this.thisClass.classSubject[i].points);
  }

  public addReward(item: String, cost: Number) {
    if (this.thisClass.rewards.length >= 5)
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

    for (let i = 0; i < this.thisClass.rewards.length; i++)
      if (this.thisClass.rewards[i].item == item)
        return alert("ההטבה כבר נמצאת");

    let reward = { item, cost };
    reward.item = item;
    reward.cost = cost;
    this.thisClass.rewards[this.thisClass.rewards.length] = reward;
  }

  public removeReward(name: String) {
    let temp = [];
    for (let i = 0; i < this.thisClass.rewards.length; i++)
      if (this.thisClass.rewards[i].item != name)
        temp[temp.length] = this.thisClass.rewards[i];

    this.thisClass.rewards = temp;
  }

  public goBack() {
    this.service.goTeacherClass(this.thisClass.classTeacher, this.thisClass._id);
  }
  public deleteClass() {
    if ("כן" == prompt("האם אתה בטוח שאתה רוצה למחוק את הכיתה? (רשום כן כדי להמשיך)"))
      this.service.deleteClass(this.thisClass);
  }
}
