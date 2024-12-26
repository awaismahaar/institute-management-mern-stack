import React, { useContext } from 'react'
import { UserContext } from '../context/Context'

function Topbar() {
  const {user} = useContext(UserContext)
  return (
    <div className='top-bar d-flex align-items-center gap-2'>
    <img src={user.imageUrl}></img>
      <h4 className='mt-2 text-white'>{user.lastName}</h4>
  </div>
  )
}

export default Topbar