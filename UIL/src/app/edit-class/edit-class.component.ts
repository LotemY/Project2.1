import { Component, OnInit } from '@angular/core';
import { ControllerService } from '../controller.service'
import { ActivatedRoute } from '@angular/router';
import { Class } from '../shared/models/Class';
import { classSubject } from '../shared/models/classSubject';
import { Person } from '../shared/models/Person';

@Component({
  selector: 'app-edit-class',
  templateUrl: './edit-class.component.html',
  styleUrls: ['./edit-class.component.css']
})
export class EditClassComponent implements OnInit {
  public thisClass: Class;
  public classNames: String[] = ["History", "Math", "English"];
  public grades: String[] = ["", "a", "b", "c"];
  public totalPoints = 0;

  constructor(private service: ControllerService, private route: ActivatedRoute) {
    this.thisClass = this.service.class;
    this.thisClass.classSubject = [];
    this.thisClass.classStudents = [];
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

    for (let i = 0; i < this.thisClass.classSubject.length; i++)
      if (this.thisClass.classSubject[i].points < 100)
        return alert("Min 100 point per class)");

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

  public editPoints(sub: classSubject, subsub?: String) {
    let points = Number(prompt("Enter points"));
    if (points == 0)
      return;
    for (let i = 0; i < this.thisClass.classSubject.length; i++)
      if (this.thisClass.classSubject[i].name == sub.name) {
        if (points + this.totalPoints - Number(this.thisClass.classSubject[i].points) > 1000)
          return alert("total points cannot be above 1000");
        else {
          this.thisClass.classSubject[i].points = points;
          break;
        }
      }
    this.checkPoints();
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
      let student: Person = new Person()
      student._id = id;
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
  public goBack() {
    this.service.goTeacherClass(this.thisClass.classTeacher, this.thisClass._id);
  }
  public deleteClass() {
    this.service.deleteClass(this.thisClass);
  }
}
