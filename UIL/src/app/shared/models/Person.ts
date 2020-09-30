import { Points } from './Points';
export class Person {
    _id: String;
    firstName: String;
    lastName: String;
    email: String;
    password: String;
    nickName?: String;
    token: string;
    points?: Array<Points>;
}