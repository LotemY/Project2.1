import { Component, OnInit } from '@angular/core';
import { ControllerService } from '../controller.service'
import { Person } from '../shared/models/Person';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.css']
})
export class SettingsComponent implements OnInit {
  public thisTeacher: Person;
  public edit: Person = new Person();
  public personForm: FormGroup;
  public submitted = false;

  constructor(private service: ControllerService, private fb: FormBuilder) {
    this.thisTeacher = this.service.person;
    this.service.teacherEmitter.subscribe(t => this.thisTeacher = t);
  }

  ngOnInit() {
    this.service.getTeacher();
    this.personForm = this.fb.group({
      email: ['', [Validators.email]],
      password: ['', [Validators.minLength(6), Validators.maxLength(11), Validators.pattern('^(?=.*[0-9])(?=.*[a-zA-Z])([a-zA-Z0-9]+)$')]]
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

    if (!this.personForm.get('email').value && !this.personForm.get('password').value)
      alert("Nothing to change");

    else {
      this.edit._id = this.thisTeacher._id;
      this.edit.token = this.thisTeacher.token;
      this.service.editTeacher(this.edit);
    }
  }

  public del() {
    this.service.deleteTeacher(this.thisTeacher);
  }
}
