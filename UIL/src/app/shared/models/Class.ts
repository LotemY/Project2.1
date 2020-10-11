import { classSubject } from './classSubject';
import { Student } from './Student';

export class Class {
    _id: String;
    className: String;
    grade: String;
    classSubject: Array<classSubject>;
    classTeacher: String;
    classStudents: Array<Student>;
    rewards: Array<{ item: String, cost: Number }>
    img: String;
}