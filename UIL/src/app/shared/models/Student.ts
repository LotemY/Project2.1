export class Student {
    _id: String;
    firstName: String;
    lastName: String;
    nickName?: String;
    points?: Array<{ name: String, points: Number }>;
}