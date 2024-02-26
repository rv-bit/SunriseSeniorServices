import './App.css'

import { useState, useEffect } from 'react'
import { Routes, Route } from 'react-router-dom'
import { Post, Get, UserConnected, AuthContext } from './utils/Fetching';

import Navbar from './utils/Navbar'
import { Home, Login, Signup, Logout } from './pages'

export default function App () {
  const [userAuthData, setUserAuth] = useState(null);

  useEffect(() => {
    UserConnected().then(UserIsConnected => {
      if (UserIsConnected) {
        setUserAuth(UserIsConnected);
      }
    });
  }, [])

  return (
    <AuthContext.Provider value={{ userAuthData, setUserAuth }}>
      <div className='App'>
        <Navbar />

        <Routes>
          <Route forceRefresh={true} path='/' element={<Home  />} />

          <Route forceRefresh={true} path='/login' element={<Login />} />
          <Route forceRefresh={true} path='/signup' element={<Signup />} />
          <Route forceRefresh={true} path='/logout' element={<Logout />} />
        </Routes>
      </div>
    </AuthContext.Provider>
  ) 
}