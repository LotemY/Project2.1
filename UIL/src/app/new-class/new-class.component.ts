import { Component, OnInit } from '@angular/core';
import { ControllerService } from '../controller.service';
import { ActivatedRoute } from '@angular/router';
import { Class } from '../shared/models/Class';
import { Person } from '../shared/models/Person';
import { Student } from '../shared/models/Student';
import { classSubject } from '../shared/models/classSubject';

@Component({
  selector: 'app-new-class',
  templateUrl: './new-class.component.html',
  styleUrls: ['./new-class.component.css']
})
export class NewClassComponent implements OnInit {

  public newClass: Class;
  public thisTeacher: Person;
  public classNames: String[] = ["History", "Math", "English"];
  public grades: String[] = ["", "a", "b", "c"];

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
    if (name == "")
      return alert("Please enter a name");
    if (grade == "")
      return alert("Please select a grade");

    this.newClass.className = name;
    this.newClass.grade = grade;
    this.newClass.classTeacher = this.thisTeacher._id;
    this.service.postClass(this.newClass);
  }

  public addSub(sub: String) {
    if (sub) {
      let counter = this.newClass.classSubject.length
      for (let i = 0; i < counter; i++)
        if (this.newClass.classSubject[i].name == sub)
          return alert("Subject already exist");

      if (counter < 10) {
        if (sub) {
          let subject: classSubject = new classSubject;
          subject.name = sub;
          subject.points = 100;
          subject.subsubject = [];

          this.newClass.classSubject[counter] = subject;
        }
      }
      else
        alert("Max class subjects has reached");
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
    let thisSubsub = prompt("Enter name of the subject");

    for (let i = 0; i < this.newClass.classSubject.length; i++) {
      if (name == this.newClass.classSubject[i].name) {
        if (this.newClass.classSubject[i].subsubject.length >= 5)
          return alert("Max class subjects has reached");

        if (name == thisSubsub)
          return alert("Duplicate name");

        for (let j = 0; j < this.newClass.classSubject[i].subsubject.length; j++)
          if (this.newClass.classSubject[i].subsubject[j].name == thisSubsub)
            return alert("Name already exist");

        let sub: classSubject = {
          name: thisSubsub,
          points: 0,
          subsubject: undefined
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
            return alert("Student already exists");

        this.newClass.classStudents[counter] = new Student();
        this.newClass.classStudents[counter]._id = id;
        this.newClass.classStudents[counter].points = [];
      }
    }
    else
      alert("Max class students has reached");
  }

  public addReward(item: String, cost: Number) {
    if (this.newClass.rewards.length >= 5)
      return alert("Max reward is 5");
    if (!item || !cost)
      return alert("must put all parameters");
    if (cost >= 1000)
      return alert("The cost is too high")
    for (let i = 0; i < this.newClass.rewards.length; i++)
      if (this.newClass.rewards[i].item == item)
        return alert("Item is in the list");

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