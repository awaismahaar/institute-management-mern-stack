const express = require("express");
const { checkLogin } = require("../middlewares/checkAuth");
const Course = require("../models/courseModel");
const cloudinary = require("cloudinary").v2;
var jwt = require("jsonwebtoken");
const Student = require("../models/studentModel");
const Fee = require("../models/feeModel");
const router = express.Router();
cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.API_KEY,
  api_secret: process.env.API_SECRET,
});
router.post("/add-course", checkLogin, (req, res) => {
  console.log(req.body);
  var decoded = jwt.verify(
    req.headers.authorization.split(" ")[1],
    process.env.JWT_SECRET
  );
  cloudinary.uploader.upload(req.files.image.tempFilePath, (err, result) => {
    if (err) {
      console.log(err);
    }
    const course = new Course({
      courseName: req.body.courseName,
      price: req.body.price,
      description: req.body.description,
      startingDate: req.body.startingDate,
      endingDate: req.body.endingDate,
      imageUrl: result.secure_url,
      imageId: result.public_id,
      id: decoded.id,
    });
    course
      .save()
      .then((result) => {
        return res.status(200).json({
          success: true,
          message: "Course Added Successfully",
          course: result,
        });
      })
      .catch((err) => {
        return res.status(500).json({
          success: false,
          message: "Error Occured in adding a new course",
          error: err,
        });
      });
  });
});

router.get("/get-courses", (req, res) => {  
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) {
    return res.status(401).json({ message: "Authorization token required" });
  }
  var decoded = jwt.verify(
    token,
    process.env.JWT_SECRET
  );
  Course.find({ id: decoded.id })
    .then((result) => {
      return res.status(200).json({
        success: true,
        message: "Courses Fetched Successfully",
        courses: result,
      });
    })
    .catch((err) => {
      return res.status(500).json({
        success: false,
        message: "Error Occured in fetching courses",
        error: err,
      });
    });
});

router.get("/courses-name", (req, res) => {  
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) {
    return res.status(401).json({ message: "Authorization token required" });
  }
  var decoded = jwt.verify(
    token,
    process.env.JWT_SECRET
  );
  Course.find({ id: decoded.id })
  .select("_id courseName")
    .then((result) => {
      return res.status(200).json({
        success: true,
        message: "Courses Fetched Successfully",
        courses: result,
      });
    })
    .catch((err) => {
      return res.status(500).json({
        success: false,
        message: "Error Occured in fetching courses",
        error: err,
      });
    });
});
router.get("/get-course/:id", (req, res) => {
  Course.findOne({ _id: req.params.id })
    .then((result) => {
      Student.find({ courseId: req.params.id })
        .then((students) => {
          return res.status(200).json({
            success: true,
            message: "Course Fetched Successfully",
            courseDetails: result,
            students : students
          });
      })
     
    })
    .catch((err) => {
      return res.status(500).json({
        success: false,
        message: "Error Occured in fetching course",
        error: err,
      });
    });
});

router.delete("/delete-course/:id", checkLogin, async (req, res) => {
  try {
    const token = req.headers.authorization.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Find the course by ID
    const course = await Course.findById(req.params.id);
    if (!course) {
      return res.status(404).json({
        success: false,
        message: "Course not found",
      });
    }

    // Check if the user is authorized to delete the course
    if (course.id !== decoded.id) {
      return res.status(401).json({
        success: false,
        message: "You are not authorized to delete this course",
      });
    }

    // Delete the course by ID
    const deletedCourse = await Course.findByIdAndDelete(req.params.id);

    // Delete the image from Cloudinary
    await cloudinary.uploader.destroy(course.imageId);

   // Delete all students associated with the course
   await Student.deleteMany({ courseId: req.params.id });
    // Send success response
    return res.status(200).json({
      success: true,
      message: "Course deleted successfully",
      course: deletedCourse,
    });
  } catch (error) {
    // Handle token verification error
    if (error.name === "JsonWebTokenError") {
      return res.status(401).json({
        success: false,
        message: "Invalid token",
        error: error.message,
      });
    }
    // Handle other errors
    return res.status(500).json({
      success: false,
      message: "An error occurred while deleting the course",
      error: error.message,
    });
  }
});


