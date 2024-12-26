import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import "./index.css";
import App from "./App.jsx";
import Signup from "./pages/Signup.jsx";
import Login from "./pages/Login.jsx";
import Dashboard from "./pages/Dashboard.jsx";
import Home from "./components/Home.jsx";
import AddStudent from "./components/AddStudent.jsx";
import AddCourse from "./components/AddCourse.jsx";
import Students from "./components/Students.jsx";
import AllCourses from "./components/AllCourses.jsx";
import CollectFee from "./components/CollectFee.jsx";
import PaymentHistory from "./components/PaymentHistory.jsx";
import UserContextProvider from "./context/UserContextProvider.jsx";
import Coursedetails from "./components/Coursedetails.jsx";
import Studentdetail from "./components/Studentdetail.jsx";
const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      {
        path : "/signup",
        element : <Signup />
      },
      {
        path : "/login",
        element : <Login />
      },
      {
        path: "/dashboard",
        element: <Dashboard />,
        children: [
          {
            path: "",
            element: <Home />
          },
          {
            path: "add-student",
            element: <AddStudent />
          },
          {
            path: "add-course",
            element: <AddCourse />
          },
          {
            path: "all-students",
            element: <Students />
          },
          {
            path: "all-courses",
            element: <AllCourses />
          },
          {
            path: "collect-fee",
            element: <CollectFee />
          },
          {
            path: "payment-history",
            element: <PaymentHistory />
          },
          {
            path: "course-datail/:id",
            element: <Coursedetails />
          },
          {
            path: "student-detail/:id",
            element: <Studentdetail />
          },
          {
            path: "update-course/:id",
            element: <AddCourse />
          },
          {
            path: "update-student/:id",
            element: <AddStudent />
          },
        ]
      }
      
    ],
  },
]);
createRoot(document.getElementById("root")).render(
  <StrictMode>
  <UserContextProvider>
    <RouterProvider router={router} />
  </UserContextProvider>
  </StrictMode>
);
