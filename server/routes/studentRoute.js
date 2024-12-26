const express = require("express");
const { checkLogin } = require("../middlewares/checkAuth");
const Student = require("../models/studentModel");
const Fee = require("../models/feeModel");
const Course = require("../models/courseModel");
const router = express.Router();
const cloudinary = require("cloudinary").v2;

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.API_KEY,
  api_secret: process.env.API_SECRET,
});
router.post("/add-student", checkLogin, (req, res) => {
  console.log(req.body);

  cloudinary.uploader.upload(req.files.image.tempFilePath, (err, result) => {
    if (err) {
      console.log(err);
    }
    const student = new Student({
      fullName: req.body.fullName,
      email: req.body.email,
      phone: req.body.phone,
      address: req.body.address,
      imageUrl: result.secure_url,
      imageId: result.public_id,
      courseId: req.body.courseId,
      id: req.user.id,
    });
    student
      .save()
      .then((result) => {
        return res.status(200).json({
          success: true,
          message: "Student Added Successfully",
          student: result,
        });
      })
      .catch((err) => {
        return res.status(500).json({
          success: false,
          message: "Error Occured in adding a new student",
          error: err,
        });
      });
  });
});

router.get("/get-students", checkLogin, (req, res) => {
  Student.find({ id: req.user.id })
    .then((result) => {
      return res.status(200).json({
        success: true,
        message: "students Fetched Successfully",
        students: result,
      });
    })
    .catch((err) => {
      return res.status(500).json({
        success: false,
        message: "Error Occured in fetching students",
        error: err,
      });
    });
});

router.get("/student-details/:id", checkLogin, async (req, res) => {
  try {
    console.log("id:", req.params.id);

    // Find the student by ID
    const student = await Student.findById(req.params.id);
    if (!student) {
      return res.status(404).json({
        success: false,
        message: "Student not found",
      });
    }

    // Fetch fee details based on user ID, course ID, and phone
    const feeDetails = await Fee.find({
      id: req.user.id,
      courseId: student.courseId,
      phone: student.phone,
    });

    // Fetch course details based on the student's course ID
    const courseDetail = await Course.findById(student.courseId)
    .select("_id courseName");

    // Send response with all details
    return res.status(200).json({
      success: true,
      message: "Student Details Fetched Successfully",
      student: student,
      feeDetails: feeDetails,
      courseDetail: courseDetail,
    });
  } catch (err) {
    console.error("Error fetching student details:", err);
    return res.status(500).json({
      success: false,
      message: "Error occurred in fetching student details",
      error: err.message,
    });
  }
});

router.get("/get-students/:courseId", checkLogin, (req, res) => {
  Student.find({ id: req.user.id, courseId: req.params.courseId })
    .select("id _id fullName email phone address")
    .then((result) => {
      return res.status(200).json({
        success: true,
        message: "students Fetched Successfully",
        students: result,
      });
    })
    .catch((err) => {
      return res.status(500).json({
        success: false,
        message: "Error Occured in fetching students",
        error: err,
      });
    });
});

router.delete("/delete-student/:id", checkLogin, (req, res) => {
  try {
    Student.findById({ _id: req.params.id })
      .then((student) => {
        if (!student) {
          return res.status(404).json({
            success: false,
            message: "Student not found",
          });
        }
        if (student.id !== req.user.id) {
          return res.status(401).json({
            success: false,
            message: "You are not authorized to delete this student",
          });
        }

        Student.findByIdAndDelete({ _id: req.params.id }).then((result) => {
          cloudinary.uploader.destroy(student.imageId, (deleteImage) => {
            return res.status(200).json({
              success: true,
              message: "student Deleted Successfully",
              student: result,
            });
          });
        });
      })
      .catch((err) => {
        return res.status(500).json({
          success: false,
          message: "Error Occured in delete student",
          error: err,
        });
      });
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: "Invalid token",
      error: error,
    });
  }
});

router.put("/update-student/:id", checkLogin, (req, res) => {
  console.log("ID", req.body);

  try {
    Student.findById({ _id: req.params.id })
      .then((student) => {
        if (!student) {
          return res.status(404).json({
            success: false,
            message: "Student not found",
          });
        }

        // Check if the logged-in user is authorized to update the course
        if (student.id !== req.user.id) {
          return res.status(401).json({
            success: false,
            message: "You are not authorized to update this student",
          });
        }

        // Update logic if authorized
        if (req.files) {
          cloudinary.uploader.destroy(student.imageUrl, () => {
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
                Student.findByIdAndUpdate(
                  { _id: req.params.id },
                  {
                    fullName: req.body.fullName,
                    email: req.body.email,
                    phone: req.body.phone,
                    address: req.body.address,
                    imageUrl: result.secure_url,
                    imageId: result.public_id,
                    courseId: req.body.courseId,
                    id: req.user.id,
                  },
                  { new: true }
                )
                  .then((result) => {
                    return res.status(200).json({
                      success: true,
                      message: "Student updated successfully",
                      student: result,
                    });
                  })
                  .catch((err) => {
                    return res.status(500).json({
                      success: false,
                      message: "Error occurred while updating student",
                      error: err,
                    });
                  });
              }
            );
          });
        } else {
          Student.findByIdAndUpdate(
            { _id: req.params.id },
            {
              fullName: req.body.fullName,
              email: req.body.email,
              phone: req.body.phone,
              address: req.body.address,
              imageUrl: student.imageUrl,
              imageId: student.imageId,
              courseId: req.body.courseId,
              id: req.user.id,
            },
            { new: true }
          )
            .then((result) => {
              return res.status(200).json({
                success: true,
                message: "Student updated successfully",
                student: result,
              });
            })
            .catch((err) => {
              return res.status(500).json({
                success: false,
                message: "Error occurred while updating student",
                error: err,
              });
            });
        }
      })
      .catch((err) => {
        return res.status(500).json({
          success: false,
          message: "Error occurred while finding student",
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

router.get("/latest-students", checkLogin, (req, res) => {
  Student.find({})
    .sort({ createdAt: -1 })
    .limit(5)
    .then((result) => {
      return res.status(200).json({
        success: true,
        message: "Students fetched successfully",
        students: result,
      });
    })
    .catch((err) => {
      return res.status(500).json({
        success: false,
        message: "Error occurred while fetching students",
        error: err,
      });
    });
});
module.exports = router;
