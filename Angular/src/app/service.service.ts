import { Injectable, EventEmitter } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Person } from '../../../models/Person';
import { Class } from '../../../models/Class';
import { Router } from '@angular/router';
import { ParsedPropertyType } from '@angular/compiler';

@Injectable({
  providedIn: 'root'
})

/*
  -TASKS-
-- ofir jwt
-- class CRUD
-- settings & validation
*/

export class ServiceService {
  public person: Person = new Person();
  public class: Class = new Class();
  public teacherEmitter: EventEmitter<Person> = new EventEmitter<Person>();
  public studentEmitter: EventEmitter<Person> = new EventEmitter<Person>();
  public classEmitter: EventEmitter<Class> = new EventEmitter<Class>();
  public localHost = "http://localhost:3600/";
  constructor(private http: HttpClient, private router: Router) {
  }

  public getToken(p: Person) {
    const header = {
      headers: new HttpHeaders().set(
        'token',
        p.token
      )
    };
    return header;
  }


  public postPerson(p: Person) {
    this.http.post(`${this.localHost}register`, p).
      subscribe(
        res => {
          this.loginNavigate();
        },
        err => {
          console.log(err);
          alert("Something is wrong");
        }
      )
  }

  public postClass(c: Class) {
    this.http.post<Class>(this.localHost, c).
      subscribe(
        res => console.log(res),
        err => {
          console.log(err);
          alert("Something is wrong");
        }
      )
  }

  public loginPerson(p: Person) {
    this.http.post<Person>(`${this.localHost}login`, p).
      subscribe(
        res => {
          localStorage.setItem("token", res.token);
          if (res.nickName) {
            this.sNavigate(res);
          }
          else {
            this.tNavigate(res);
          }
        },
        err => {
          console.log(err);
          alert("Something is wrong");
        }
      )
  }

  public deleteTeacher(p: Person) {
    this.http.delete(`${this.localHost}teacherHP/${p._id}`, this.getToken(p)).
      subscribe(
        res => {
          console.log("User deleted")
          this.loginNavigate()
        },
        err => console.log(err)
      )
  }
  public deleteStudent(p: Person) {
    this.http.delete(`${this.localHost}studentHP/${p._id}`, this.getToken(p)).
      subscribe(
        res => {
          console.log("User deleted")
          this.loginNavigate()
        },
        err => console.log(err)
      )
  }

  public editTeacher(p: Person) {
    this.http.patch<Person>(`${this.localHost}teacherHP/${p._id}`, p, this.getToken(p)).
      subscribe(
        res => {
          console.log("User edit")
          this.tNavigate(res)
        },
        err => {
          console.log(err);
          alert("Something is wrong");
        }
      )
  }

  public editStudent(p: Person) {
    this.http.patch<Person>(`${this.localHost}studentHP/${p._id}`, this.getToken(p)).
      subscribe(
        res => {
          this.studentEmitter.emit(res);
          console.log("User edit")
          this.sNavigate(res)
        },
        err => {
          console.log(err);
          alert("Something is wrong");
        }
      )
  }

  public getStudent(p: Person) {
    const header = {
      headers: new HttpHeaders().set(
        'token',
        p.token
      )
    };
    this.http.get<Person>(`${this.localHost}studentHP/${p._id}`, header).
      subscribe(
        res => this.studentEmitter.emit(res),
        err => console.log(err)
      )
  }

  public getTeacher(p: Person) {
    const header = {
      headers: new HttpHeaders().set(
        'token',
        p.token
      )
    };
    this.http.get<Person>(`${this.localHost}teacherHP/${p._id}`, header).
      subscribe(
        res => this.teacherEmitter.emit(res),
        err => console.log(err)
      )
  }

  public tNavigate(p: Person) {
    this.person = p;
    this.teacherEmitter.emit(this.person);
    this.router.navigate([`teacherHP/${p._id}`]);
  }
  public sNavigate(p: Person) {
    this.person = p;
    this.studentEmitter.emit(this.person);
    this.router.navigate([`studentHP/${p._id}`]);
  }
  public loginNavigate() {
    this.router.navigate(["login/"]);
  }

}