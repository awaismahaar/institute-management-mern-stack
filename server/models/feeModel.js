const mongoose = require('mongoose');

const feeSchema = new mongoose.Schema({
    fullName : {
        type : String,
        required : true
    },
    phone : {
        type : String,
        required : true
    },
    amount : {
      type : Number,
      required : true  
    },
    remark : {
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

const Fee = mongoose.model('fee', feeSchema);
module.exports = Fee;