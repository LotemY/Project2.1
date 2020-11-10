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
  public counterNumStudent: number;
  public counterNumrewards: number;
  public SelectReason: Reason[] = [];



  constructor(private service: ControllerService, private route: ActivatedRoute) {
    this.thisStudent = this.service.person;
    this.thisClass = this.service.class;
    this.service.studentEmitter.subscribe(s => this.thisStudent = s);
    this.service.classEmitter.subscribe(c => this.thisClass = c);
    this.thisClass.classStudents = [];
    this.thisClass.classSubject = [];
    this.thisClass.rewards = [];
    this.counterNumStudent = 0;
    this.counterNumrewards = 0;
  }

  ngOnInit() {
    this.route.paramMap.subscribe(params => {
      this.service.getClass(params.get('id'), params.get('cId'));
      this.service.getUser(params.get('id'));
    })
    setTimeout(() => {
      for (let i = 0; i < this.thisClass.classStudents.length; i++) {
        this.counterNumStudent += 1;
      }
      for (let i = 0; i < this.thisClass.rewards.length; i++) {
        this.counterNumrewards += 1;
      }
      for (let i = 0; i < this.thisClass.classStudents.length; i++) {
        if (this.thisClass.classStudents[i]._id == this.thisStudent._id) {
          this.SelectReason = this.thisClass.classStudents[i].reason;
          console.log(this.SelectReason);
          break;
        }
      }


    }, 200);
  }

  public run() {
    var coll = document.getElementsByClassName("collapsible");
    var i;

    for (i = 0; i < coll.length; i++) {
      coll[i].addEventListener("click", function () {
        this.classList.toggle("active");
        var content = this.nextElementSibling;
        if (content.style.display === "block") {
          content.style.display = "none";
        } else {
          content.style.display = "block";
        }
      });
    }
  }

  public subInfo(info: String) {
    this.service.goSubInfo(this.thisStudent._id, this.thisClass._id, info);
  }

  public goBack() {
    this.service.sNavigate(this.thisStudent._id);
  }
}
