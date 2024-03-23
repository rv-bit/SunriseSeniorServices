import { useEffect, useContext, lazy, Suspense } from 'react';
import { useNavigate } from 'react-router-dom';

import AuthContext from '@/app/context/AuthContext'

import { Post, Get } from '@/app/lib/utils' // Common functions

const Alertbox = lazy(() => import('@/app/components/custom/Alertbox'));

const Logout = () => {
    const {userAuthData, setUserAuth} = useContext(AuthContext);
    const navigate = useNavigate();

    const onSubmit = async (e) => {
        e.preventDefault();

        const response = await Get(`${import.meta.env.VITE_API_PREFIX}/logout`);
        const data = await response.json();

        if (!response.ok) {
            setUserAuth(null);
            navigate('/');
        }

        if (response.ok) {
            setUserAuth(null);
            navigate('/');
        }
    }

    const onCancel = (e) => {
        e.preventDefault();

        navigate('/');
    }

    useEffect(() => {
        if (userAuthData === null || userAuthData === undefined) {
            navigate('/');
            return;
        }

        return () => {};
    }, []);

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