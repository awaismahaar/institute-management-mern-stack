import axios from 'axios';
import React, { useContext, useEffect, useState } from 'react'
import { UserContext } from '../context/Context';

function PaymentHistory() {
  const { user } = useContext(UserContext);
  const [loading, setLoading] = useState(false);
  const [paymentHistory, setPaymentHistory] = useState([]);
  const [coursesName, setCoursesName] = useState([]);
  async function getPaymentHistory() {
    if (!user?.token) {
      console.warn("No token available in user context.");
      return; // Exit if token is missing
    }
    try {
      setLoading(true);
      const res = await axios.get(
        "http://localhost:3000/fee/payment-history",
        {
          headers: {
            Authorization: `Bearer ${user?.token}`,
          },
        }
      );
      setLoading(false);
      if (res.data.success) {
        setPaymentHistory(res.data.fee);
        console.log(res.data);
      }
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  }
  useEffect(() => {
    getPaymentHistory();
  }, []);

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
  return (
    <>
    <h1 className='text-center'> Payment History</h1>
    <table className="table w-100 table-hover m-auto">
    <thead>
      <tr>
        <th scope="col">Student Name</th>
        <th scope="col">Date and Time</th>
        <th scope="col">Amount</th>
        <th scope="col">Remark</th>
        <th scope="col">Course Name</th>
      </tr>
    </thead>
    <tbody>
    {paymentHistory.length === 0 ? <h3>No Payment History</h3>  : paymentHistory && paymentHistory.map((student)=>
      <tr key={student._id}>
        <th scope="row">
        {student.fullName}
        </th>
        <td>{new Date(student.createdAt).toLocaleString()}</td>
        <td>{student.amount}</td>
        <td>{student.remark}</td>
        <td>{coursesName.map((course) => course._id === student.courseId ? course.courseName : 'Not Found or Deleted')}</td>
      </tr>
    )}
    </tbody>
  </table>
  </>
  )
}

export default PaymentHistory