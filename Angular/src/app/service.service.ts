import { Injectable } from '@angular/core';
import { mongoose } from 'mongoose';
import { userPostSchema } from '../../../http/Post';
import { HttpClient } from '@angular/common/http';
import { Person } from '../../../models/Person';

@Injectable({
  providedIn: 'root'
})
export class ServiceService {
  public person: Person = new Person();

  constructor(private http: HttpClient) {

  }
  public postPerson(p: Person) {
    this.http.post<Person>("http://localhost:3500/", p).
      subscribe(
        res => this.person = res,
        err => console.log(err)
      )
  }


}
