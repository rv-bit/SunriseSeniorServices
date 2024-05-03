import { Suspense, lazy, useState, useEffect, useMemo } from 'react'
import { Routes, Route } from 'react-router-dom'
import { useUser } from "@clerk/clerk-react";

import SocketioProvider from '@/providers/SocketioProvider'

import { Get } from '@/lib/utils.js' // Common functions
import { io } from 'socket.io-client';

const Navbar = lazy(() => import('./components/custom/Navbar.jsx'))
const Footer = lazy(() => import('./components/custom/Footer.jsx'))

const NotFound = lazy(() => import('./pages/(home)/NotFound.jsx'))
const Home = lazy(() => import('./pages/(home)/Home.jsx'))

const About = lazy(() => import('./pages/(information)/About.jsx'))
const Contact = lazy(() => import('./pages/(information)/Contact.jsx'))

const Login = lazy(() => import('./pages/(login)/Login.jsx'))
const Signup = lazy(() => import('./pages/(signup)/Signup.jsx'))
const Account = lazy(() => import('./pages/(account)/Account.jsx'))

const Chat = lazy(() => import('./pages/(chat)/Chat.jsx'))

const ViewJobListing = lazy(() => import('./pages/(job-listing)/ViewJobListing.jsx'))
const JobListing = lazy(() => import('./pages/(job-listing)/JobListing.jsx'))
const FormNewJobListing = lazy(() => import('./pages/(job-listing)/FormNewJobListing.jsx'))

export default function App() {
    const [socket, setSocket] = useState(null);

    useEffect(() => {
        var urlSocket = import.meta.env.VITE_SOCKET_URL;
        if (process.env.NODE_ENV === 'development') {
            urlSocket = 'http://localhost:5001';
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

        return () => {
            socketIo.off('connect');
            socketIo.off('disconnect');
            socketIo.off('connect_error');

            socketIo.close();
        }
    }, [])

    const valueSocket = useMemo(() => ({ socket }), [socket]);

    return (
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
                    <SocketioProvider.Provider value={valueSocket}>
                        <Navbar />
                        <Routes>
                            <Route path='/' element={<Home />} />
                            <Route path='/login' element={<Login />} />
                            <Route path='/signup' element={<Signup />} />
                            <Route path='/account' element={<Account />} />

                            <Route path='/chat' element={<Chat />} />

                            <Route path='/job-listings' element={<JobListing />} />
                            <Route path='/job-listings/viewjob/:jobId' element={<ViewJobListing />} />
                            <Route path='/job-listings/new' element={<FormNewJobListing />} />

                            <Route path='/about' element={<About />} />
                            <Route path='/contact' element={<Contact />} />

                            {/* Create pages for not found then add a button for redirect */}
                            <Route path='/404' element={<NotFound />} />
                            <Route path='*' element={<NotFound />} />
                        </Routes>
                    </SocketioProvider.Provider>
                </div>

                <Footer className="mt-auto" />
            </Suspense>
        </div>
    )

}
