import { Suspense, lazy, useState, useEffect, useMemo } from 'react'
import { Routes, Route } from 'react-router-dom'
import { useUser } from "@clerk/clerk-react";

import AuthProvider from '@/app/providers/AuthProvider'
import SocketioProvider from '@/app/providers/SocketioProvider'

import { Get } from '@/app/lib/utils.js' // Common functions
import { io } from 'socket.io-client';

const Navbar = lazy(() => import('./components/custom/Navbar.jsx'))
const Footer = lazy(() => import('./components/custom/Footer.jsx'))

const NotFound = lazy(() => import('./pages/(home)/NotFound.jsx'))
const Home = lazy(() => import('./pages/(home)/Home.jsx'))

const About = lazy(() => import('./pages/(information)/About.jsx'))
const Contact = lazy(() => import('./pages/(information)/Contact.jsx'))

const Login = lazy(() => import('./pages/(login)/Login.jsx'))
const Signup = lazy(() => import('./pages/(signup)/Signup.jsx'))
const FormCreateAccount = lazy(() => import('./pages/(signup)/FormCreateAccount.jsx'))

const Logout = lazy(() => import('./pages/(logout)/Logout.jsx'))

const Chat = lazy(() => import('./pages/(chat)/Chat.jsx'))

const ViewJobListing = lazy(() => import('./pages/(job-listing)/ViewJobListing.jsx'))
const JobListing = lazy(() => import('./pages/(job-listing)/JobListing.jsx'))
const FormNewJobListing = lazy(() => import('./pages/(job-listing)/FormNewJobListing.jsx'))

export default function App () {
    const { isSignedIn, user, isLoaded } = useUser();
    
    const [socket, setSocket] = useState(null);
    const [userAuthData, setUserAuth] = useState(null);

    useEffect(() => {
        var urlSocket = import.meta.env.VITE_SOCKET_URL;
        if (process.env.NODE_ENV === 'development') {
            urlSocket = 'http://localhost:3000';
        }
        const socketIo = io.connect(urlSocket, { transports: ["websocket"] });

        socketIo.on('connect', () => {
            console.log('Connected to the server');
            setSocket(socketIo);
        });

        socketIo.on('disconnect', () => {
            console.log('Disconnected from the server');
            setSocket(null);
        });

        socketIo.on('connect_error', (error) => {
            console.log('Connection Error', error);
            setSocket(null);
        });

        if (isSignedIn && isLoaded) {
            setUserAuth(user);
        }

        return () => {
            socketIo.off('connect');
            socketIo.off('disconnect');
            socketIo.off('connect_error');
        }
    }, [isLoaded])

    const value = useMemo(() => ({ userAuthData, setUserAuth }), [userAuthData, setUserAuth]);
    const valueSocket = useMemo(() => ({ socket }), [socket]);

    return (
        <>
            <AuthProvider.Provider value={value}>
                <SocketioProvider.Provider value={valueSocket}>
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
                                    <Route path='/job-listings/viewjob' element={<ViewJobListing />} />
                                    <Route path='job-listings/viewjob' element={<ViewJobListing />} />
                                    <Route path='/job-listings/new' element={<FormNewJobListing />} />
                                    
                                    <Route path='/about' element={<About />} />
                                    <Route path='/contact' element={<Contact />} />
                                    
                                    {/* Create pages for not found then add a button for redirect */}
                                    <Route path='/404' element={<NotFound />}/>
                                    <Route path='*' element={<NotFound />}  />
                                </Routes>
                            </div>
                            
                            <Footer className="mt-auto"/>
                        </Suspense>
                    </div>
                </SocketioProvider.Provider>
            </AuthProvider.Provider>
        </>
    ) 
}
