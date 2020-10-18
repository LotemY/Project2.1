import { Component, OnInit } from '@angular/core';
import { ControllerService } from '../controller.service';
import { ActivatedRoute } from '@angular/router';
import { Person } from '../shared/models/Person';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.css']
})
export class SettingsComponent implements OnInit {
  public thisUser: Person;
  public edit: Person = new Person();
  public personForm: FormGroup;
  public submitted = false;

  constructor(private service: ControllerService, private route: ActivatedRoute, private fb: FormBuilder) {
    this.thisUser = this.service.person;

    this.service.teacherEmitter.subscribe(t => this.thisUser = t);
    this.service.studentEmitter.subscribe(s => this.thisUser = s);
  }

  ngOnInit() {
    this.route.paramMap.subscribe(params => {
      let id = params.get('id');
      this.service.getUser(id);
    })

    this.personForm = this.fb.group({
      email: ['', [Validators.email]],
      password: ['', [Validators.minLength(6), Validators.maxLength(11), Validators.pattern('^(?=.*[0-9])(?=.*[a-zA-Z])([a-zA-Z0-9]+)$')]],
      nickName: ['', [Validators.minLength(3), Validators.maxLength(8)]],
    })
  }

  get f() {
    return this.personForm.controls;
  }

  public save() {
    this.submitted = true;

    if (this.personForm.invalid)
      return;

    if (this.personForm.get('email').value)
      this.edit.email = this.personForm.get('email').value;

    if (this.personForm.get('password').value)
      this.edit.password = this.personForm.get('password').value;

    if (this.personForm.get('nickName').value)
      this.edit.nickName = this.personForm.get('nickName').value;

    if (!this.edit.nickName && this.thisUser.nickName)
      this.edit.nickName = this.thisUser.nickName;

    if (!this.personForm.get('email').value && !this.personForm.get('password').value && !this.personForm.get('nickName').value)
      alert("אין מה לשנות");

    else {
      this.edit._id = this.thisUser._id;
      this.edit.token = this.thisUser.token;
      this.service.editUser(this.edit);
    }
  }

  public del() {
    if (prompt("(רשום כן בכדי להמשיך)\n?האם אתה בטוח") == "כן")
      this.service.deleteUser(this.thisUser);
  }

  public goBack() {
    if (this.thisUser.nickName)
      this.service.sNavigate(this.thisUser._id)
    else
      this.service.tNavigate(this.thisUser._id)
  }
}
