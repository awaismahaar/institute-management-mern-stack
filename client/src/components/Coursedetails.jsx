import React, { useContext, useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { UserContext } from "../context/Context";
import axios from "axios";
import toast from "react-hot-toast";

function Coursedetails() {
  let { id } = useParams();
  const { user } = useContext(UserContext);
  const [loading, setLoading] = useState(false);
  const [courseDetail, setCourseDetail] = useState({});
  const [students, setStudents] = useState([]);
  const navigate = useNavigate()
  async function getCourseDetails() {
    if (!user?.token) {
      console.warn("No token available in user context.");
      return; // Exit if token is missing
    }
    try {
      setLoading(true);
      const res = await axios.get(
        `http://localhost:3000/course/get-course/${id}`,
        {
          headers: {
            Authorization: `Bearer ${user?.token}`,
          },
        }
      );
      if (res?.data?.success) {
        setCourseDetail(res.data.courseDetails);
        setStudents(res.data.students);
        setLoading(false);
        console.log(res.data);
      }
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  }
  useEffect(() => {
    getCourseDetails();
  }, []);

  // delete course

  async function deleteCourse(id) {
    if (!user?.token) {
      console.warn("No token available in user context.");
      return; // Exit if token is missing
    }
      try {
        setLoading(true);
        const res = await axios.delete(`http://localhost:3000/course/delete-course/${id}`, {
          headers: {
            Authorization: `Bearer ${user?.token}`,
          },
        });
        setLoading(false);
        if (res.data.success) {
        toast.success(res.data.message);
        navigate("/dashboard/all-courses")
        }
        else{
        toast.error(res.data.message);
        }
      } catch (error) {
        console.log(error);
        setLoading(false);
        toast.error(error.message);
      }
  }
  return (
    <>
      <div className="mb-3 card p-4" style={{ maxWidth: 1240 }}>
        <div className="row g-5">
          <div className="col-md-4">
            <img
              src={courseDetail.imageUrl}
              className="img-fluid rounded-start rounded-end"
              alt="..."
            />
          </div>
          <div className="col-md-8">
            <div className="card-body">
              <h5 className="card-title">Name : {courseDetail.courseName}</h5>
              <p className="card-text">
                Description : {courseDetail.description}
              </p>
              <p className="card-text">Price : ${courseDetail.price}</p>
              <p className="card-text">
                Starting Date : {courseDetail.startingDate}
              </p>
              <p className="card-text">
                Ending Date : {courseDetail.endingDate}
              </p>
              <div className="d-flex gap-4 align-items-center">
                <button onClick={()=> navigate("/dashboard/update-course/"+courseDetail._id ,{state : { courseDetail}})} className="btn btn-primary">Edit</button>
                <button onClick={()=> deleteCourse(courseDetail._id)} className="btn btn-danger">Delete</button>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="mt-5">
      <h2>Enroll Students in this Course ({students.length})</h2>
        {students.length === 0 ? <h3>No Students Enrolled</h3>
        :  students.map((student) => (
            <div className="d-flex gap-4 align-items-center" key={student._id}>
            <Link to={`/dashboard/student-detail/${student._id}`}>
            <img className="rounded-circle" width="50" height="50" src={student.imageUrl}></img>
            </Link>
              <h5>
                {student.fullName} 
              </h5>
            </div>
          ))}
      </div>
    </>
  );
}

export default Coursedetails;
