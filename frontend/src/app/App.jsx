import './App.css'

import { useState, useEffect } from 'react'
import { Routes, Route } from 'react-router-dom'
import CookieConsent from "react-cookie-consent";

import { Post, Get, UserConnected, AuthContext, Navbar, Footer } from './utils'
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
    <>
      <CookieConsent
        location="bottom"
        hideOnAccept={true}
        style={{ background: "#2B373B" }}
        buttonStyle={{ color: "#4e503b", fontSize: "13px" }}
        expires={1}
      > 
        This website uses cookies to enhance the user experience. {" "}
      </CookieConsent>

      <AuthContext.Provider value={{ userAuthData, setUserAuth }}>
        <Navbar />

        <Routes>
          <Route path='/' element={<Home  />} />
          <Route path='/login' element={<Login />} />
          <Route path='/signup' element={<Signup />} />
          <Route path='/logout' element={<Logout />} />
          <Route path='/chat' element={<Chat />} />
        </Routes>
        
        <Footer />
      </AuthContext.Provider>
    </>
  ) 
}