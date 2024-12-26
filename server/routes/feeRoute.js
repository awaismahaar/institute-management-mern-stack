const express = require('express');
const Fee = require('../models/feeModel');
const { checkLogin } = require('../middlewares/checkAuth');
const Course = require('../models/courseModel');
const router = express.Router();

router.post("/add-fee" , checkLogin , (req,res) =>{
  const fee = new Fee({
    fullName : req.body.fullName,
    phone : req.body.phone,
    amount : req.body.amount,
    remark : req.body.remark,
    courseId : req.body.courseId,
    id : req.user.id
  })
  fee.save()
  .then((data) => {
      return res.status(200).json({
          success : true,
          message : "Fee Added Successfully",
          fee : data
      })
  })
  .catch((err) => {
      return res.status(500).json({
          success : false,
          message : "Something went wrong",
          error : err
      })
  })
})

router.get("/payment-history" , checkLogin , (req,res) =>{
    Fee.find({id : req.user.id})
    .then((data) => {
        console.log("courseId ", data);
        
    Course.findById(data.map((fee) => fee.courseId))
    .select("_id courseName")
    .then((course)=>{
        return res.status(200).json({
            success : true,
            message : "Fee Fetched Successfully",
            fee : data,
            course : course
        })
    })
    .catch((err) => {
        return res.status(500).json({
            success : false,
            message : "Something went wrong",
            error : err
        })
    })   
    })
})

router.get("/all-payments" , checkLogin , (req,res)=>{
    Fee.find({ id : req.user.id , courseId : req.query.courseId , phone : req.query.phone})
    .then((data) => {
        return res.status(200).json({
            message : "All payments Fetched Successfully",
            fee : data
        })
    })
    .catch((err) => {
        return res.status(500).json({
            message : "Something went wrong",
            error : err
        })
    })
})
module.exports = router;