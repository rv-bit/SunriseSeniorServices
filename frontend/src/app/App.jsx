import { Suspense, lazy, useState, useEffect, useMemo } from 'react'
import { Routes, Route } from 'react-router-dom'

import AuthContext from '@/app/context/AuthContext'
import { Get } from '@/app/lib/utils.js' // Common functions

const Navbar = lazy(() => import('./components/custom/Navbar.jsx'))
const Footer = lazy(() => import('./components/custom/Footer.jsx'))

const NotFound = lazy(() => import('./pages/(home)/NotFound.jsx'))
const Home = lazy(() => import('./pages/(home)/Home.jsx'))

const Login = lazy(() => import('./pages/(login)/Login.jsx'))
const Signup = lazy(() => import('./pages/(signup)/Signup.jsx'))
const Logout = lazy(() => import('./pages/(logout)/Logout.jsx'))
const FormCreateAccount = lazy(() => import('./pages/(get-started-form)/FormCreateAccount.jsx'))

const Chat = lazy(() => import('./pages/(chat)/Chat.jsx'))

const ViewJobListing = lazy(() => import('./pages/(job-listing)/ViewJobListing.jsx'))
const JobListing = lazy(() => import('./pages/(job-listing)/JobListing.jsx'))
const FormNewJobListing = lazy(() => import('./pages/(job-listing)/FormNewJobListing.jsx'))

export default function App () {
    const [userAuthData, setUserAuth] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            const response = await Get(`${import.meta.env.VITE_API_PREFIX}/home`);
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
            <AuthContext.Provider value={value}>
                <div className="flex flex-col min-h-screen">
                    <Suspense fallback={
                        <div className="flex items-center justify-center h-screen">
                            <div className="relative">
                                <div className="h-24 w-24 rounded-full border-t-8 border-b-8 border-gray-200"></div>
                                <div className="absolute top-0 left-0 h-24 w-24 rounded-full border-t-8 border-b-8 border-blue-500 animate-spin"></div>
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

                                <Route path='/signup/get-started' element={<FormCreateAccount />} />
                                
                                <Route path='/chat' element={<Chat />} />

                                <Route path='/job-listings' element={<JobListing />} />
                                <Route path='/job-listings/viewjob/:currentJobId' element={<ViewJobListing />} />
                                <Route path='/job-listings/new' element={<FormNewJobListing />} />

                                {/* Create pages for not found then add a button for redirect */}
                                <Route path='/404' element={<NotFound />}/>
                                <Route path='*' element={<NotFound />}  />
                            </Routes>
                        </div>
                        
                        <Footer className="mt-auto"/>
                    </Suspense>
                </div>
            </AuthContext.Provider>
        </>
    ) 
}