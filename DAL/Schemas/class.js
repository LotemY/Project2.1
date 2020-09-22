const mongoose = require('mongoose');

const classPostSchema = mongoose.Schema({
    _id: {
        type: String,
        required: true
    },
    className: {
        type: String,
        required: true
    },
    grade: {
        type: String,
        required: true
    },
    classSubject: {
        type: Array,
    },
    classTeacher: {
        type: String,
        required: true
    },
    classStudents: {
        type: Array
    }
});

let classSchema = mongoose.model('class', classPostSchema, "class");

module.exports = classSchema;
