import { Suspense, lazy, useState, useEffect, useMemo } from 'react'
import { Routes, Route } from 'react-router-dom'
import CookieConsent from "react-cookie-consent";

import AuthContext from './context/AuthContext'
import { Get } from './lib/utils' // Common functions

const Navbar = lazy(() => import('./hooks/Navbar.jsx'))
const Footer = lazy(() => import('./hooks/Footer.jsx'))

const Home = lazy(() => import('./pages/home/Home.jsx'))
const Login = lazy(() => import('./pages/login/Login.jsx'))
const Signup = lazy(() => import('./pages/signup/Signup.jsx'))
const Logout = lazy(() => import('./pages/logout/Logout.jsx'))
const Chat = lazy(() => import('./pages/chat/Chat.jsx'))
const JobListing = lazy(() => import('./pages/job-listing/JobListing.jsx'))
const FormCreateAccount = lazy(() => import('./pages/get-started-form/FormCreateAccount.jsx'))

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
        location="middle"
        hideOnAccept={true}
        style={{
          "maxWidth":"500px",
          "borderRadius":"5px",
          "padding":"20px 30px",
          "backgroundColor":"white",
          "position":"fixed",
          "top":"50%",
          "left":"50%",
          "right":"auto",
          "bottom":"auto",
          "transform":"translate3d(-50%, -50%, 9999990px)",
          "width":"95%",
          "boxShadow":"0 3px 10px rgba(0,0,0,0.1)",
          "color": "black",
          "textAlign": "center",
          "alignItems": "center",
          "justifyContent": "center",
        }}
        overlay={true}
        buttonStyle={{ fontSize: "13px", backgroundColor: "#e2e2e2", borderRadius: "5px", padding: "10px 20px", margin: "0 10px"}}
        expires={30}
      >This website uses cookies to enhance the user experience.
      </CookieConsent>

      <AuthContext.Provider value={value}>
        <div className="flex flex-col min-h-screen">
          <Suspense fallback={
            <div className="flex items-center justify-center h-screen">
              <div className="relative">
                <div className="h-24 w-24 rounded-full border-t-8 border-b-8 border-gray-200"></div>
                <div className="absolute top-0 left-0 h-24 w-24 rounded-full border-t-8 border-b-8 border-blue-500 animate-spin">
                </div>
              </div>
            </div>
          }>
            <div className="flex-grow">
              <Navbar />

              <Routes>
                <Route path='/' element={<Home />} />
                <Route path='/login' element={<Login />} />
                <Route path='/signup' element={<Signup />} />
                <Route path='/logout' element={<Logout />} />
                <Route path='/chat' element={<Chat />} />

                <Route path='/job-listings' element={<JobListing />} />

                <Route path='/signup/get-started' element={<FormCreateAccount />} />

                {/* Create pages for not found then add a button for redirect */}
                <Route path='/404' element={<Home />} />
                <Route path='*' element={<Home />} />
              </Routes>
            </div>
            <Footer className="mt-auto"/>
          </Suspense>
        </div>
      </AuthContext.Provider>
    </>
  ) 
}