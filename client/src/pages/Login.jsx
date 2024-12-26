import React, { useState } from 'react'
import educationImage from "../assets/education.jpg"
import axios from "axios";
import toast from 'react-hot-toast';
import { Link, useNavigate } from 'react-router-dom';
function Login() {
  const [data , setData] = useState({
    email : "",
    password : "",
  })
  const [loading, setLoading] = useState(false);
  const [type, setType] = useState('password');
  const [icon, setIcon] = useState("eyeOff");
  const navigate = useNavigate()

  const handleToggle = () => {
    if (type==='password'){
       setIcon('eye');
       setType('text')
    } else {
       setIcon('eyeOff')
       setType('password')
    }
 }
  function handleChangeData(event) {
    setData((prevData)=>({
      ...prevData , [event.target.name] : event.target.value
    }))
  }
  async function handleSubmit(event) {
    event.preventDefault();
    try {
      setLoading(true);
      const res = await axios.post("http://localhost:3000/user/login" , data);
      if (res.data.success) {
        setLoading(false);
        toast.success(res.data.message)
        localStorage.setItem("auth" , JSON.stringify(res.data))
        navigate("/dashboard")
      }
      else{
        setLoading(false);
        toast.error(res.data.message)
      }
      
      setData( {
        email : "",
        password : "",
      })
    } catch (error) {
      setLoading(false);
      toast.error(error.response.data.message)
    }
    
 
    
  }
  return (
    <div className="signup-wrapper">
      <div className="signup-container">
        <div className="left-side">
          <img src={educationImage}></img>
        </div>
        <div className="right-side">
          <form className="w-75 mt-5 m-auto" onSubmit={handleSubmit}>
            <h1 className="mb-3 text-center">Login</h1>
          
            <div className="mb-3">
              <label className="form-label">Email address</label>
              <input
                type="email"
                name="email"
                required
                value={data.email}
                onChange={handleChangeData}
                className="form-control"
                aria-describedby="emailHelp"
              />
            </div>
            <div className="mb-3">
              <label htmlFor="exampleInputPassword1" className="form-label">
                Password
              </label>
             
              <div className="mb-4 flex position-relative">
              <input
                  type={type}
                  name="password"
                  value={data.password}
                  className="form-control"
                  onChange={handleChangeData}
                  autoComplete="current-password"
                  required
             />
             <span className="flex justify-around items-center" onClick={handleToggle}>
            {icon === "eyeOff" ?  <i className="fa-regular eye-icon position-absolute mr-10 fa-eye-slash"></i> : <i className="fa-regular fa-eye eye-icon position-absolute mr-10"></i> } 
              </span>
            </div>
            </div>
         

            <button type="submit" className="btn-bgColor py-2 w-100">
           {loading && <i className="fa-solid fa-spinner text-white fa-spin-pulse"></i>} Login
            </button>
            <div className='mt-3 text-center'>
            If your don't have an account <Link to="/signup" className="fs-5 w-100">create your account</Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Login