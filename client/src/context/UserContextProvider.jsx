import {useEffect, useState } from 'react'
import { UserContext } from './Context';
function UserContextProvider({children}) {
   // Initialize `user` directly from `localStorage`
   const [user, setUser] = useState(() => {
    const auth = localStorage.getItem("auth");
    return auth ? JSON.parse(auth) : null; // `null` indicates no user data
  });
  useEffect(() => {
    const auth = localStorage.getItem("auth");
    if (auth) {
      setUser(JSON.parse(auth));
    }
   
  }, []);
  return (
    <UserContext.Provider value={{user, setUser}}>
      {children}
    </UserContext.Provider>
  )
}

export default UserContextProvider