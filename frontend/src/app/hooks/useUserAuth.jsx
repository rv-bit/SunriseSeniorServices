import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth, useUser } from '@clerk/clerk-react';
import { Post } from '../lib/utils';

const useUserAuth = () => {
    const navigate = useNavigate();

    const { isLoaded, isSignedIn } = useAuth();
    const { user } = useUser();

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

    return { isLoaded, isSignedIn, user };
};

export default useUserAuth;