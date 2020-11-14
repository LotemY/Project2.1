import { Injectable, EventEmitter } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Person } from './shared/models/Person';
import { Class } from './shared/models/Class';
import { ClassSubject } from './shared/models/ClassSubject';
import { Router } from '@angular/router';
import { Student } from './shared/models/Student';

@Injectable({
  providedIn: 'root'
})

/*
  -TASKS-
  
  -token
  -css
  -create users
  -rewards css
  (button check)

*/

export class ControllerService {

  public person: Person = new Person();
  public info: ClassSubject = new ClassSubject();
  public studentInfo: String;
  public class: Class = new Class();
  public classArr: Class[] = [];
  public teacherEmitter: EventEmitter<Person> = new EventEmitter<Person>();
  public studentEmitter: EventEmitter<Person> = new EventEmitter<Person>();
  public classEmitter: EventEmitter<Class> = new EventEmitter<Class>();
  public classesEmitter: EventEmitter<Class[]> = new EventEmitter<Class[]>();
  public logInEmitter: EventEmitter<Boolean> = new EventEmitter<Boolean>();
  public infoEmitter: EventEmitter<ClassSubject> = new EventEmitter<ClassSubject>();


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
          alert("שגיאה ביצירת משתמש");
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
          alert("האימייל או הסיסמא שגויים");
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
    this.http.patch(`${this.localHost}api/teacherHP/${c.classTeacher}/tClass/${c._id}/edit`, c, this.getToken()).
      subscribe(
        res => {
          this.goTeacherClass(c.classTeacher, c._id);
        },
        err => {
          console.log(err);
          this.noAccess();
        }
      )
  }

  public updatePoints(c: Class) {
    this.http.patch(`${this.localHost}api/updatePoints/${c.classTeacher}`, c, this.getToken()).
      subscribe(
        res => { },
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
  public goTeacherClass(id: String, cId: String) {
    this.router.navigate([`teacherHP/${id}/tClass/${cId}`]);
  }
  public goStudentClass(id: String, cId: String) {
    this.router.navigate([`studentHP/${id}/sClass/${cId}`]);
  }
  public goEditClass(id: String, cId: String) {
    this.router.navigate([`teacherHP/${id}/tClass/${cId}/edit`]);
  }
  public serSettings() {
    this.router.navigate([`${this.person._id}/settings`]);
  }
  public goSubInfo(id: String, cId: String, info: String) {
    for (let i = 0; i < this.class.classSubject.length; i++)
      if (this.class.classSubject[i].name == info) {
        this.info = this.class.classSubject[i];
        break;
      }
    this.infoEmitter.emit(this.info);
    if (id == this.class.classTeacher)
      this.router.navigate([`teacherHP/${id}/tClass/${cId}/${info}`]);
    else
      this.router.navigate([`studentHP/${id}/sClass/${cId}/${info}`]);
  }

  //************************  FUNCTION  ************************//

  public removeElement(element: any, subsub?: String, classSub?: ClassSubject[], classStu?: Student[]): Array<any> {
    let tempCounter = 0;
    let i, j;

    if (Number(element)) {
      let temp: Student[] = [];
      for (i = 0; i < classStu.length; i++)
        if (classStu[i]._id != element) {
          temp[tempCounter] = classStu[i];
          tempCounter++;
        }
      return temp;  //Students[]
    }

    else {
      if (!subsub) {
        let temp: ClassSubject[] = [];
        for (i = 0; i < classSub.length; i++)
          if (classSub[i].name != element) {
            temp[tempCounter] = classSub[i];
            tempCounter++;
          }
        return temp;  //Subject[]
      }
      else {
        let temp: ClassSubject = new ClassSubject();
        temp.subsubject = [];
        for (i = 0; i < classSub.length; i++) {
          if (classSub[i].name == element) {
            temp.name = classSub[i].name;
            temp.points = classSub[i].points;
            for (j = 0; j < classSub[i].subsubject.length; j++)
              if (classSub[i].subsubject[j].name != subsub) {
                temp.subsubject[tempCounter] = classSub[i].subsubject[j];
                tempCounter++;
              }
            classSub[i] = temp;
            break;
          }
        }
        return classSub;
      }
    }
  }
}