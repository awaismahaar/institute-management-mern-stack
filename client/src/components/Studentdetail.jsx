import axios from "axios";
import React, { useContext, useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { UserContext } from "../context/Context";
import { formatDistanceToNow } from "date-fns";
import toast from "react-hot-toast";
function Studentdetail() {
  let { id } = useParams();
  const { user } = useContext(UserContext);
  const [loading, setLoading] = useState(false);
  const [studentDetail, setStudentDetail] = useState({});
  const [courseDetail, setCourseDetail] = useState({});
  const [feeDetails, setFeeDetails] = useState([]);
  const navigate = useNavigate();
  async function getStudentDetails() {
    if (!user?.token) {
      console.warn("No token available in user context.");
      return; // Exit if token is missing
    }
    try {
      setLoading(true);
      const res = await axios.get(
        `http://localhost:3000/student/student-details/${id}`,
        {
          headers: {
            Authorization: `Bearer ${user?.token}`,
          },
        }
      );
      if (res?.data?.success) {
        setStudentDetail(res.data.student);
        setFeeDetails(res.data.feeDetails);
        setCourseDetail(res.data.courseDetail);
        setLoading(false);
        console.log(res.data);
      }
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  }
  useEffect(() => {
    getStudentDetails();
  }, []);

  // delete student 
  async function deleteStudent(id) {
    if (!user?.token) {
      console.warn("No token available in user context.");
      return; // Exit if token is missing
    }
      try {
        setLoading(true);
        const res = await axios.delete(`http://localhost:3000/student/delete-student/${id}`, {
          headers: {
            Authorization: `Bearer ${user?.token}`,
          },
        });
        setLoading(false);
        if (res.data.success) {
        toast.success(res.data.message);
        navigate("/dashboard/all-students")
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
      <div className="mb-3 card p-4" style={{ maxWidth: 1240, maxHeight: 420 }}>
        <div className="row g-5">
          <div className="col-md-4">
            <img
              src={studentDetail.imageUrl}
              className="img-fluid rounded-start w-75 h-75 rounded-end"
              alt="..."
            />
          </div>
          <div className="col-md-8">
            <div className="card-body">
              <h5 className="card-title">Name : {studentDetail.fullName}</h5>
              <p className="card-text">Email : {studentDetail.email}</p>
              <p className="card-text">Phone Number : {studentDetail.phone}</p>
              <p className="card-text fw-bold">
                Course Enroll : {courseDetail.courseName}
              </p>
              <div className="d-flex gap-4 align-items-center">
                <button
                  onClick={() =>
                    navigate("/dashboard/update-student/" + studentDetail._id, {
                      state: { studentDetail },
                    })
                  }
                  className="btn btn-primary"
                >
                  Edit
                </button>
                <button onClick={()=> deleteStudent(studentDetail._id)} className="btn btn-danger">Delete</button>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="mt-5">
        <h2>Fee Details ({feeDetails.length})</h2>
        {feeDetails.length === 0 ? (
          <h3>No Fee Details</h3>
        ) : (
          feeDetails.map((student) => (
            <div className="d-flex flex-column gap-2" key={student._id}>
              <h5>Full Name : {student.fullName}</h5>
              <h5>Phone : {student.phone}</h5>
              <h5>Amount : {student.amount}</h5>
              <h5>
                {formatDistanceToNow(new Date(student.createdAt), {
                  addSuffix: true,
                })} <span className="badge bg-success">Paid</span>
              </h5>
            </div>
          ))
        )}
      </div>
    </>
  );
}

export default Studentdetail;
