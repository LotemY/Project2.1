import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Person } from '../../../models/Person';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class ServiceService {
  public person: Person = new Person();
  constructor(private http: HttpClient, private router: Router) {
  }

  public postPerson(p: Person) {
    this.http.post<Person>("http://localhost:3600/signUp", p).
      subscribe(
        res => this.navigate(),
        err => {
          console.log(err);
          alert("Something is wrong");
        }
      )
  }

  public loginPerson(p: Person) {
    this.http.post<Person>("http://localhost:3600/login", p).
      subscribe(
        res => this.navigate(),
        err => {
          console.log(err);
          alert("Something is wrong");
        }
      )
  }

  public navigate() {
    this.router.navigate(['HomePage']);
  }
}