import { TotalPoints } from './TotalPoints'
export class Person {
    _id: String;
    firstName: String;
    lastName: String;
    email: String;
    password: String;
    token: string;
    nickName?: String;
    classPoints?: Array<{ id: Number, points: Number }>;
    totalPoints?: TotalPoints;
}