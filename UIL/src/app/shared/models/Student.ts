export class Student {
    _id: String;
    firstName: String;
    lastName: String;
    subPoints?: Array<{ subName: String, points: Number }>;
    classPoints: Number;
}