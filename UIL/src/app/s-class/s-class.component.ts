import { Component, OnInit } from '@angular/core';
import { ControllerService } from '../controller.service';
import { ActivatedRoute } from '@angular/router';
import { Class } from '../shared/models/Class';
import { Person } from '../shared/models/Person';

@Component({
  selector: 'app-s-class',
  templateUrl: './s-class.component.html',
  styleUrls: ['./s-class.component.css']
})
export class SClassComponent implements OnInit {
  public thisStudent: Person;
  public thisClass: Class;
  public counterNumStudent: number;
  public counterNumrewards: number;

  constructor(private service: ControllerService, private route: ActivatedRoute) {
    this.thisStudent = this.service.person;
    this.thisClass = this.service.class;
    this.service.studentEmitter.subscribe(s => this.thisStudent = s);
    this.service.classEmitter.subscribe(c => this.thisClass = c);
    this.thisClass.classStudents = [];
    this.thisClass.classSubject = [];
    this.thisClass.rewards = [];
    this.counterNumStudent = 0;
    this.counterNumrewards=0;
  }

  ngOnInit() {
    this.route.paramMap.subscribe(params => {
      this.service.getClass(params.get('id'), params.get('cId'));
      this.service.getUser(params.get('id'));
    })
    setTimeout(() => {
      for(let i=0;i<this.thisClass.classStudents.length;i++){
        this.counterNumStudent += 1;
      }
      for(let i=0;i<this.thisClass.rewards.length;i++){
        this.counterNumrewards += 1;
      }
    }, 200);
  }

  public subInfo(info: String) {
    this.service.goSubInfo(this.thisStudent._id, this.thisClass._id, info);
  }

  public goBack() {
    this.service.sNavigate(this.thisStudent._id);
  }
}
