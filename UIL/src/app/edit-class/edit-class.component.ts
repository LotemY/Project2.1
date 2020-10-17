import { Component, OnInit } from '@angular/core';
import { ControllerService } from '../controller.service'
import { ActivatedRoute } from '@angular/router';
import { Class } from '../shared/models/Class';
import { classSubject } from '../shared/models/classSubject';
import { Student } from '../shared/models/Student';
import { subPoints } from '../shared/models/subPoints';

@Component({
  selector: 'app-edit-class',
  templateUrl: './edit-class.component.html',
  styleUrls: ['./edit-class.component.css']
})
export class EditClassComponent implements OnInit {
  public thisClass: Class;
  public classNames: String[] = [`אזרחות`, `אנגלית`, `ביולוגיה`, `גיאוגרפיה`, `היסטוריה`, `חנ"ג`, `מתמטיקה`, `ספרות`, `עברית`, `תנ"ך`];
  public grades: String[] = ["", "a", "b", "c"];
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
      return alert("Must use all the points");

    if (grade != "")
      this.thisClass.grade = grade;
    this.thisClass.className = name;
    this.service.editClass(this.thisClass);
  }

  public addSub(sub: String) {
    if (sub) {
      let counter = this.thisClass.classSubject.length;

      if (counter == 10)
        return alert("Max class subjects has reached");

      for (let i = 0; i < counter; i++)
        if (sub == this.thisClass.classSubject[i].name)
          return alert("Subject already exist");

      let subject: classSubject = new classSubject;
      subject.name = sub;
      subject.points = 0;
      subject.subsubject = [];
      this.thisClass.classSubject[counter] = subject;
      let temp: subPoints = new subPoints();
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
    let thisSubsub = prompt("Enter name of the subject");

    for (let i = 0; i < this.thisClass.classSubject.length; i++) {
      if (name == this.thisClass.classSubject[i].name) {
        if (this.thisClass.classSubject[i].subsubject.length >= 5)
          return alert("Max class subjects has reached");

        if (name == thisSubsub)
          return alert("Duplicate name");

        for (let j = 0; j < this.thisClass.classSubject[i].subsubject.length; j++)
          if (this.thisClass.classSubject[i].subsubject[j].name == thisSubsub)
            return alert("Name already exist");

        let sub: classSubject = {
          name: thisSubsub,
          points: 0,
          subsubject: undefined
        }

        this.thisClass.classSubject[i].subsubject[this.thisClass.classSubject[i].subsubject.length] = sub;
        break;
      }
    }
  }

  public editPoints(sub: classSubject, subsub?: any) {
    let points = Number(prompt("Enter points"));
    let subPoints = 0;
    if (points < 0)
      return alert("Cant be nagtive number");
    if (subsub) {
      for (let i = 0; i < this.thisClass.classSubject.length; i++)
        if (this.thisClass.classSubject[i].name == sub.name) {
          for (let j = 0; j < this.thisClass.classSubject[i].subsubject.length; j++)
            subPoints += Number(this.thisClass.classSubject[i].subsubject[j].points);
          for (let x = 0; x < this.thisClass.classSubject[i].subsubject.length; x++)
            if (this.thisClass.classSubject[i].subsubject[x].name == subsub.name) {
              if ((subPoints - Number(this.thisClass.classSubject[i].subsubject[x].points) + points) > sub.points)
                return alert("Too much points");
              this.thisClass.classSubject[i].subsubject[x].points = points;
              break;
            }
        }
    }
    else {
      if (Number(sub))
        return alert("Cant put only numbers");
      if (points < 100)
        return alert("Cant be less then 100 points");
      if (points > 1000)
        return alert("Cant be above 1000")
      for (let i = 0; i < this.thisClass.classSubject.length; i++)
        if (this.thisClass.classSubject[i].name == sub.name) {
          if (points + this.totalPoints - Number(this.thisClass.classSubject[i].points) > 1000)
            return alert("total points cannot be above 1000");
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
        return alert("Max Students has reached");
      else
        for (let i = 0; i < counter; i++)
          if (this.thisClass.classStudents[i]._id == id)
            return alert("Student already exists");
      let student: Student = new Student();
      student._id = id;
      student.classPoints = 0;
      student.subPoints = [];
      for (let i = 0; i < this.thisClass.classSubject.length; i++) {
        let temp: subPoints = new subPoints();
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
      return alert("Max reward is 5");
    if (!item || !cost)
      return alert("must put all parameters");
    if (cost >= 1000)
      return alert("The cost is too high");
    if (cost <= 0)
      return alert("The cost is too low");
    for (let i = 0; i < this.thisClass.rewards.length; i++)
      if (this.thisClass.rewards[i].item == item)
        return alert("Item is in the list");

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
    if ("yes" == prompt("Are you sure? (Enter yes to confirm)"))
      this.service.deleteClass(this.thisClass);
  }
}