router.put("/update-course/:id", checkLogin, (req, res) => {
  console.log("User Id", req.user);
  try {
    Course.findById({ _id: req.params.id })
      .then((course) => {
        if (!course) {
          return res.status(404).json({
            success: false,
            message: "Course not found",
          });
        }

        // Check if the logged-in user is authorized to update the course
        if (course.id !== req.user.id) {
          return res.status(401).json({
            success: false,
            message: "You are not authorized to update this course",
          });
        }

        // Update logic if authorized
        if (req.files) {
          cloudinary.uploader.destroy(course.imageUrl, () => {
            cloudinary.uploader.upload(
              req.files.image.tempFilePath,
              (err, result) => {
                if (err) {
                  return res.status(500).send({
                    success: false,
                    message: "Error occurred while uploading image",
                    error: err,
                  });
                }
                Course.findByIdAndUpdate(
                  { _id: req.params.id },
                  {
                    courseName: req.body.courseName,
                    price: req.body.price,
                    description: req.body.description,
                    startingDate: req.body.startingDate,
                    endingDate: req.body.endingDate,
                    imageUrl: result.secure_url,
                    imageId: result.public_id,
                    id: req.user.id,
                  },
                  { new: true }
                )
                  .then((result) => {
                    return res.status(200).json({
                      success: true,
                      message: "Course updated successfully",
                      course: result,
                    });
                  })
                  .catch((err) => {
                    return res.status(500).json({
                      success: false,
                      message: "Error occurred while updating course",
                      error: err,
                    });
                  });
              }
            );
          });
        } else {
          Course.findByIdAndUpdate(
            { _id: req.params.id },
            {
              courseName: req.body.courseName,
              price: req.body.price,
              description: req.body.description,
              startingDate: req.body.startingDate,
              endingDate: req.body.endingDate,
              imageUrl: course.imageUrl,
              imageId: course.imageId,
              id: req.user.id,
            },
            { new: true }
          )
            .then((result) => {
              return res.status(200).json({
                success: true,
                message: "Course updated successfully",
                course: result,
              });
            })
            .catch((err) => {
              return res.status(500).json({
                success: false,
                message: "Error occurred while updating course",
                error: err,
              });
            });
        }
      })
      .catch((err) => {
        return res.status(500).json({
          success: false,
          message: "Error occurred while finding course",
          error: err,
        });
      });
  } catch (err) {
    return res.status(401).json({
      success: false,
      message: "Invalid token",
      error: err,
    });
  }
});

router.get("/latest-courses" , checkLogin , (req,res)=>{
  Course.find({}).sort({$natural : -1}).limit(5)
  .then((result) => {
      return res.status(200).json({
        success: true,
        message: "Courses fetched successfully",
        courses: result,
      });
  })
  .catch((err) => {
      return res.status(500).json({
        success: false,
        message: "Error occurred while fetching courses",
        error: err,
      });
  })
})

router.get("/home", checkLogin, async (req, res) => {
  try {
    const latestCourses = await Course.find({id : req.user.id}).sort({$natural : -1}).limit(5)
    const latestStudents = await Student.find({id : req.user.id}).sort({$natural : -1}).limit(5)
    const totalCourses = await Course.countDocuments({id : req.user.id})
    const totalStudents = await Student.countDocuments({id : req.user.id})
    const total = await Fee.aggregate([
      {$match : {id : req.user.id}},
      {$group : {_id : null , total : { $sum : "$amount"}}},
    ])
    return res.status(200).json({
      success: true,
      message: "Home data fetched successfully",
      latestCourses : latestCourses,
      latestStudents : latestStudents,
      totalCourses : totalCourses,
      totalStudents : totalStudents,
      total : total.length > 0 ? total[0].total : 0, 
    })
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Error occurred while fetching Home data",
      error: err,
    });
  }
})
module.exports = router;
