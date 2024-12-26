import React, { useState } from 'react'
import educationImage from "../assets/education.jpg"
import axios from "axios";
import toast from 'react-hot-toast';
import { Link } from 'react-router-dom';
function Signup() {
  const [data , setData] = useState({
    firstName : "",
    lastName : "",
    email : "",
    password : "",
  })
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [type, setType] = useState('password');
  const [icon, setIcon] = useState("eyeOff");

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
  function handleUploadImage(event) {
   setImage(event.target.files[0]) 
  }
  async function handleSubmit(event) {
    event.preventDefault();
    try {
      const formData = new FormData();
      formData.append("firstName", data.firstName);
      formData.append("lastName", data.lastName);
      formData.append("email", data.email);
      formData.append("password", data.password);
      if (image) {
        formData.append("image", image);  
      }
      setLoading(true);
      const res = await axios.post("http://localhost:3000/user/signup" , formData);
      if (res.data.success) {
        setLoading(false);
        toast.success(res.data.message)
      }
      else{
        setLoading(false);
        toast.error(res.data.message)
      }
      
      setData( {
        firstName : "",
        lastName : "",
        email : "",
        password : "",
      })
      setImage(null);
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
          <form className="w-75 mt-3 m-auto" onSubmit={handleSubmit}>
            <h1 className="mb-3 text-center">Signup</h1>
            <div className="mb-3 d-flex justify-content-between">
              <div className="f-name">
                <label className="form-label">First Name</label>
                <input type="text" required value={data.firstName} onChange={handleChangeData} name="firstName" className="form-control" />
              </div>
              <div className="l-name">
                <label className="form-label">Last Name</label>
                <input type="text" required value={data.lastName} onChange={handleChangeData} name="lastName" className="form-control" />
              </div>
            </div>
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
             />
             <span className="flex justify-around items-center" onClick={handleToggle}>
            {icon === "eyeOff" ?  <i className="fa-regular eye-icon position-absolute mr-10 fa-eye-slash"></i> : <i className="fa-regular fa-eye eye-icon position-absolute mr-10"></i> } 
              </span>
            </div>
            </div>
            <div className="mb-3">
              <label htmlFor="formFile" className="form-label">
                Upload Image
              </label>
              <input className="form-control" onChange={handleUploadImage} name='image' type="file" id="formFile" />
              <img className='pt-2 rounded' src={image && URL.createObjectURL(image)} width="70px "></img>
            </div>

            <button type="submit" className="btn-bgColor py-2 w-100">
           {loading && <i className="fa-solid fa-spinner text-white fa-spin-pulse"></i>} Sign up
            </button>
            <div className='mt-2 text-center'>
            If you have an account <Link to="/login" className="fs-5 w-100">Login</Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Signup