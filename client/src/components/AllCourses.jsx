import axios from "axios";
import { useContext, useEffect, useState } from "react";
import { UserContext } from "../context/Context";
import { Link } from "react-router-dom";

function AllCourses() {
  const { user } = useContext(UserContext);
  const [loading, setLoading] = useState(false);
  const [coursesData, setCoursesData] = useState([]);

  async function getAllCourses() {
    if (!user?.token) {
      console.warn("No token available in user context.");
      return; // Exit if token is missing
    }
    try {
      setLoading(true);
      const res = await axios.get("http://localhost:3000/course/get-courses", {
        headers: {
          Authorization: `Bearer ${user?.token}`,
        },
      });
      if (res?.data?.success) {
        console.log(res.data.message);

        setCoursesData(res.data.courses);
        console.log(res.data.courses);

        setLoading(false);
      }
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  }
  useEffect(() => {
    getAllCourses();
  }, []);
  return (
    <>
    <div className="d-flex gap-4 flex-wrap">
    {coursesData.map((course)=>
    <Link to={`/dashboard/course-datail/${course._id}`} key={course._id} className="card w-25 h-50 mb-3">
      <img src={course.imageUrl} className="card-img-top" alt="..." />
      <div className="card-body">
        <h5 className="card-title">{course.courseName}</h5>
        <p className="card-text">
        Price : ${course.price}
        </p>
     

      </div>
    </Link>
  )}
    </div>
    </>
  );
}

export default AllCourses;
