import { Component, OnInit } from '@angular/core';
import { ControllerService } from '../controller.service'
import { ActivatedRoute } from '@angular/router';
import { Class } from '../shared/models/Class';
import { Person } from '../shared/models/Person';

@Component({
  selector: 'app-edit-class',
  templateUrl: './edit-class.component.html',
  styleUrls: ['./edit-class.component.css']
})
export class EditClassComponent implements OnInit {
  public thisClass: Class;
  public editSubject: String[]=[];
  public editStudents: String[]=[];
  public classNames: String[] = ["History", "Math", "English"];
  public grades: String[] = ["", "a", "b", "c"];

  constructor(private service: ControllerService, private route: ActivatedRoute) {
    this.thisClass = this.service.class;
    this.service.classEmitter.subscribe(c => {
      this.thisClass = c;
      this.editSubject = c.classSubject;
      this.editStudents = c.classStudents;
    });
  }

  ngOnInit() {
    this.route.paramMap.subscribe(params => {
      this.service.getClass(params.get('cId'));
    });
  }

  public editClass(name: String, grade: String) {
    if (grade != "")
      this.thisClass.grade = grade;
    this.thisClass.className = name;
    this.thisClass.classSubject = this.editSubject;
    this.thisClass.classStudents = this.editStudents;
    this.service.editClass(this.thisClass);

  }

  public addSub(sub: String) {
    if (sub) {
      if (this.editSubject.length == 10)
        return alert("Max class subjects has reached");
      this.editSubject[this.editSubject.length] = sub;
    }
  }

  public addStudent(student: String) {
    if (student) {
      if (this.editStudents.length == 40)
        return alert("Max Students has reached");
      else
        for (let i = 0; i < this.editStudents.length; i++)
          if (this.editStudents[i] == student)
            return alert("Student already exists");

      this.editStudents[this.editStudents.length] = student;
    }
  }

  public removeElement(element: String) {
    let temp: String[] = [];
    let tempCounter = 0;
    let i, j;

    if (Number(element)) {
      for (i = 0; i < this.editStudents.length; i++)
        if (this.editStudents[i] != element) {
          temp[tempCounter] = this.editStudents[i];
          tempCounter++;
        }
      this.editStudents = [];
      for (j = 0; j < temp.length; j++)
        this.editStudents[j] = temp[j];
    }

    else {
      for (i = 0; i < this.editSubject.length; i++)
        if (this.editSubject[i] != element) {
          temp[tempCounter] = this.editSubject[i];
          tempCounter++;
        }
      this.editSubject = [];
      for (j = 0; j < temp.length; j++)
        this.editSubject[j] = temp[j];
    }
  }

  public goBack() {
    this.service.goClass(this.thisClass.classTeacher, this.thisClass._id);
  }
  public deleteClass() {
    this.service.deleteClass(this.thisClass);
  }
}
