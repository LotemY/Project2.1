import { ClassSubject } from './ClassSubject';
import { Student } from './Student';

export class Class {
    _id: String;
    className: String;
    grade: String;
    classSubject: Array<ClassSubject>;
    classTeacher: String;
    classStudents: Array<Student>;
    rewards: Array<{ item: String, cost: Number }>
    img: String;
}