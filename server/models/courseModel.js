const mongoose = require('mongoose');

const courseSchema = new mongoose.Schema({
    courseName : {
        type : String,
        required : true
    },
    price : {
        type : Number,
        required : true
    },
    description : {
        type : String,
        required : true
    },
    startingDate : {
        type : String,
        required : true
    },
    endingDate : {
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
    id : {
        type : String,
        required : true
    }
})

const Course = mongoose.model('course', courseSchema);
module.exports = Course;