import React, { useContext, useEffect, useState } from "react";
import { UserContext } from "../context/Context";
import axios from "axios";

function Home() {
  const { user } = useContext(UserContext);
  const [loading, setLoading] = useState(false);
  const [totalStudents, setTotalStudents] = useState(0);
  const [totalCourses, setTotalCourses] = useState(0);
  const [total, setTotal] = useState(0);
  async function getAllHomeData() {
    if (!user?.token) {
      console.warn("No token available in user context.");
      return; // Exit if token is missing
    }
    try {
      setLoading(true);
      const res = await axios.get("http://localhost:3000/course/home", {
        headers: {
          Authorization: `Bearer ${user?.token}`,
        },
      });
      setLoading(false);
      if (res.data.success) {
        setTotalStudents(res.data.totalStudents);
        setTotalCourses(res.data.totalCourses);
        setTotal(res.data.total);
        console.log(res.data);
      }
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  }
  useEffect(() => {
    getAllHomeData();
  }, []);
  return (
    <div className="d-flex gap-3">
    <div className="card w-25">
      <div className="card-body text-center">
        <h5 className="card-title">Total Courses</h5>
        <p className="card-text">
         {totalCourses}
        </p>   
      </div>
    </div>
    <div className="card w-25">
      <div className="card-body text-center">
        <h5 className="card-title">Total Students</h5>
        <p className="card-text">
         {totalStudents}
        </p>   
      </div>
    </div>
    <div className="card w-25">
      <div className="card-body text-center">
        <h5 className="card-title">Total Amount</h5>
        <p className="card-text">
         {total}
        </p>   
      </div>
    </div>
    </div>
  );
}

export default Home;
