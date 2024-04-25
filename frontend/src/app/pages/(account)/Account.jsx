import { useState, useEffect, lazy, Suspense } from 'react'
import { useNavigate } from 'react-router-dom';
import { SignedIn, UserProfile, useAuth } from '@clerk/clerk-react'

import { Post, Get } from '@/app/lib/utils' // Common functions

import { DatePicker } from "antd"
import dayjs from "dayjs"

import useUserAuth from '@/app/hooks/useUserAuth'
import formSteps from "@/app/data/FormSignUp";

const Alertbox = lazy(() => import('@/app/components/custom/Alertbox'));

const Logout = () => {
    const navigate = useNavigate();
    const { signOut } = useAuth();

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
                button={{ second: "Cancel", main: "Submit" }}
            />
        </Suspense>
    )
}

const Account = () => {
    const navigate = useNavigate();
    const {isLoaded, isSignedIn, user} = useUserAuth();
    const [userDetails, setUserDetails] = useState(null);

    const selectOption = async (e, index) => {
        e.preventDefault();

        if (!isSignedIn) return;

        const option = e.target.value;

        const response = await Post(`${import.meta.env.VITE_API_PREFIX}/user/update`, {
            user: user.id,
            data: {
                account_type: option
            }
        });

         if (!response.ok) {
            const data = await response.json();
            return;
        }

        const data = await response.json();
        setUserDetails(data.data);
    }

    const choseDate = async (date, dateString, option) => {
        if (!isSignedIn) return;

        const response = await Post(`${import.meta.env.VITE_API_PREFIX}/user/update`, {
            user: user.id,
            data: {
                [option]: dateString
            }
        });

        if (!response.ok) {
            const data = await response.json();
            return;
        }

        const data = await response.json();
        setUserDetails(data.data);
    }

    const calculateAge = (birthday) => {
        birthday = new Date(birthday);

        const ageDifMs = Date.now() - birthday.getTime();
        const ageDate = new Date(ageDifMs);
        return Math.abs(ageDate.getUTCFullYear() - 1970);
    }

    useEffect(() => {        
        if (isLoaded && !isSignedIn) {
            navigate('/');
            return;
        }

        if (isLoaded && isSignedIn) {
            const fetchData = async () => {
                const response = await Get(`${import.meta.env.VITE_API_PREFIX}/user/${user.id}`);
                if (!response.ok) {
                    const data = await response.json();
                    return;
                }

                const data = await response.json();
                setUserDetails(data.data);
            }
            fetchData();
        }

        return () => {};
    }, [isSignedIn, isLoaded]);

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
        <div className="flex items-center justify-center">
            <SignedIn>
                <UserProfile>

                    <UserProfile.Page 
                        label="Edit Profile"
                        labelIcon={ <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-user-round-cog"><path d="M2 21a8 8 0 0 1 10.434-7.62"/><circle cx="10" cy="8" r="5"/><circle cx="18" cy="18" r="3"/><path d="m19.5 14.3-.4.9"/><path d="m16.9 20.8-.4.9"/><path d="m21.7 19.5-.9-.4"/><path d="m15.2 16.9-.9-.4"/><path d="m21.7 16.5-.9.4"/><path d="m15.2 19.1-.9.4"/><path d="m19.5 21.7-.4-.9"/><path d="m16.9 15.2-.4-.9"/></svg> }
                        url='/edit-profile'

                        children={
                            <div className="flex flex-col items-center justify-center h-full gap-2">
                                {Object.keys(formSteps).map((step, index) => {
                                    return (
                                        <div key={index} className="w-full flex justify-between items-center mx-5 gap-5">
                                            <div className="flex flex-col justify-start items-start text-sm font-medium text-center">
                                                <span className="text-xs text-gray-500">{step}</span>
                                                <span>{formSteps[step].find(form => form.type === 'selector')?.label || formSteps[step].find(form => form.type === 'date') && (userDetails && userDetails.option_age_user ? calculateAge(userDetails.option_age_user) : '')}</span>
                                            </div>

                                            <div className="flex justify-end items-center">
                                                {formSteps[step].find(form => form.type === 'selector')?.type === 'selector' ?
                                                    <select
                                                        key={index}
                                                        className="p-2 border border-gray-300 rounded-md"
                                                        onChange={(e) => selectOption(e)}    
                                                    >
                                                        {formSteps[step].map((form, indexForm) => {
                                                            return (
                                                                <option key={indexForm} value={form.name}>{form.label}</option>
                                                            )
                                                        })}
                                                    </select>
                                                :
                                                    <DatePicker 
                                                        value={(userDetails && userDetails.age) ? dayjs(userDetails.age).format('YYYY-MM-DD') : ''}
                                                        onChange={
                                                            (date, dateString) => {                                                            
                                                                choseDate(date, dateString, formSteps[step].find(form => form.type === 'date')?.name)
                                                            }
                                                    } />
                                                }
                                            </div>
                                        </div>
                                    )
                                })}
                            </div>
                        }
                    />

                    <UserProfile.Page
                        label="Logout"
                        labelIcon={ <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-log-out"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" x2="9" y1="12" y2="12"/></svg> }
                        url='/logout'

                        children={
                            <Logout />
                        }
                    />
                </UserProfile>
            </SignedIn>
        </div>
    )
}

export default Account