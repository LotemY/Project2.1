import { Component, OnInit } from '@angular/core';
import { ControllerService } from '../controller.service';
import { ActivatedRoute } from '@angular/router';
import { Class } from '../shared/models/Class';
import { Person } from '../shared/models/Person';
import { Reason } from '../shared/models/Reason';

@Component({
  selector: 'app-s-class',
  templateUrl: './s-class.component.html',
  styleUrls: ['./s-class.component.css']
})
export class SClassComponent implements OnInit {
  public thisStudent: Person;
  public thisClass: Class;
  public SelectReason: Reason[] = [];
  public sClassPoints: Number;
  public boolin: String[] = [];


  constructor(private service: ControllerService, private route: ActivatedRoute) {
    this.thisStudent = this.service.person;
    this.thisClass = this.service.class;
    this.service.studentEmitter.subscribe(s => this.thisStudent = s);
    this.service.classEmitter.subscribe(c => {
      this.thisClass = c;

    });
    this.thisClass.classStudents = [];
    this.thisClass.classSubject = [];
    this.thisClass.rewards = [];
  }

  ngOnInit() {
    this.route.paramMap.subscribe(params => {
      this.service.getClass(params.get('id'), params.get('cId'));
      this.service.getUser(params.get('id'));
    })

    setTimeout(() => {
      document.getElementById("myFormT").style.display = "block";
      for (let i = 0; i < this.thisClass.classStudents.length; i++) {
        if (this.thisClass.classStudents[i]._id == this.thisStudent._id) {
          this.SelectReason = this.thisClass.classStudents[i].reason;
          this.sClassPoints = this.thisClass.classStudents[i].classPoints;
          break;
        }
      }
    }, 200);


    setTimeout(() => {

      for (let i = 0; i < this.thisClass.classStudents.length; i++) {
        if (this.thisClass.classStudents[i]._id == this.thisStudent._id) {
          for (let j = 0; j < this.thisClass.rewards.length; j++) {
            if (this.thisClass.classStudents[i].classPoints >= this.thisClass.rewards[j].cost)
              this.boolin[j] = "true";
            else{
              this.boolin[j] = "false";
            }
          }
        }
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
