import React, { useContext, useEffect, useState } from 'react'
import { UserContext } from '../context/Context';
import axios from 'axios';
import toast from 'react-hot-toast';

function CollectFee() {
  const { user } = useContext(UserContext);
  const [loading, setLoading] = useState(false);
  const [coursesName, setCoursesName] = useState([]);
  const [data, setData] = useState({
    fullName: "",
    phone: "",
    amount: "",
    courseId: "",
    remark: "",
  });
  function handleChangeData(event) {
    setData((prevData) => ({
      ...prevData,
      [event.target.name]: event.target.value,
    }));
  }

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
        setLoading(true);
        const res = await axios.post("http://localhost:3000/fee/add-fee", data, {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        });
        setLoading(false);
        if (res.data.success) {   
          toast.success(res.data.message);
        } else {
          toast.error(res.data.message);
        }
  
        setData({
          fullName: "",
          phone: "",
          amount: "",
          courseId: "",
          remark: "",
        });
      } catch (error) {
        setLoading(false);
        toast.error(error.response.data.message);
      }
    }
  return (
    <form className="w-50 mt-2 m-auto" onSubmit={handleSubmit}>
    <h1 className="mb-2 text-center">
      Collect Fee
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
      <label className="form-label">phone Number</label>
      <input
        type="text"
        name="phone"
        value={data.phone}
        className="form-control"
        onChange={handleChangeData}
      />
    </div>
    <div className="mb-2">
      <label className="form-label">Amount</label>
      <input
        type="number"
        name="amount"
        value={data.amount}
        className="form-control"
        onChange={handleChangeData}
      />
    </div>
    <div className="mb-2">
      <select
        onChange={handleChangeData}
        name="courseId"
        className="form-select"
        aria-label="Default select example"
      >
        <option selected>Select Course</option>
        {coursesName &&
          coursesName.map((course) => (
            <option key={course._id} value={course._id}>
              {course.courseName}
            </option>
          ))}
      </select>
    </div>
    <div className="mb-2">
      <label className="form-label">Remark</label>
      <input
        type="text"
        name="remark"
        value={data.remark}
        className="form-control"
        onChange={handleChangeData}
      />
    </div>

    <button type="submit" className="btn-bgColor py-2 w-100">
      {loading && (
        <i className="fa-solid fa-spinner text-white fa-spin-pulse"></i>
      )}{" "}
      Submit
    </button>
  </form>
  )
}

export default CollectFee