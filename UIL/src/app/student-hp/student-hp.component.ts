import { Component, OnInit } from '@angular/core';
import { ControllerService } from '../controller.service';
import { ActivatedRoute } from '@angular/router';
import { Class } from '../shared/models/Class';
import { Person } from '../shared/models/Person';

@Component({
  selector: 'app-student-hp',
  templateUrl: './student-hp.component.html',
  styleUrls: ['./student-hp.component.css']
})
export class StudentHPComponent implements OnInit {
  public thisStudent: Person;

  constructor(private service: ControllerService, private route: ActivatedRoute) {
    this.thisStudent = this.service.person;
    this.service.studentEmitter.subscribe(s => this.thisStudent = s);
  }

  ngOnInit() {
    this.route.paramMap.subscribe(params => {
      this.service.getUser(params.get('id'));
    })
  }
}
