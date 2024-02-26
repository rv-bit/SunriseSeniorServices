import './App.css'

import { useState, useEffect } from 'react'
import { Routes, Route } from 'react-router-dom'
import { Post, Get, UserConnected, AuthContext } from './utils/Fetching';

import Navbar from './utils/Navbar'
import { Home, Login, Signup, Logout, Chat } from './pages'

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
          <Route path='/' element={<Home  />} />

          <Route path='/login' element={<Login />} />
          <Route path='/signup' element={<Signup />} />
          <Route path='/logout' element={<Logout />} />
          <Route path='/chat' element={<Chat />} />
        </Routes>
      </div>
    </AuthContext.Provider>
  ) 
}