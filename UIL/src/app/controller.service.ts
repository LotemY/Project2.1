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

-- teacher del
-- error to right response

-- get requests (teacher/student/class)
-- student
*/

export class ControllerService {

  public person: Person = new Person();
  public class: Class = new Class();
  public classArr: Class[] = [];
  public teacherEmitter: EventEmitter<Person> = new EventEmitter<Person>();
  public studentEmitter: EventEmitter<Person> = new EventEmitter<Person>();
  public classEmitter: EventEmitter<Class[]> = new EventEmitter<Class[]>();
  public localHost = "http://localhost:3600/";
  constructor(private http: HttpClient, private router: Router) {
  }

  public setToken(p: Person) {
    const header = {
      headers: new HttpHeaders().set(
        'token',
        p.token
      )
    };
    return header;
  }

  public getToken() {
    const header = {
      headers: new HttpHeaders().set(
        'token',
        localStorage.getItem('token')
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
              this.sNavigate(res._id, res);
            }
            else {
              this.tNavigate(res._id, res);
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
          this.classArr[this.classArr.length] = res;
          this.classEmitter.emit(this.classArr);
          this.tNavigate(c.classTeacher);
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
            this.sNavigate(res._id, res);
          }
          else {
            this.tNavigate(res._id, res);
          }
        },
        err => {
          console.log(err);
          alert("Something is wrong");
        }
      )
  }

  public deleteTeacher(p: Person) {
    this.http.delete(`${this.localHost}teacherHP/${p._id}`, this.setToken(p)).
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
    this.http.delete(`${this.localHost}studentHP/${p._id}`, this.setToken(p)).
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
    this.http.patch(`${this.localHost}teacherHP/${p._id}/settings`, p, this.setToken(p)).
      subscribe(
        res => {
          console.log("User edit")
          this.tNavigate(p._id)
        },
        err => {
          console.log(err);
          this.noAccess();
        }
      )
  }

  public editStudent(p: Person) {
    this.http.patch(`${this.localHost}studentHP/${p._id}`, this.setToken(p)).
      subscribe(
        res => {
          console.log("User edit")
          this.sNavigate(p._id)
        },
        err => {
          console.log(err);
          this.noAccess();
        }
      )
  }

  public editClass(c: Class) {
    this.http.patch<Class>(`${this.localHost}teacherHP/${c.classTeacher}/tClass/${c._id}/edit`, c).
      subscribe(
        res => {
          let i = 0
          for (i = 0; this.classArr[i]._id != c._id; i++);
          this.classArr[i] = c;
          this.classEmitter.emit(this.classArr);
          this.goClass(c.classTeacher, c._id);
        },
        err => {
          console.log(err);
          this.noAccess();
        }
      )
  }

  public deleteClass(c: Class) {
    this.http.delete(`${this.localHost}teacherHP/${c.classTeacher}/tClass/${c._id}/edit`).
      subscribe(
        res => {
          console.log("Class deleted");
          this.tNavigate(c.classTeacher);
        },
        err => {
          console.log(err);
          this.noAccess();
        }
      )
  }

  public getStudent(p: Person) {
    this.http.get<Person>(`${this.localHost}studentHP/${p._id}`, this.setToken(p)).
      subscribe(res => this.sNavigate(res._id, res))
  }

  public getTeacher(p: Person) {
    this.http.get<Person>(`${this.localHost}teacherHP/${p._id}`, this.setToken(p)).
      subscribe(
        res => {
          console.log("ok")
          this.tNavigate(res._id, res)
        },
        err => {
          console.log("not ok")
        }
      )
  }

  public tNavigate(id: String, p?: Person) {
    if (p) {
      this.person = p;
      this.teacherEmitter.emit(this.person);
      this.router.navigate([`teacherHP/${p._id}`]);
    }
    else
      this.router.navigate([`teacherHP/${id}`]);
  }

  public sNavigate(id: String, p?: Person) {
    if (p) {
      this.person = p;
      this.studentEmitter.emit(this.person);
      this.router.navigate([`studentHP/${p._id}`]);
    }
    else
      this.router.navigate([`studentHP/${id}`]);
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
  public goEditClass(id: String, cId: String) {
    this.router.navigate([`teacherHP/${id}/tClass/${cId}/edit`]);
  }
  public goSettings(id: String) {
    this.router.navigate([`teacherHP/${id}/settings`]);
  }
}