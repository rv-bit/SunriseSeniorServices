import './App.css'

import { useState, useEffect, useMemo } from 'react'
import { Routes, Route } from 'react-router-dom'
import CookieConsent from "react-cookie-consent";

import { Navbar, Footer } from './utils' // Custom hooks
import { Post, Get, AuthContext } from './utils/utils' // Common functions

import * as Pages from './pages' // Import all pages

export default function App () {
  const [userAuthData, setUserAuth] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      const response = await Get(`${import.meta.env.VITE_API_PREFIX}/`);
      const data = await response.json();

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
                <Route path='/' element={<Pages.Home />} />
                <Route path='/login' element={<Pages.Login />} />
                <Route path='/signup' element={<Pages.Signup />} />
                <Route path='/logout' element={<Pages.Logout />} />
                <Route path='/chat' element={<Pages.Chat />} />

                <Route path='/job-listings' element={<Pages.JobListing />} />

                <Route path='/signup/get-started' element={<Pages.FormCreateAccount />} />

                {/* Create pages for not found then add a button for redirect */}
                <Route path='/404' element={<Pages.Home />} />
                <Route path='*' element={<Pages.Home />} />
            </Routes>
          </div>
          <Footer className="mt-auto"/>
        </div>
      </AuthContext.Provider>
    </>
  ) 
}