const mongoose = require('mongoose');

const studentSchema = new mongoose.Schema({
    fullName : {
        type : String,
        required : true
    },
    email : {
        type : String,
        required : true
    },
    phone : {
        type : String,
        required : true
    },
    address : {
        type : String,
        required : true
    },
    imageUrl : {
        type : String,
        required : true
    },
    imageId : {
        type : String,
        required : true
    },
    courseId : {
        type : String,
        required : true
    },
    id : {
        type : String,
        required : true
    }
},{timestamps : true});

const Student = mongoose.model('student', studentSchema);
module.exports = Student;