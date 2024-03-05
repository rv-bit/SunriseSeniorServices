import './App.css'

import { useState, useEffect, useMemo } from 'react'
import { Routes, Route } from 'react-router-dom'
import CookieConsent from "react-cookie-consent";

import { Post, Get, AuthContext, Navbar, Footer } from './utils'
import { Home, Login, Signup, FormCreateAccount, Logout, Chat } from './pages'

export default function App () {
  const [userAuthData, setUserAuth] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      const response = await Get(`${import.meta.env.VITE_API_PREFIX}/`);
      const data = await response.json();

      console.log("data", data.user);

      if (data && data.user === 'Anonymous') {
        setUserAuth(null);
      }

      if (data && data.user !== 'Anonymous') {
        data.user['isConnected'] = true;
        setUserAuth(data.user);
      }

      if (!data) {
        setUserAuth(null);
      }
    }

    fetchData();
  }, [])

  const value = useMemo(() => ({ userAuthData, setUserAuth }), [userAuthData, setUserAuth]);

  return (
    <>
      <CookieConsent
        location="bottom"
        hideOnAccept={true}
        style={{ background: "#2B373B" }}
        buttonStyle={{ color: "#4e503b", fontSize: "13px" }}
        expires={1}
      >This website uses cookies to enhance the user experience. {" "}
      </CookieConsent>

      <AuthContext.Provider value={value}>
        <div className="flex flex-col min-h-screen">
          <div className="flex-grow">
            <Navbar />
            <Routes>
                <Route path='/' element={<Home />} />
                <Route path='/login' element={<Login />} />
                <Route path='/signup' element={<Signup />} />
                <Route path='/logout' element={<Logout />} />
                <Route path='/chat' element={<Chat />} />

                <Route path='/signup/get-started' element={<FormCreateAccount />} />

                {/* Create pages for not found then add a button for redirect */}
                <Route path='/404' element={<Home />} />
                <Route path='*' element={<Home />} />
            </Routes>
          </div>
          <Footer className="mt-auto"/>
        </div>
      </AuthContext.Provider>
    </>
  ) 
}