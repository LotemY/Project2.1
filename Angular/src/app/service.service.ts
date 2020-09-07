import { Injectable, EventEmitter } from '@angular/core';
import { HttpClient, HttpHeaders, HttpHeaderResponse } from '@angular/common/http';
import { Person } from '../../../models/Person';
import { Class } from '../../../models/Class';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})

/*
  -TASKS-
-- ofir jwt
-- finish user CRUD
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

  public postPerson(p: Person) {
    this.http.post<Person>(`${this.localHost}register`, p).
      subscribe(
        res => {
          if (res.nickName)
            this.sNavigate(res._id);
          else
            this.tNavigate(res._id);
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
          if (res.nickName)
            this.sNavigate(res._id);
          else
            this.tNavigate(res._id);
          err => {
            console.log(err);
            alert("Something is wrong");
          }
        }
      )
  }
  public deleteTeacher(id: String) {
    this.http.delete(`${this.localHost}teacherHP/${id}`).
      subscribe(
        res => {
          console.log("User deleted")
          this.loginNavigate()
        },
        err => console.log(err)
      )
  }
  public deleteStudent(id: String) {
    this.http.delete(`${this.localHost}studentHP/${id}`).
      subscribe(
        res => {
          console.log("User deleted")
          this.loginNavigate()
        },
        err => console.log(err)
      )
  }
  /*
   public deleteClass() {
     this.http.delete(this.localHost).
       subscribe(
         res => this.navigate(),
         err => {
           console.log(err);
           alert("Something is wrong");
         }
       )
   }
 */

  public editTeacher(p: Person) {
    this.http.patch(`${this.localHost}teacherHP/${p._id}`, p).
      subscribe(
        res => {
          console.log("User edit")
          this.tNavigate(p._id)
        },
        err => {
          console.log(err);
          alert("Something is wrong");
        }
      )
  }
  public editStudent(p: Person) {
    this.http.put(`${this.localHost}studentHP/${p._id}`, p).
      subscribe(
        res => {
          console.log("User edit")
          this.sNavigate(p._id)
        },
        err => {
          console.log(err);
          alert("Something is wrong");
        }
      )
  }

  public getStudent(id: String) {
    this.http.get<Person>(`${this.localHost}studentHP/${id}`).
      subscribe(
        res => this.studentEmitter.emit(res),
        err => console.log(err)
      )

  }
  public getTeacher(id: String) {
    this.http.get<Person>(`${this.localHost}teacherHP/${id}`).
      subscribe(
        res => this.teacherEmitter.emit(res),
        err => console.log(err)
      )
  }

  public tNavigate(id: String) {
    this.router.navigate([`teacherHP/${id}`]);
  }
  public sNavigate(id: String) {
    this.router.navigate([`studentHP/${id}`]);
  }
  public loginNavigate() {
    this.router.navigate(["login/"]);
  }

}