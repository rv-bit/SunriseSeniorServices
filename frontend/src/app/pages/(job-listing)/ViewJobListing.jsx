import React, { useCallback, useEffect, useState, useContext } from 'react'
import { useNavigate, useLocation } from 'react-router-dom';
import { Post, Get, formatTags } from '@/app/lib/utils';

import AuthContext from '@/app/context/AuthContext';

import { Button } from '@/app/components/ui/button';

import { BsChevronLeft } from "react-icons/bs";
import useDocumentTitle from '@/app/hooks/UseDocumentTitle';

import { Notification } from '@/app/components/custom/Notifications';

const ViewJobListing = () => {
    useDocumentTitle('View Job Listing');

    const {userAuthData} = useContext(AuthContext);

    const navigate = useNavigate();
    const location = useLocation();

    const queryParams = new URLSearchParams(location.search);
    const currentJobIdFromSearch = queryParams.get('currentJobId');
    
    const [jobListing, setJobListing] = useState({});
    const [jobsDataLoad, setJobsDataLoad] = useState(false);

    const [alertState, setAlertState] = useState({
        open: false,
        message: '',
    });

    const handleCloseCurrentJobId = (e, currentJobId) => {
        e.preventDefault();

        navigate(`/job-listings?currentJobId=${currentJobId}`);
    }

    const [waitForChatToCreate, setWaitForChatToCreate] = useState(false);

    const createChats = useCallback(async (chatId) => {
        const response = await Post(`${import.meta.env.VITE_API_PREFIX}/createChat`, {data: {
            'id': chatId,
            'members': [userAuthData._id, jobListing.user_id],
            'name': jobListing.title,
        }});

        if (!response.ok) {
            const data = await response.json();

            setAlertState({ ...alertState, open: true, message: data.Error });
            return false;
        }

        const data = await response.json();
        if (data.chatExists) {
            setAlertState({ ...alertState, open: true, message: 'Chat already exists, moving to the chat' });
            return true;
        }

        if (data.Success) {
            return true;
        }
    });

    const handleChat = async (e, jobId) => {
        e.preventDefault();

        if (userAuthData === null || userAuthData === undefined) {            
            navigate('/login', { state: { info: 'You must be logged in to send a message!' } } );
        } else {
            setWaitForChatToCreate(true);

            const chatId = jobId + userAuthData._id + jobListing.user_id;
            const chatCreated = await createChats(chatId);
            
            if (!chatCreated) {
                return setTimeout(() => {
                    setWaitForChatToCreate(false);
                }, 2500);
            }

            setTimeout(() => {
                setWaitForChatToCreate(false);

                if (e.altKey && e.type === 'click' || e.type === 'auxclick') {
                    handleOpenInNewTab(e, `/chat?currentChatId=${chatId}`);
                } else {
                    if (window.innerWidth < 1180) {
                        navigate(`/chat?currentChatId=${chatId}`)
                    } else {
                        navigate(`/chat?currentChatId=${chatId}`)
                    }
                }
            }, 2500);
        }
    }

    useEffect(() => {
        const getJobListing = async () => {
            setJobsDataLoad(true);

            const response = await Get(`${import.meta.env.VITE_API_PREFIX}/getJobListingById?currentJobIdFromSearch=${currentJobIdFromSearch}`);
            
            if (!response.ok) {
                const data = await response.json();

                if (data.Error) {
                    setAlertState({ ...alertState, open: true, message: data.Error });
                    navigate('/job-listings');
                    return;
                }

                setAlertState({ ...alertState, open: true, message: 'An error occurred while trying to fetch the job' });
                return;
            }

            const data = await response.json();
            const newJobTags = formatTags(data.tags);

            var dateParts = data.posted_at.split('-');
            var formattedDate = dateParts[2] + '/' + dateParts[1] + '/' + dateParts[0];

            const responseUserBasedOfUserJobID = await Get(`${import.meta.env.VITE_API_PREFIX}/getUserByIdForJobListing?user_id=${data.user_id}`);

            if (!responseUserBasedOfUserJobID.ok) {
                const data = await responseUserBasedOfUserJobID.json();

                if (data.Error) {
                    navigate('/job-listings');
                    setAlertState({ ...alertState, open: true, message: data.Error });
                    return;
                }

                setAlertState({ ...alertState, open: true, message: 'An error occurred while trying to fetch the user' });
                return;
            }

            const dataUserBasedOfUserJobID = await responseUserBasedOfUserJobID.json();

            const newData = {
                ...data,
                tags: newJobTags,
                posted_at: formattedDate,
                person: dataUserBasedOfUserJobID.name,
            }

            setJobsDataLoad(false);
            setJobListing(newData);
        }

        getJobListing();

        if (!currentJobIdFromSearch) {
            navigate('/job-listings');
        }

        return () => {}
    }, []);

    return (
        <React.Fragment>
            {alertState.open && (
                <Notification
                    alertState={alertState}
                    setAlertState={setAlertState}
                />
            )}

            <hr className='w-full opacity-30 border-t border-slate-400' />

            <div className='flex items-center justify-center w-full h-full gap-2 my-10 px-10 max-extraSm:px-0'>                
                <div className='flex items-center justify-center w-full h-full'>
                    <div className='flex justify-center flex-row w-full h-full'>

                        <div className='flex flex-col gap-3 w-full lg:w-[500px] md:w-3/4 max-extraSm:w-10/12'>

                            <span
                                onClick={(e) => handleCloseCurrentJobId(e, currentJobIdFromSearch)}
                                className='flex items-center gap-1 -mt-5 hover:underline hover:cursor-pointer'>
                                <BsChevronLeft size={15}/>
                                <h1>Go Back</h1>
                            </span>

                            <div className='w-full inline-block whitespace-normal break-words'>
                                <h1 className='text-xl max-lg:text-2xl lg:text-3xl font-bold text-slate-900'>{jobListing?.title}</h1>
                                <p className='text-slate-600 text-opacity-75 mt-3'>{jobListing?.location}</p>

                                <div className='lg:hidden md:block sm:block extraSm:block max-extraSm:block'>
                                    <div className='flex justify-start mt-5'>
                                        <Button 
                                            disabled={waitForChatToCreate}
                                            onClick={(e) => handleChat(e, currentJobIdFromSearch)}
                                            onAuxClick={(e) => handleChat(e, currentJobIdFromSearch)}
                                            className='w-[300px] bg-[#d06139c5] bg-opacity-80 hover:bg-[#e8432dea]'>Message
                                        </Button>
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

                                <p className='my-5 text-slate-600 text-opacity-75'>Posted by <span className='text-slate-900 underline'>{jobListing?.person}</span></p>

                                <div className='mt-5'>
                                    <p className='text-slate-600 text-opacity-75'>Posted on <span className='text-slate-900'>{jobListing?.posted_at}</span></p>
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
                                <Button 
                                    disabled={waitForChatToCreate}
                                    onClick={(e) => handleChat(e, currentJobIdFromSearch)}
                                    onAuxClick={(e) => handleChat(e, currentJobIdFromSearch)}
                                    className='w-full mt-5 bg-[#d06139c5] bg-opacity-80 hover:bg-[#e8432dea]'>Message
                                </Button>

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
                    </div>
                </div>

            </div>
        </React.Fragment>
    )
}

export default ViewJobListing
