import { Component, OnInit } from '@angular/core';
import { ServiceService } from '../service.service';
import { ActivatedRoute } from '@angular/router';
import { Class } from '../../../../models/Class';
import { Person } from '../../../../models/Person';

@Component({
  selector: 'app-studentHP',
  templateUrl: './studentHP.component.html',
  styleUrls: ['./studentHP.component.css']
})
export class studentHPComponent implements OnInit {
  public id: String;
  public thisStudent: Person;
  constructor(private service: ServiceService, private route: ActivatedRoute) {
    this.thisStudent = this.service.person;
  }

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      this.id = params.get('id');
    })
    this.service.getStudent(this.id);
    this.service.studentEmitter.subscribe(s => this.thisStudent = s);
  }

  public save(email: String) {
    let edit = new Person();
    edit._id = this.thisStudent._id;
    edit.email = email;
    this.service.editStudent(edit);
  }

  public del() {
    this.service.deleteStudent(this.thisStudent._id);
  }

}
