import { Component, OnInit } from '@angular/core';
import { ControllerService } from '../controller.service'
import { ActivatedRoute } from '@angular/router'
import { Class } from '../shared/models/Class';
import { Person } from '../shared/models/Person';

@Component({
  selector: 'app-t-class',
  templateUrl: './t-class.component.html',
  styleUrls: ['./t-class.component.css']
})
export class TClassComponent implements OnInit {
  public teacherId: String;
  public classId: String;
  constructor(private service: ControllerService, private route: ActivatedRoute) {

  }

  ngOnInit() {
    this.route.paramMap.subscribe(params => {
      this.teacherId = params.get('id');
      this.classId = params.get('cId');
    })
  }

  public goEditClass() {
    this.service.goEditClass(this.teacherId, this.classId);
  }

  public goBack() {
    this.service.tNavigate(this.teacherId);
  }
}
