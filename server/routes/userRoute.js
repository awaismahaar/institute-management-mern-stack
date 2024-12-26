const express = require("express");
const User = require("../models/userModel");
const router = express.Router();
const cloudinary = require("cloudinary").v2;
var jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
require("dotenv").config();
cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.API_KEY,
  api_secret: process.env.API_SECRET,
});

router.post("/signup", (req, res) => {
  // Check if user already exists
  User.findOne({ email: req.body.email })
    .then((existingUser) => {
      if (existingUser) {
        return res.status(409).send({
          success: false,
          message: "User already exists",
        });
      }

      // Upload image to Cloudinary
      cloudinary.uploader.upload(req.files.image.tempFilePath, (err, result) => {
        if (err) {
          return res.status(500).send({
            success: false,
            message: "Image upload failed",
            err,
          });
        }

        // Hash the password
        bcrypt.hash(req.body.password, 10, (err, hash) => {
          if (err) {
            return res.status(500).send({
              success: false,
              message: "Password hashing failed",
              err,
            });
          }

          // Create new user
          const user = new User({
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            email: req.body.email,
            password: hash,
            imageUrl: result.secure_url,
            imageId: result.public_id,
          });

          // Save user to database
          user
            .save()
            .then((savedUser) => {
              return res.status(201).send({
                success: true,
                message: "User created successfully",
                user: savedUser,
              });
            })
            .catch((err) => {
              return res.status(500).send({
                success: false,
                message: "User creation failed",
                err,
              });
            });
        });
      });
    })
    .catch((err) => {
      res.status(500).send({
        success: false,
        message: "An error occurred during signup",
        err,
      });
    });
});

router.post("/login", (req, res) => {
  const { email, password } = req.body;

  // Query for the user only once
  User.findOne({ email })
    .then((user) => {
      if (!user) {
        return res.status(404).send({
          success: false,
          message: "User not found",
        });
      }
      // Compare the password
      bcrypt.compare(password, user.password, (err, result) => {
        if (err) {
          return res.status(500).send({
            success: false,
            message: "Error comparing passwords",
          });
        }
        
        if (!result) {
          return res.status(401).send({
            success: false,
            message: "Invalid password",
          });
        }

        // Generate token and send response
        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
          expiresIn: "15d",
        });
        return res.status(200).send({
          success: true,
          message: "User logged in successfully",
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
          imageUrl: user.imageUrl,
          imageId: user.imageId,
          id: user._id,
          token,
        });
      });
    })
    .catch((error) => {
      res.status(500).send({
        success: false,
        message: "An error occurred during login",
      });
    });
});
module.exports = router;
