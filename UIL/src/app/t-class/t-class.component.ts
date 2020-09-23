import { Component, OnInit } from '@angular/core';
import { ControllerService } from '../controller.service';
import { ActivatedRoute } from '@angular/router';
import { Class } from '../shared/models/Class';
import { Person } from '../shared/models/Person';

@Component({
  selector: 'app-t-class',
  templateUrl: './t-class.component.html',
  styleUrls: ['./t-class.component.css']
})
export class TClassComponent implements OnInit {
  public thisTeacher: Person;
  public thisClass: Class;

  constructor(private service: ControllerService, private route: ActivatedRoute) {
    this.thisTeacher = this.service.person;
    this.thisClass = this.service.class;
    this.service.teacherEmitter.subscribe(t => this.thisTeacher = t);
    this.service.classEmitter.subscribe(c => this.thisClass = c);
  }

  ngOnInit() {
    this.route.paramMap.subscribe(params => {
      this.service.getClass(params.get('cId'));
    })
    this.service.getUser();
  }

  public goEditClass() {
    this.service.goEditClass(this.thisTeacher._id, this.thisClass._id);
  }

  public goBack() {
    this.service.tNavigate(this.thisTeacher._id);
  }
}
