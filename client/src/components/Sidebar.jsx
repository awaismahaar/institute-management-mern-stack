import { useState } from "react";
import "../css/Sidebar.css"
import Topbar from "./Topbar";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";
function Sidebar() {
 
    const [isNavbarVisible, setNavbarVisible] = useState(false);
    const [activeLink, setActiveLink] = useState("Dashboard");
  
    const handleToggleClick = () => {
      setNavbarVisible(!isNavbarVisible);
      document.body.classList.toggle("body-pd");
    };
  
    const handleLinkClick = (linkName) => {
      setActiveLink(linkName);
    };

    function handlelogout(){
      localStorage.removeItem("auth");
      toast.success("Logout Successfully");
    }
  return (
    <div>
    <header className="header" id="header">
      <div className="header_toggle" onClick={handleToggleClick}>
        <i className={`bx ${isNavbarVisible ? "bx-x" : "bx-menu"}`} id="header-toggle" />
      </div>
     
    </header>
    
    <div className={`l-navbar ${isNavbarVisible ? "show" : ""}`} id="nav-bar">
      <nav className="nav">
        <div>
          <a href="#" className="nav_logo ">
            <Topbar/>
          </a>
          <div className="nav_list">
            {["Dashboard", "All courses", "Add course", "All Students", "Add Student", "Collect Fee", "Payment History"].map((name) => (
              <Link
                key={name}
                to={`/dashboard${name === "Dashboard" ? "" : name === "All courses" ? "/all-courses" : name === "Add course" ? "/add-course" : name === "All Students" ? "/all-students" : name === "Add Student" ? "/add-student" : name === "Collect Fee" ? "/collect-fee" : name === "Payment History" ? "/payment-history" : ""}`}
                className={`nav_link ${activeLink === name ? "active" : ""}`}
                onClick={() => handleLinkClick(name)}
              >
                <i className={`bx ${
                  name === "Dashboard"
                    ? "bx-grid-alt"
                    : name === "All courses"
                    ? "bxs-book"
                    
                    : name === "Add course"
                    ? "bx-plus"
                    : name === "All Students"
                    ? "bxs-user"
                    : name === "Add Student"
                    ? "bx-plus"
                    : name === "Collect Fee"
                    ? "bx-money"
                    : name === "Payment History"
                    ? "bx-list-ul"
                    : ""
                } nav_icon`} />
                <span className="nav_name">{name}</span>
              </Link>
            ))}
          </div>
        </div>
        <Link to="/login" onClick={handlelogout} className="nav_link">
          <i className="bx bx-log-out nav_icon" />
          <span className="nav_name">SignOut</span>
        </Link>
      </nav>
    </div>

    {/* Container Main end */}
  </div>
  );
}

export default Sidebar;
