import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer, toast } from 'react-toastify';

import React, { useCallback, useEffect, useState, useContext } from 'react'
import { useNavigate, useParams } from 'react-router-dom';
import { useQuery, useQueryClient } from 'react-query';

import useUserAuth from '@/hooks/useUserAuth';
import useDocumentTitle from '@/hooks/useDocumentTitle';

import { Post, Get, formatTags, formatDate, handleOpenInNewTab, Delete } from '@/lib/utils';

import { Button } from '@/components/ui/button';
import { ChevronLeft } from "lucide-react";

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

const getJobListing = async (jobId) => {
    if (!jobId) {
        throw new Error('No job id provided');
    }

    const response = await Get(`${import.meta.env.VITE_API_PREFIX}/joblisting/viewjob/${jobId}`);

    if (!response.ok) {
        // throw new Error('An error occurred while trying to fetch the job');
        return null;
    }

    const data = await response.json();
    return data.data;
}

const ViewJobListing = () => {
    useDocumentTitle('View Job Listing');

    const navigate = useNavigate();
    const queryClient = useQueryClient();

    const { jobId } = useParams();

    const { isLoaded, isSignedIn, user } = useUserAuth();
    const [userDetails, setUserDetails] = useState(null);

    const { data: userAdditionalInfo, isLoading: userInfoIsLoading, isError: userInfoIsError, error: userInfoError, status: userInfoStatus } = useQuery(['userAdditionalInfo', user], () => fetchUserAdditionalInfo(user), {
        enabled: !!user && isLoaded && isSignedIn
    });

    const currentJobIdFromSearch = jobId;

    const { data: jobListing, status: jobsDataStatus, isLoading: jobsDataIsLoading, error: jobsDataError } = useQuery(['jobListing', currentJobIdFromSearch], () => getJobListing(currentJobIdFromSearch), {
        enabled: !!currentJobIdFromSearch,
    });

    const [waitForChatToCreate, setWaitForChatToCreate] = useState(false);

    const handleCloseCurrentJobId = (e, currentJobId) => {
        e.preventDefault();

        navigate(`/job-listings?currentJobId=${currentJobId}`);
    }

    const createChats = useCallback(async () => {
        const response = await Post(`${import.meta.env.VITE_API_PREFIX}/chats/createChat`, {
            data: {
                'members': [user.id, jobListing.user_id],
                'created_by': user.id,
                'name': jobListing.title,
            }
        });

        if (!response.ok) {
            toast.error('Failed to create chat');

            return false;
        }

        const data = await response.json();
        if (data.message) {
            toast.info('Chat already exists, moving to the chat');
            return data.data;
        }

        return data.data;
    });

    const handleChat = async (e, jobId) => {
        e.preventDefault();

        if (!user) {
            navigate('/login', { state: { info: 'You must be logged in to send a message!' } });
            return;
        }

        setWaitForChatToCreate(true);
        if (user.id === jobListing.user_id) {
            toast.error('You cannot message yourself');
            setWaitForChatToCreate(false);
            return;
        }

        const chatCreated = await createChats();
        if (!chatCreated) {
            setWaitForChatToCreate(false);
            return;
        }

        await queryClient.refetchQueries('gatherChats');

        setWaitForChatToCreate(false);
        if (e.altKey && e.type === 'click' || e.type === 'auxclick') {
            handleOpenInNewTab(e, `/chat/${chatCreated._id}`);
            return;
        }

        if (window.innerWidth < 1180) {
            navigate(`/chat/${chatCreated._id}`)
        } else {
            navigate(`/chat/${chatCreated._id}`)
        }
    }

    const handleDeletePost = async (e, jobId) => {
        e.preventDefault();

        if (!user) {
            navigate('/login', { state: { info: 'You must be logged in to delete a post!' } });
        }

        if (user.id !== jobListing.user_id) {
            toast.error('You cannot delete a post that is not yours');
            return;
        }

        const response = await Delete(`${import.meta.env.VITE_API_PREFIX}/joblisting/deleteListing/${jobId}`);

        if (!response.ok) {
            toast.error('Failed to delete job listing');
            return;
        }

        toast.success('Job listing deleted successfully');
        navigate('/job-listings');
        return response;
    }

    useEffect(() => {
        if (isLoaded && isSignedIn) {
            if (userAdditionalInfo) {
                setUserDetails(userAdditionalInfo);
            }
        }

        return () => { };
    }, [isSignedIn, isLoaded, userInfoStatus]);

    useEffect(() => {
        if (!currentJobIdFromSearch || jobsDataError) {
            navigate('/job-listings');
        }
    }, [currentJobIdFromSearch, jobsDataError]);

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

            <hr className='w-full opacity-30 border-t border-slate-400' />

            <div className='flex items-center justify-center w-full h-full gap-2 my-10 px-10 max-md:px-5'>
                <div className='flex items-center justify-center w-full h-full'>
                    <div className='flex justify-center flex-row w-full h-full max-md:justify-start'>
                        {jobsDataIsLoading ?
                            <React.Fragment>
                                <div className='flex items-center justify-center w-full h-full'>
                                    <p>Loading...</p>
                                </div>
                            </React.Fragment>
                            :
                            <React.Fragment>
                                <div className='flex flex-col gap-3 w-full lg:w-[500px] md:w-10/12 max-md:w-full'>
                                    <span
                                        onClick={(e) => handleCloseCurrentJobId(e, currentJobIdFromSearch)}
                                        className='flex items-center gap-1 -mt-5 hover:underline hover:cursor-pointer'>
                                        <ChevronLeft size={15} />
                                        <h1>Go Back</h1>
                                    </span>

                                    <div className='w-full inline-block whitespace-normal break-words'>
                                        <h1 className='text-xl max-lg:text-2xl lg:text-3xl font-bold text-slate-900'>{jobListing?.title}</h1>
                                        <p className='text-slate-600 text-opacity-75 mt-3'>{jobListing?.location}</p>

                                        <div className='lg:hidden md:block sm:block extraSm:block max-extraSm:block'>
                                            <div className='flex justify-start mt-5'>
                                                {userDetails && userDetails._id === jobListing?.person.id ?
                                                    <Button
                                                        onClick={(e) => handleDeletePost(e, currentJobIdFromSearch)}
                                                        onAuxClick={(e) => handleDeletePost(e, currentJobIdFromSearch)}
                                                    >
                                                        Delete Post
                                                    </Button>
                                                    :
                                                    <Button
                                                        disabled={waitForChatToCreate}
                                                        onClick={(e) => handleChat(e, currentJobIdFromSearch)}
                                                        onAuxClick={(e) => handleChat(e, currentJobIdFromSearch)}
                                                        className='w-[300px] bg-[#d06139c5] bg-opacity-80 hover:bg-[#e8432dea]'
                                                    >
                                                        Message
                                                    </Button>
                                                }
                                            </div>
                                        </div>

                                        <div className='mt-5'>
                                            <p className='text-3xl font-bold text-slate-900'>Full Job Description</p>
                                            <p className='font-normal text-slate-600'>{jobListing?.description}</p>
                                        </div>

                                        <div className='lg:hidden md:block sm:block extraSm:block max-extraSm:block'>
                                            <div className='flex my-5 w-full h-full'>
                                                <div role='tags' className='grid grid-flow-row-dense extraSm:grid-cols-3 max-extraSm:grid-cols-3 sm:grid-cols-5 md:grid-cols-7 items-center mt-2 gap-1 text-center text-black text-opacity-70 group-hover:text-opacity-90'>
                                                    {jobListing?.tags && typeof jobListing.tags === 'object' ? (
                                                        Object.entries(jobListing.tags)
                                                            .filter(([key, value]) => value !== '' && key.startsWith('Tag_'))
                                                            .map(([key, value], index) => {
                                                                return (
                                                                    <div key={index} className='bg-slate-100 px-2 py-2 h-full rounded-md text-ellipsis overflow-hidden flex items-center justify-center'>
                                                                        <p className='text-sm'>{value}</p>
                                                                    </div>
                                                                )
                                                            })
                                                    ) : null}
                                                </div>
                                            </div>
                                        </div>

                                        <p className='my-5 text-slate-600 text-opacity-75'>Posted by <span className='text-slate-900 underline'>{jobListing?.person.fullName}</span></p>

                                        <div className='mt-5'>
                                            <p className='text-slate-600 text-opacity-75'>Posted on <span className='text-slate-900'>{formatDate(jobListing?.posted_at)}</span></p>
                                        </div>

                                        <hr className='mt-10 w-full opacity-30 border-t border-slate-400' />

                                        {jobListing?.additional_information !== '' && (
                                            <div className='mt-5'>
                                                <p className='text-2xl font-bold text-slate-900'>Additional Information</p>
                                                <p className='font-normal text-slate-600'>{jobListing?.additional_information}</p>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                <div className='hidden lg:flex md:hidden sm:hidden extraSm:hidden max-extraSm:hidden'>
                                    <div className='ml-32 w-[300px]'>
                                        {userDetails && userDetails._id === jobListing?.person.id ?
                                            <Button
                                                onClick={(e) => handleDeletePost(e, currentJobIdFromSearch)}
                                                onAuxClick={(e) => handleDeletePost(e, currentJobIdFromSearch)}
                                            >
                                                Delete Post
                                            </Button>
                                            :
                                            <Button
                                                disabled={waitForChatToCreate}
                                                onClick={(e) => handleChat(e, currentJobIdFromSearch)}
                                                onAuxClick={(e) => handleChat(e, currentJobIdFromSearch)}
                                                className='w-[300px] bg-[#d06139c5] bg-opacity-80 hover:bg-[#e8432dea]'
                                            >
                                                Message
                                            </Button>
                                        }

                                        <div className='flex items-center justify-center mt-5'>
                                            <div role='tags' className='grid grid-flow-row-dense grid-cols-3 items-center mt-2 gap-1 text-center text-black text-opacity-70 group-hover:text-opacity-90'>
                                                {jobListing?.tags && typeof jobListing.tags === 'object' ? (
                                                    Object.entries(jobListing.tags)
                                                        .filter(([key, value]) => value !== '' && key.startsWith('Tag_'))
                                                        .map(([key, value], index) => {
                                                            return (
                                                                <div key={index} className='bg-slate-100 px-2 py-2 h-full rounded-md text-ellipsis overflow-hidden flex items-center justify-center'>
                                                                    <p className='text-sm'>{value}</p>
                                                                </div>
                                                            )
                                                        })
                                                ) : null}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </React.Fragment>
                        }
                    </div>
                </div>
            </div>
        </>
    )
}

export default ViewJobListing
