import { Component, OnInit } from '@angular/core';
import { ControllerService } from './controller.service'

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})

export class AppComponent implements OnInit {
  public loged: Boolean = false;
  constructor(private service: ControllerService) {
    this.service.logInEmitter.subscribe(l => this.loged = l);
  }

  ngOnInit() { }

  public logOut() {
    return this.service.logOut();
  }
  public goSettings() {
    this.service.serSettings();
  }
}
