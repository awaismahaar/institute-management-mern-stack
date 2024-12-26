import axios from "axios";
import React, { useContext, useEffect, useState } from "react";
import toast from "react-hot-toast";
import { UserContext } from "../context/Context";
import { useLocation, useNavigate } from "react-router-dom";

function AddStudent() {
  const location = useLocation();
  const navigate = useNavigate()
  const { user } = useContext(UserContext);
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [coursesName, setCoursesName] = useState([]);
  const editDetails = location.state ? location.state.studentDetail : null;
  const [data, setData] = useState({
    fullName: editDetails ? editDetails.fullName : "",
    email: editDetails ? editDetails.email : "",
    phone: editDetails ? editDetails.phone : "",
    address: editDetails ? editDetails.address : "",
    courseId: editDetails ? editDetails.courseId : "",
  });
  console.log(location.state);

  function handleChangeData(event) {
    setData((prevData) => ({
      ...prevData,
      [event.target.name]: event.target.value,
    }));
  }
  function handleUploadImage(event) {
    setImage(event.target.files[0]);
  }

  useEffect(() => {
    setData({
      fullName: editDetails ? editDetails.fullName : "",
      email: editDetails ? editDetails.email : "",
      phone: editDetails ? editDetails.phone : "",
      address: editDetails ? editDetails.address : "",
      courseId: editDetails ? editDetails.courseId : "",
    });
  }, [editDetails]);

  // get courses names

  async function getAllCoursesNames() {
    if (!user?.token) {
      console.warn("No token available in user context.");
      return; // Exit if token is missing
    }
    try {
      setLoading(true);
      const res = await axios.get("http://localhost:3000/course/courses-name", {
        headers: {
          Authorization: `Bearer ${user?.token}`,
        },
      });
      if (res?.data?.success) {
        console.log(res.data.message);

        setCoursesName(res.data.courses);
        console.log(res.data.courses);

        setLoading(false);
      }
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  }
  useEffect(() => {
    getAllCoursesNames();
  }, []);
  async function handleSubmit(event) {
    event.preventDefault();
    try {
      const formData = new FormData();
      formData.append("fullName", data.fullName);
      formData.append("email", data.email);
      formData.append("phone", data.phone);
      formData.append("address", data.address);
      formData.append("courseId", data.courseId);
      if (image) {
        formData.append("image", image);
      }
      setLoading(true);
      const url = editDetails
        ? `http://localhost:3000/student/update-student/${editDetails._id}`
        : "http://localhost:3000/student/add-student";
      const method = editDetails ? "put" : "post";
      const res = await axios[method](url, formData, {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      });
      if (res.data.success) {
        setLoading(false);
        toast.success(res.data.message);
        if (editDetails) {
          navigate(`/dashboard/student-detail/${editDetails._id}`);
        }
      } else {
        setLoading(false);
        toast.error(res.data.message);
      }

      setData({
        fullName: "",
        email: "",
        phone: "",
        address: "",
        courseId: "",
      });
      setImage(null);
    } catch (error) {
      setLoading(false);
      toast.error(error.response.data.message);
    }
  }
  return (
    <form className="w-50 mt-2 m-auto" onSubmit={handleSubmit}>
      <h1 className="mb-2 text-center">
        {editDetails ? "Update Student" : "Add Student"}
      </h1>
      <div className="mb-2">
        <label className="form-label">Student Name</label>
        <input
          type="text"
          required
          value={data.fullName}
          onChange={handleChangeData}
          name="fullName"
          className="form-control"
        />
      </div>
      <div className="mb-2">
        <label className="form-label">Student Email</label>
        <input
          type="email"
          name="email"
          required
          value={data.email}
          onChange={handleChangeData}
          className="form-control"
        />
      </div>
      <div className="mb-2">
        <label className="form-label">phone Number</label>
        <input
          type="text"
          name="phone"
          value={data.phone}
          className="form-control"
          onChange={handleChangeData}
          autoComplete="current-password"
        />
      </div>
      <div className="mb-2">
        <label className="form-label">Student Address</label>
        <input
          type="text"
          name="address"
          value={data.address}
          className="form-control"
          onChange={handleChangeData}
          autoComplete="current-password"
        />
      </div>
      <div className="mb-2">
        <select
          value={data.courseId}
          onChange={handleChangeData}
          name="courseId"
          className="form-select"
          disabled={editDetails}
          aria-label="Default select example"
        >
          <option>Select Course</option>
          {coursesName &&
            coursesName.map((course) => (
              <option key={course._id} value={course._id}>
                {course.courseName}
              </option>
            ))}
        </select>
      </div>

      <div className="mb-2">
        <label htmlFor="formFile" className="form-label">
          Upload Image
        </label>
        <input
          className="form-control"
          onChange={handleUploadImage}
          name="image"
          type="file"
          required={!editDetails}
          id="formFile"
        />
        <img
          className="pt-3 rounded"
          src={
            image
              ? URL.createObjectURL(image)
              : location.state && editDetails.imageUrl
          }
          width="70px "
        ></img>
      </div>

      <button type="submit" className="btn-bgColor py-2 w-100">
        {loading && (
          <i className="fa-solid fa-spinner text-white fa-spin-pulse"></i>
        )}{" "}
        Submit
      </button>
    </form>
  );
}

export default AddStudent;
