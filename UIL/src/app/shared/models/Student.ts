import { SubPoints } from './SubPoints';
import { Reason } from './Reason';
export class Student {
    _id: String;
    firstName: String;
    lastName: String;
    subPoints?: Array<SubPoints>;
    reason: Array<Reason>;
    classPoints: number;
}