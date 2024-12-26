import axios from "axios";
import React, { useContext, useEffect, useState } from "react";
import toast from "react-hot-toast";
import { UserContext } from "../context/Context";
import { useLocation, useNavigate } from "react-router-dom";

function AddCourse() {
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useContext(UserContext);
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);
  console.log(location.state);
  const editCourse = location.state ? location.state.courseDetail : null;

  const [data, setData] = useState({
    courseName: editCourse ? editCourse.courseName : "",
    price: editCourse ? editCourse.price : "",
    startingDate: editCourse ? editCourse.startingDate : "",
    endingDate: editCourse ? editCourse.endingDate : "",
    description: editCourse ? editCourse.description : "",
  });
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
        courseName: editCourse ? editCourse.courseName : "",
        price: editCourse ? editCourse.price : "",
        startingDate: editCourse ? editCourse.startingDate : "",
        endingDate: editCourse ? editCourse.endingDate : "",
        description: editCourse ? editCourse.description : "",
      });
  }, [location.state,editCourse]); // Re-run if location.state changes
  async function handleSubmit(event) {
    event.preventDefault();
    try {
      const formData = new FormData();
      formData.append("courseName", data.courseName);
      formData.append("price", data.price);
      formData.append("description", data.description);
      formData.append("startingDate", data.startingDate);
      formData.append("endingDate", data.endingDate);
      if (image) {
        formData.append("image", image);
      }
      setLoading(true);
        const url = editCourse ? 
        `http://localhost:3000/course/update-course/${editCourse._id}`
        : "http://localhost:3000/course/add-course"
        const method = editCourse ? "put" : "post"
        const res = await axios[method](url ,  formData,
          {
            headers: {
              Authorization: `Bearer ${user.token}`,
            },
          })
          setLoading(false);
        if (res.data.success) { 
          toast.success(res.data.message);
          if (editCourse) {
            navigate(`/dashboard/course-datail/${editCourse._id}`); 
          } 
        } else {
          toast.error(res.data.message);
        }
      setData({
        courseName: "",
        price: "",
        startingDate: "",
        endingDate: "",
        description: "",
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
        {location.state ? "Edit Course" : "Add Course"}
      </h1>
      <div className="mb-2">
        <label className="form-label">Course Name</label>
        <input
          type="text"
          required
          value={data.courseName}
          onChange={handleChangeData}
          name="courseName"
          className="form-control"
        />
      </div>
      <div className="mb-2">
        <label className="form-label">Price</label>
        <input
          type="number"
          name="price"
          required
          value={data.price}
          onChange={handleChangeData}
          className="form-control"
        />
      </div>
      <div className="mb-2">
        <label className="form-label">Starting Date</label>
        <input
          type="text"
          name="startingDate"
          value={data.startingDate}
          className="form-control"
          onChange={handleChangeData}
          autoComplete="current-password"
        />
      </div>
      <div className="mb-2">
        <label className="form-label">Ending Date</label>
        <input
          type="text"
          name="endingDate"
          value={data.endingDate}
          className="form-control"
          onChange={handleChangeData}
          autoComplete="current-password"
        />
      </div>
      <div className="mb-2">
        <label className="form-label">Description</label>
        <textarea
          className="form-control"
          name="description"
          value={data.description}
          onChange={handleChangeData}
          placeholder="Enter description here..."
          defaultValue={""}
        />
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
          id="formFile"
        />
        <img
          className="pt-3 rounded"
          src={
            image
              ? URL.createObjectURL(image)
              : location.state && location.state.courseDetail.imageUrl
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

export default AddCourse;
