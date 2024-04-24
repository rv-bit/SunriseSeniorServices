import { useEffect, useContext, lazy, Suspense } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth, useClerk } from "@clerk/clerk-react";

import { Post, Get } from '@/app/lib/utils' // Common functions

const Alertbox = lazy(() => import('@/app/components/custom/Alertbox'));

const Logout = () => {
    const navigate = useNavigate();    
    const { signOut, isLoaded, isSignedIn } = useAuth();

    const onSubmit = async (e) => {
        e.preventDefault();

        signOut(() => {
            navigate('/');
        });
    }

    const onCancel = (e) => {
        e.preventDefault();
        navigate('/');
    }
        
    useEffect(() => {
        if (isLoaded && !isSignedIn) {
            navigate('/');
        }
    }, [isLoaded, isSignedIn, navigate]);

    if (!isLoaded) {
        return (
            <div className="flex items-center justify-center h-screen">
                <div className="relative">
                    <div className="h-24 w-24 rounded-full border-t-8 border-b-8 border-gray-200"></div>
                        <div className="absolute top-0 left-0 h-24 w-24 rounded-full border-t-8 border-b-8 border-blue-500 animate-spin">
                    </div>
                </div>
            </div>
        )
    }

    return (
        <Suspense fallback={
            <div className="flex items-center justify-center h-screen">
                <div className="relative">
                    <div className="h-24 w-24 rounded-full border-t-8 border-b-8 border-gray-200"></div>
                        <div className="absolute top-0 left-0 h-24 w-24 rounded-full border-t-8 border-b-8 border-blue-500 animate-spin">
                    </div>
                </div>
            </div>
        }>
            <Alertbox 
                Title="Logout" 
                Description="Are you sure you want to logout?" 
                onSubmit={onSubmit} 
                onCancel={onCancel} 
                button={{ second: "Cancel", main: "Submit" }} />
        </Suspense>
    )
}

export default Logout;