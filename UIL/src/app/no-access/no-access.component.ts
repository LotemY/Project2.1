import { Component, OnInit } from '@angular/core';
import { ControllerService } from '../controller.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-no-access',
  templateUrl: './no-access.component.html',
  styleUrls: ['./no-access.component.css']
})
export class NoAccessComponent implements OnInit {
  private id;

  constructor(private service: ControllerService, private route: ActivatedRoute) { }

  ngOnInit() {
    this.route.paramMap.subscribe(params => {
      this.id = params.get('id');
    });
  }

  public login() {
    this.service.logOut();
  }

  public goBack() {
    console.log(this.id.split('t')[1]);
    if (this.id.split('t')[1] == "") {
      this.service.tNavigate(this.id);
    }
    else {
      this.service.sNavigate(this.id);
    }
  }
}