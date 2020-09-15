import { Injectable, EventEmitter } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Person } from './shared/models/Person';
import { Class } from './shared/models/Class';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})

/*
  -TASKS-
-- ofir jwt
-- class put + html
-- settings & validation
*/

export class ControllerService {

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

  public autoLogin() {
    if (localStorage.getItem('token')) {
      const header = {
        headers: new HttpHeaders().set(
          'token',
          localStorage.getItem('token')
        )
      };
      this.http.get<Person>(`${this.localHost}login`, header).
        subscribe(
          res => {
            if (res.nickName) {
              this.sNavigate(res);
            }
            else {
              this.tNavigate(res);
            }
          },
          err => console.log(err)
        );
    }
    else {
      console.log("there is no token");
    }
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
    this.http.post<Class>(`${this.localHost}teacherHP/${c.classTeacher}/newClass`, c).
      subscribe(
        res => {
          console.log(res);
        },
        err => {
          console.log(err);
          this.noAccess();
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
          console.log("User deleted");
          this.loginNavigate();
        },
        err => {
          console.log(err);
          this.noAccess();
        }
      )
  }
  public deleteStudent(p: Person) {
    this.http.delete(`${this.localHost}studentHP/${p._id}`, this.getToken(p)).
      subscribe(
        res => {
          console.log("User deleted")
          this.loginNavigate()
        },
        err => {
          console.log(err);
          this.noAccess();
        }
      )
  }

  public editTeacher(p: Person) {
    this.http.patch<Person>(`${this.localHost}teacherHP/${p._id}`, p, this.getToken(p)).
      subscribe(
        res => {
          this.teacherEmitter.emit(res);
          console.log("User edit")
          this.tNavigate(res)
        },
        err => {
          console.log(err);
          this.noAccess();
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
          this.noAccess();
        }
      )
  }

  public editClass(c: Class) {
    this.http.patch<Class>(`${this.localHost}teacherHP/${c.classTeacher}/tClass/${c._id}`, c).
      subscribe(
        res => {
          this.classEmitter.emit(res)
          console.log(res);
        },
        err => {
          console.log(err);
          this.noAccess();
        }
      )
  }

  public getStudent(p: Person) {
    this.http.get<Person>(`${this.localHost}studentHP/${p._id}`, this.getToken(p)).
      subscribe(res => this.sNavigate(res))
  }

  public getTeacher(p: Person) {
    this.http.get<Person>(`${this.localHost}teacherHP/${p._id}`, this.getToken(p)).
      subscribe(
        res => {
          console.log("ok")
          this.tNavigate(res)
        },
        err => {
          console.log("not ok")
        }
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
  public noAccess() {
    this.router.navigate(["NoAccess/"]);
  }

  public goCreateClass(id: String) {
    this.router.navigate([`teacherHP/${id}/newClass`]);
  }

  public goClass(id: String, cId: String) {
    this.router.navigate([`teacherHP/${id}/tClass/${cId}`]);
  }
}