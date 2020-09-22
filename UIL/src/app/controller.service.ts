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
-- class get
-- auto login
-- token + auth

-- teacher del

-- error to right response

-- student
*/

export class ControllerService {

  public person: Person = new Person();
  public class: Class = new Class();
  public classArr: Class[] = [];
  public teacherEmitter: EventEmitter<Person> = new EventEmitter<Person>();
  public studentEmitter: EventEmitter<Person> = new EventEmitter<Person>();
  public classEmitter: EventEmitter<Class> = new EventEmitter<Class>();
  public classesEmitter: EventEmitter<Class[]> = new EventEmitter<Class[]>();
  private localHost = "http://localhost:3600/";
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
      this.http.get<Person>(`${this.localHost}api/login`, header).
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


  //************************  POST  ************************//

  public postPerson(p: Person) {
    this.http.post(`${this.localHost}api/register`, p).
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
    this.http.post<Class>(`${this.localHost}api/teacherHP/${c.classTeacher}/newClass`, c).
      subscribe(
        res => {
          this.classArr[this.classArr.length] = res;
          this.classesEmitter.emit(this.classArr);
          this.tNavigate(c.classTeacher);
        },
        err => {
          console.log(err);
          this.noAccess();
        }
      )
  }

  public loginPerson(p: Person) {
    this.http.post<Person>(`${this.localHost}api/login`, p).
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

  //************************  DELETE  ************************//

  public deleteTeacher(p: Person) {
    this.http.delete(`${this.localHost}api/teacherHP/${p._id}`, this.setToken(p)).
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
    this.http.delete(`${this.localHost}api/studentHP/${p._id}`, this.setToken(p)).
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

  public deleteClass(c: Class) {
    this.http.delete(`${this.localHost}api/teacherHP/${c.classTeacher}/tClass/${c._id}/edit`).
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

  //************************  PATCH  ************************//


  public editTeacher(p: Person) {
    this.http.patch(`${this.localHost}api/teacherHP/${p._id}/settings`, p, this.setToken(p)).
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
    this.http.patch(`${this.localHost}api/studentHP/${p._id}`, this.setToken(p)).
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
    this.http.patch<Class>(`${this.localHost}api/teacherHP/${c.classTeacher}/tClass/${c._id}/edit`, c).
      subscribe(
        res => {
          let i = 0
          for (i = 0; this.classArr[i]._id != c._id; i++);
          this.classArr[i] = c;
          this.classesEmitter.emit(this.classArr);
          this.goClass(c.classTeacher, c._id);
        },
        err => {
          console.log(err);
          this.noAccess();
        }
      )
  }

  //************************  GET  ************************//

  public getStudent() {
    this.http.get<Person>(`${this.localHost}api/user`, this.getToken()).
      subscribe(
        res => {
          this.studentEmitter.emit(res);
        },
        err => {
          console.log("not ok");
        }
      )
  }

  public getTeacher() {
    this.http.get<Person>(`${this.localHost}api/user`, this.getToken()).
      subscribe(
        res => {
          this.teacherEmitter.emit(res);
        },
        err => {
          console.log("not ok");
        }
      )
  }

  public getClasses() {
    this.http.get<Class[]>(`${this.localHost}api/classes`, this.getToken()).
      subscribe(
        res => {
          this.classArr = res;
          this.classesEmitter.emit(res);
        },
        err => {
          console.log("not ok");
        }
      )
  }

  public getClass(cId: String) {
    this.http.get<Class>(`${this.localHost}api/class/${cId}`, this.getToken()).
      subscribe(
        res => {
          this.class = res;
          this.classEmitter.emit(res);
        },
        err => {
          console.log("not ok");
        }
      )
  }

  //************************  NAV  ************************//

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