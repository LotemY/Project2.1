import { Component, OnInit } from '@angular/core';
import { ServiceService } from '../service.service'

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.css']
})
export class SettingsComponent implements OnInit {

  constructor(private service: ServiceService) { }

  ngOnInit(): void {
    console.log("settings onInit");
    this.service.getUser();
  }

}
