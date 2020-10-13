import { subPoints } from './subPoints';
export class Student {
    _id: String;
    firstName: String;
    lastName: String;
    subPoints?: Array<subPoints>;
    classPoints: number;
}