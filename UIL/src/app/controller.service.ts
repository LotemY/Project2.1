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

-- error to right response
   *refrash token*
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
  public logInEmitter: EventEmitter<Boolean> = new EventEmitter<Boolean>();

  private localHost = "http://localhost:3600/";
  constructor(private http: HttpClient, private router: Router) {
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
      this.http.get<Person>(`${this.localHost}api/user/${localStorage.getItem('userI')}`, this.getToken()).
        subscribe(
          res => {
            if (res.nickName) {
              this.sNavigate(res._id, res);
            }
            else {
              this.tNavigate(res._id, res);
            }
          },
          err => { }
        );
    }
  }

  public logOut() {
    localStorage.removeItem('token');
    localStorage.removeItem('userI');
    this.logInEmitter.emit(false);
    this.loginNavigate();
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

  public loginPerson(p: Person) {
    this.http.post<Person>(`${this.localHost}api/login`, p).
      subscribe(
        res => {
          localStorage.setItem("token", res.token);
          localStorage.setItem("userI", String(res._id));
          this.logInEmitter.emit(true);

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

  public postClass(c: Class) {
    this.http.post<Class>(`${this.localHost}api/teacherHP/${c.classTeacher}/newClass`, c, this.getToken()).
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

  //************************  DELETE  ************************//

  public deleteUser(p: Person) {
    this.http.delete(`${this.localHost}api/user/${p._id}/delete`, this.getToken()).
      subscribe(
        res => {
          localStorage.removeItem('token');
          localStorage.removeItem('userI');
          console.log("User deleted");
          this.loginNavigate();
        },
        err => {
          console.log(err);
          this.noAccess();
        }
      )
  }

  public deleteClass(c: Class) {
    this.http.delete(`${this.localHost}api/teacherHP/${c.classTeacher}/tClass/${c._id}/edit`, this.getToken()).
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


  public editUser(p: Person) {
    this.http.patch(`${this.localHost}api/user/${p._id}/settings/edit`, p, this.getToken()).
      subscribe(
        res => {
          console.log("User edit");
          if (p.nickName)
            this.sNavigate(p._id);
          else
            this.tNavigate(p._id);
        },
        err => {
          console.log(err);
          this.noAccess();
        }
      )
  }

  public editClass(c: Class) {
    this.http.patch<Class>(`${this.localHost}api/teacherHP/${c.classTeacher}/tClass/${c._id}/edit`, c, this.getToken()).
      subscribe(
        res => {
          let i;
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

  public getUser(id: String) {
    this.http.get<Person>(`${this.localHost}api/user/${id}`, this.getToken()).
      subscribe(
        res => {
          this.logInEmitter.emit(true);
          if (res.nickName)
            this.studentEmitter.emit(res);
          else
            this.teacherEmitter.emit(res);
          this.person = res;
        },
        err => {
          this.noAccess();
        }
      )
  }

  public getClasses(id: String) {
    this.http.get<Class[]>(`${this.localHost}api/user/${id}/classes`, this.getToken()).
      subscribe(
        res => {
          this.logInEmitter.emit(true);
          this.classArr = res;
          this.classesEmitter.emit(res);
        },
        err => {
          this.noAccess();
        }
      )
  }

  public getClass(id: String, cId: String) {
    this.http.get<Class>(`${this.localHost}api/user/${id}/class/${cId}`, this.getToken()).
      subscribe(
        res => {
          this.logInEmitter.emit(true);
          this.class = res;
          this.classEmitter.emit(res);
        },
        err => {
          this.noAccess();
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
    let id = localStorage.getItem('userI')
    this.router.navigate([`NoAccess/${id}`]);
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
  public serSettings() {
    this.router.navigate([`${this.person._id}/settings`]);
  }
}