import { classSubject } from './classSubject';
import { Person } from './Person';

export class Class {
    _id: String;
    className: String;
    grade: String;
    classSubject: Array<classSubject>;
    classTeacher: String;
    classStudents: Array<Person>;
}