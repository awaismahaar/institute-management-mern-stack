import React from 'react'
import Topbar from '../components/Topbar'
import Sidebar from '../components/Sidebar'
import { Outlet } from 'react-router-dom'

function Dashboard() {
  return (
    <>
    <div className='dashboard-main-container'>
       <div className='dashboard-main'>
       <div className='dashboard-left'>
       <Sidebar/>
       </div>
       <div className='dashboard-right'>
       <Outlet/>
       </div>
      </div>
    </div>


    </>
  )
}

export default Dashboard