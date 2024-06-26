import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer, toast } from 'react-toastify';

import { useState, useEffect, lazy, Suspense, useRef } from 'react'
import { useNavigate } from 'react-router-dom';
import { useQuery } from 'react-query';

import { SignedIn, UserProfile, useAuth } from '@clerk/clerk-react'

import { Post, Get, calculateAge } from '@/lib/utils' // Common functions

import { DatePicker } from "antd"
import dayjs from "dayjs"

import useUserAuth from '@/hooks/useUserAuth'
import formSteps from "@/data/FormSignUp";

import { Button } from '@/components/ui/button';

const Alertbox = lazy(() => import('@/components/custom/Alertbox'));

const fetchUserAdditionalInfo = async (user) => {
    if (!user) {
        throw new Error('User is not defined');
    }

    const response = await Get(`${import.meta.env.VITE_API_PREFIX}/user/${user.id}`);
    const data = await response.json();

    if (!response.ok) {
        throw new Error(data.error);
    }

    return data.data;
}

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
    const { isLoaded, isSignedIn, user } = useUserAuth();
    const [userDetails, setUserDetails] = useState(null);

    const { data, status } = useQuery('user', () => fetchUserAdditionalInfo(user), {
        enabled: !!user && isLoaded && isSignedIn
    });

    const [userEditing, setUserEditing] = useState(null);
    const [userAboutInfo, setUserAboutInfo] = useState('');

    const editOptions = (e, step) => {
        e.preventDefault();

        setUserEditing(step);
    }

    const selectOption = async (e, index) => {
        e.preventDefault();

        if (!isSignedIn) return;

        const option = e.target.value;

        setUserEditing(null);

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

        setUserEditing(null);

        const age = calculateAge(dateString);

        if (!age) {
            toast.error('You must be at least 21 years old to use this service');
            return;
        };

        const response = await Post(`${import.meta.env.VITE_API_PREFIX}/user/update`, {
            user: user.id,
            data: {
                [option]: dateString
            }
        });

        if (!response.ok) {
            return;
        }

        const data = await response.json();
        setUserDetails(data.data);
    }

    const saveUserInfo = async () => {
        if (!isSignedIn) return;

        setUserEditing(null);

        const response = await Post(`${import.meta.env.VITE_API_PREFIX}/user/update`, {
            user: user.id,
            data: {
                option_about: userAboutInfo
            }
        });

        if (!response.ok) {
            return;
        }

        const data = await response.json();
        setUserDetails(data.data);
    }

    useEffect(() => {
        if (isLoaded && !isSignedIn) {
            navigate('/');
            return;
        }

        if (status === 'success') {
            setUserDetails(data);

            setUserAboutInfo(data.option_about || '');
        }

        return () => { };
    }, [isSignedIn, isLoaded, status]);

    const textareaRef = useRef();
    useEffect(() => {
        if (textareaRef.current && userAboutInfo) {
            textareaRef.current.focus();

            const length = textareaRef.current.value.length;
            textareaRef.current.selectionStart = length;
            textareaRef.current.selectionEnd = length;
        }
    }, [userAboutInfo]);

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
        <>
            <ToastContainer
                position="bottom-right"
                autoClose={5000}
                limit={3}
                hideProgressBar={false}
                newestOnTop
                closeOnClick
                rtl={false}
                pauseOnFocusLoss={false}
                draggable
                pauseOnHover
                theme="light"
                stacked={true}
            />

            <div className="flex items-center justify-center">
                <SignedIn>
                    <UserProfile>
                        <UserProfile.Page label="account" />
                        <UserProfile.Page label="security" />

                        <UserProfile.Page
                            label="Edit Profile"
                            labelIcon={<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-user-round-cog"><path d="M2 21a8 8 0 0 1 10.434-7.62" /><circle cx="10" cy="8" r="5" /><circle cx="18" cy="18" r="3" /><path d="m19.5 14.3-.4.9" /><path d="m16.9 20.8-.4.9" /><path d="m21.7 19.5-.9-.4" /><path d="m15.2 16.9-.9-.4" /><path d="m21.7 16.5-.9.4" /><path d="m15.2 19.1-.9.4" /><path d="m19.5 21.7-.4-.9" /><path d="m16.9 15.2-.4-.9" /></svg>}
                            url='/edit-profile'

                            children={
                                <div className="flex flex-col items-center justify-center h-full gap-2">
                                    {Object.keys(formSteps).map((step, index) => {
                                        return (
                                            <div key={index} className="w-full flex justify-between items-center mx-5 gap-5">
                                                <div className="flex flex-col justify-start items-start text-sm font-medium text-center w-[25%]">
                                                    <span className="text-xs text-gray-500">{step}</span>

                                                    <span className='max-w-full truncate'>
                                                        {
                                                            formSteps[step].reduce((label, form) => {
                                                                if (!label && form.type === 'selector' && userDetails) {
                                                                    if (!userDetails.account_type) {
                                                                        return 'Account Type is Required';
                                                                    }

                                                                    if (form.name === userDetails.account_type) {
                                                                        return form.label;
                                                                    }
                                                                } else if (!label && form.type === 'date' && userDetails) {
                                                                    if (!userDetails.option_age_user) {
                                                                        return 'Date of Birth is Required';
                                                                    }

                                                                    const age = calculateAge(userDetails.option_age_user);

                                                                    if (!age) {
                                                                        return 'You must be at least 21 years old to use this service';
                                                                    }

                                                                    return age.toString();
                                                                } else if (!label && form.type === 'textarea' && userDetails) {
                                                                    if (!userDetails.option_about) {
                                                                        return 'Tell us about yourself';
                                                                    }

                                                                    return userDetails.option_about;
                                                                }

                                                                return label;
                                                            }, null)
                                                        }
                                                    </span>
                                                </div>

                                                <div className="flex justify-end items-center">
                                                    {userEditing === null || userEditing !== step ?
                                                        <span className="text-sm font-medium text-center">
                                                            <Button className="py-2 px-8 border border-gray-300 rounded-md" onClick={(e) => editOptions(e, step)}>
                                                                Edit
                                                            </Button>
                                                        </span>

                                                        : null}

                                                    {(userEditing && userEditing === step) ?
                                                        formSteps[userEditing].find(form => form.type === 'selector')?.type === 'selector' ?
                                                            <div className="flex items-center justify-center gap-2">
                                                                <select
                                                                    key={index}
                                                                    className="p-2 border border-gray-300 rounded-md"
                                                                    onChange={(e) => selectOption(e)}
                                                                    value={userDetails.account_type || ''}
                                                                >
                                                                    {formSteps[step].map((form, indexForm) => {
                                                                        return (
                                                                            <option key={indexForm} value={form.name}>{form.label}</option>
                                                                        )
                                                                    })}
                                                                </select>

                                                                <Button className="py-2 px-8 border border-gray-300 rounded-md" onClick={(e) => setUserEditing(null)}>Cancel</Button>
                                                            </div>
                                                            :
                                                            formSteps[userEditing].find(form => form.type === 'date')?.type === 'date' ?
                                                                <div className="flex items-center justify-center gap-2">
                                                                    <DatePicker
                                                                        value={(userDetails && userDetails.age) ? dayjs(userDetails.age).format('YYYY-MM-DD') : ''}
                                                                        onChange={
                                                                            (date, dateString) => {
                                                                                choseDate(date, dateString, formSteps[step].find(form => form.type === 'date')?.name)
                                                                            }
                                                                        } />
                                                                    <Button className="py-2 px-8 border border-gray-300 rounded-md" onClick={(e) => setUserEditing(null)}>Cancel</Button>
                                                                </div>
                                                                :
                                                                formSteps[userEditing].find(form => form.type === 'textarea')?.type === 'textarea' ?
                                                                    <div className="flex items-center justify-center gap-2">
                                                                        <textarea
                                                                            ref={textareaRef}
                                                                            className="p-2 border border-gray-300 rounded-md"
                                                                            value={userAboutInfo || ''}
                                                                            onChange={(e) => {
                                                                                e.preventDefault(e)
                                                                                setUserAboutInfo(e.target.value)
                                                                            }}
                                                                        ></textarea>

                                                                        <Button className="py-2 px-8 border border-gray-300 rounded-md" onClick={(e) => saveUserInfo()}>Save</Button>
                                                                        <Button className="py-2 px-8 border border-gray-300 rounded-md" onClick={(e) => {
                                                                            setUserAboutInfo('')
                                                                            setUserEditing(null)
                                                                        }}>Cancel</Button>
                                                                    </div>
                                                                    : null
                                                        : null
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
                            labelIcon={<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-log-out"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" /><polyline points="16 17 21 12 16 7" /><line x1="21" x2="9" y1="12" y2="12" /></svg>}
                            url='/logout'

                            children={
                                <Logout />
                            }
                        />

                    </UserProfile>

                </SignedIn>
            </div>
        </>
    )
}

export default Account