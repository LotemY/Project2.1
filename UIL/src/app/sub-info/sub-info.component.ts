import { Component, OnInit } from '@angular/core';
import { ControllerService } from '../controller.service';
import { ActivatedRoute } from '@angular/router';
import { Class } from '../shared/models/Class';
import { Person } from '../shared/models/Person';
import { Points } from '../shared/models/Points';
import { classSubject } from '../shared/models/classSubject';
import { async } from 'rxjs/internal/scheduler/async';


@Component({
  selector: 'app-sub-info',
  templateUrl: './sub-info.component.html',
  styleUrls: ['./sub-info.component.css']
})
export class SubInfoComponent implements OnInit {

  public thisTeacher: Person;
  public thisClass: Class;
  public info: String;

  constructor(private service: ControllerService, private route: ActivatedRoute) {
    this.thisTeacher = this.service.person;
    this.thisClass = this.service.class;
    this.info = this.service.info;
    this.service.teacherEmitter.subscribe(t => this.thisTeacher = t);
    this.service.classEmitter.subscribe(c => this.thisClass = c);
    this.service.infoEmitter.subscribe(i => this.info = i);
  }

  ngOnInit(): void {
    this.route.paramMap.subscribe(async params => {
      this.service.getClass(params.get('id'), params.get('cId'));
      this.service.getUser(params.get('id'));
      let i;
      setTimeout(() => {
        for (i = 0; i < this.thisClass.classSubject.length; i++) {
          if (params.get('info') == this.thisClass.classSubject[i].name) {
            this.info = this.thisClass.classSubject[i].name;
            break;
          }
        }
        if (i == this.thisClass.classSubject.length)
          this.service.noAccess();
      }, 200);
    })
  }
}
