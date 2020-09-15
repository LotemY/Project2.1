import { Component, OnInit } from '@angular/core';
import { ControllerService } from './controller.service'

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})

export class AppComponent implements OnInit {
  constructor(private service: ControllerService) {

  }
  ngOnInit() {
    this.service.autoLogin();
  }
}