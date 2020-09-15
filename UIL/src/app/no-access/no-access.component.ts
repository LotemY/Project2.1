import { Component, OnInit } from '@angular/core';
import { ControllerService } from '../controller.service'

@Component({
  selector: 'app-no-access',
  templateUrl: './no-access.component.html',
  styleUrls: ['./no-access.component.css']
})
export class NoAccessComponent implements OnInit {

  constructor(private service: ControllerService) { }

  ngOnInit(): void {
  }

  public login() {
    this.service.loginNavigate();
  }
}
