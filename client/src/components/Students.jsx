import React, { useContext, useEffect, useState } from "react";
import { UserContext } from "../context/Context";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function Students() {
  const navigate = useNavigate()
  const { user } = useContext(UserContext);
  const [loading, setLoading] = useState(false);
  const [students, setStudents] = useState([]);
  async function getStudentDetails() {
    if (!user?.token) {
      console.warn("No token available in user context.");
      return; // Exit if token is missing
    }
    try {
      setLoading(true);
      const res = await axios.get(
        "http://localhost:3000/student/get-students",
        {
          headers: {
            Authorization: `Bearer ${user?.token}`,
          },
        }
      );
      if (res?.data?.success) {
        setStudents(res.data.students);
        setLoading(false);
        console.log(res.data.students);
      }
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  }
  useEffect(() => {
      getStudentDetails();
  }, []);
  return (
    <table className="table w-100 table-hover m-auto">
      <thead>
        <tr>
          <th scope="col">Student Pic</th>
          <th scope="col">Student Name</th>
          <th scope="col">Phone Number</th>
          <th scope="col">Student Email</th>
        </tr>
      </thead>
      <tbody>
      {students.length === 0 ? <h3>No Students</h3>  : students && students.map((student)=>
        <tr onClick={() => navigate(`/dashboard/student-detail/${student._id}`)} key={student._id}>
          <th scope="row">
            <img width="50" height="50" className="rounded-circle" src={student.imageUrl}></img>
          </th>
          <td>{student.fullName}</td>
          <td>{student.phone}</td>
          <td>{student.email}</td>
        </tr>
      )}
      </tbody>
    </table>
  );
}

export default Students;
