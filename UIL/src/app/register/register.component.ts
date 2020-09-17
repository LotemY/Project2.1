import { Component, OnInit } from '@angular/core';
import { ControllerService } from '../controller.service'
import { Person } from '../shared/models/Person';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})

export class RegisterComponent implements OnInit {

  public sId = 1000;
  public tId = 1000;
  public myPerson: Person;
  public personForm: FormGroup;
  public submitted = false;

  constructor(private service: ControllerService, private fb: FormBuilder) {
    this.myPerson = this.service.person;
  }

  ngOnInit() {
    this.personForm = this.fb.group({
      firstName: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(8)]],
      lastName: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(8)]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6), Validators.maxLength(11), Validators.pattern('^(?=.*[0-9])(?=.*[a-zA-Z])([a-zA-Z0-9]+)$')]],
      isStudent: [false],
      nickName: ['', [Validators.minLength(3), Validators.maxLength(8)]]
    })
  }

  get f() {
    return this.personForm.controls;
  }

  onSubmit() {
    this.submitted = true;

    if (this.personForm.invalid) 
      return;
    
    this.myPerson.firstName = this.personForm.get('firstName').value;
    this.myPerson.lastName = this.personForm.get('lastName').value;
    this.myPerson.email = this.personForm.get('email').value;
    this.myPerson.password = this.personForm.get('password').value;
    if (this.personForm.get('isStudent').value) {
      this.myPerson._id = String(this.sId);
      this.sId++;
      if (this.personForm.get('nickName').value == "")
        this.myPerson.nickName = this.myPerson.firstName;
      else
        this.myPerson.nickName = this.personForm.get('nickName').value;
    }
    else {
      this.myPerson._id = String(this.tId) + "t";
      this.tId++;
    }

    this.service.postPerson(this.myPerson);
  }
}
