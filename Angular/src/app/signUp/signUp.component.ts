import { Component, OnInit } from '@angular/core';
import { ServiceService } from '../service.service'
import { Person } from '../../../../models/Person';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-signUp',
  templateUrl: './signUp.component.html',
  styleUrls: ['./signUp.component.css']
})

export class signUpComponent implements OnInit {

  public myPerson: Person;
  public myForm: FormGroup;
  public submitted = false;

  constructor(private service: ServiceService, private fb: FormBuilder) {
    this.myPerson = this.service.person;
  }

  ngOnInit() {
    this.myForm = this.fb.group({
      firstName: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(8)]],
      lastName: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(8)]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6), Validators.maxLength(11), Validators.pattern('^(?=.*[0-9])(?=.*[a-zA-Z])([a-zA-Z0-9]+)$')]],
      nickName: ['', [Validators.minLength(3), Validators.maxLength(8)]]
    })
  }
  get f() {
    return this.myForm.controls;
  }

  onSubmit() {
    this.submitted = true;

    if (this.myForm.invalid) {
      return;
    }

    this.myPerson.firstName = this.myForm.get('firstName').value;
    this.myPerson.lastName = this.myForm.get('lastName').value;
    this.myPerson.email = this.myForm.get('email').value;
    this.myPerson.password = this.myForm.get('password').value;
    this.myPerson.nickName = this.myForm.get('nickName').value;
    this.service.postPerson(this.myPerson);
  }
}