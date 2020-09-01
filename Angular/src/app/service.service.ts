import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpHeaderResponse } from '@angular/common/http';
import { Person } from '../../../models/Person';
import { Class } from '../../../models/Class';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class ServiceService {
  public person: Person = new Person();
  public class: Class = new Class();
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

  public postClass(c: Class) {
    this.http.post<Class>("http://localhost:3600/", c).
      subscribe(
        res => console.log(res),
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

  public getUser() {
    this.http.get("http://localhost:3600/").
      subscribe(
        res => console.log(res),
        err => console.log("get error " + err.body)
      )
  }

  public navigate() {
    this.router.navigate(['HomePage']);
  }

}