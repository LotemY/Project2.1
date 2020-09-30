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
  public editSubject: classSubject[] = [];
  public editStudents: Person[] = [];
  public classNames: String[] = ["History", "Math", "English"];
  public grades: String[] = ["", "a", "b", "c"];
  public totalPoints = 0;

  constructor(private service: ControllerService, private route: ActivatedRoute) {
    this.thisClass = this.service.class;
    this.service.classEmitter.subscribe(c => {
      this.thisClass = c;
      this.editSubject = c.classSubject;
      this.editStudents = c.classStudents;
      for (let i = 0; i < this.editSubject.length; i++)
        this.totalPoints += Number(this.editSubject[i].points);
    });
  }

  ngOnInit() {
    this.route.paramMap.subscribe(params => {
      this.service.getClass(params.get('id'), params.get('cId'));
    });
  }

  public editClass(name: String, grade: String) {
    for (let i = 0; i < this.editSubject.length; i++)
      if (this.totalPoints != 1000 || this.editSubject[i].points < 100)
        return alert("Must use all the points (min 100 point per class)");

    if (grade != "")
      this.thisClass.grade = grade;
    this.thisClass.className = name;
    this.thisClass.classSubject = this.editSubject;
    this.thisClass.classStudents = this.editStudents;
    this.service.editClass(this.thisClass);

  }

  public addSub(sub: String) {
    if (sub) {
      for (let i = 0; i < this.editSubject.length; i++)
        if (sub == this.editSubject[i].name)
          return alert("Subject already exist");

      if (this.editSubject.length == 10)
        return alert("Max class subjects has reached");

      let subject: classSubject = new classSubject;
      subject.name = sub;
      subject.points = 0;
      this.editSubject[this.editSubject.length] = subject;
    }
  }

  public editPoints(sub: classSubject) {
    let points = Number(prompt("Enter points"));
    for (let i = 0; i < this.editSubject.length; i++)
      if (this.editSubject[i].name == sub.name) {
        if (points + this.totalPoints - Number(this.editSubject[i].points) > 1000)
          return alert("total points cannot be above 1000");
        else {
          this.editSubject[i].points = points;
          break;
        }
      }

    this.totalPoints = 0;

    for (let i = 0; i < this.editSubject.length; i++)
      this.totalPoints += Number(this.editSubject[i].points);
  }

  public addStudent(id: String) {
    if (id) {
      if (this.editStudents.length == 40)
        return alert("Max Students has reached");
      else
        for (let i = 0; i < this.editStudents.length; i++)
          if (this.editStudents[i]._id == id)
            return alert("Student already exists");
      let student: Person = new Person()
      student._id = id;
      this.editStudents[this.editStudents.length] = student;
    }
  }

  public removeElement(element: any) {
    let tempCounter = 0;
    let i, j;

    if (Number(element._id)) {
      let temp: Person[] = [];
      for (i = 0; i < this.editStudents.length; i++) {
        if (this.editStudents[i]._id != element._id) {
          temp[tempCounter] = this.editStudents[i];
          tempCounter++;
        }
      }
      this.editStudents = [];
      for (j = 0; j < temp.length; j++)
        this.editStudents[j] = temp[j];
    }

    else {
      let temp: classSubject[] = [];
      this.totalPoints -= element.points;

      for (i = 0; i < this.editSubject.length; i++)
        if (this.editSubject[i].name != element.name) {
          temp[tempCounter] = this.editSubject[i];
          tempCounter++;
        }

      this.editSubject = [];
      for (j = 0; j < temp.length; j++)
        this.editSubject[j] = temp[j];
    }
  }

  public goBack() {
    this.service.goTeacherClass(this.thisClass.classTeacher, this.thisClass._id);
  }
  public deleteClass() {
    this.service.deleteClass(this.thisClass);
  }
}
