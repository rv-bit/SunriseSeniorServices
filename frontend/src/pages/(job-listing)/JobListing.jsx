import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer, toast } from 'react-toastify';

import React, { useState, useRef, useEffect, useLayoutEffect, useCallback, useContext, Suspense, lazy } from 'react';
import { useNavigate, useLocation, useSearchParams } from 'react-router-dom';
import { useQuery, useQueryClient } from 'react-query';

import useUserAuth from '@/hooks/useUserAuth';
import useDocumentTitle from '@/hooks/useDocumentTitle';

import { Get, Post, formatTags, formatDate, handleOpenInNewTab, calculateAge } from '@/lib/utils';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';
import { Skeleton } from '@/components/ui/skeleton';

import { Search, MapPin } from "lucide-react"

const currentColor = '#e8562d';
const inputFields = [
    {
        name: 'jobTitle', placeholder: 'Job Title', icon: <Search className='mx-3 size-5' />, styleProps: `
        flex items-center text-slate-600 w-full h-full focus-within:outline-none focus-within:border focus-within:border-[${currentColor}]
        focus-within:rounded-br-sm focus-within:rounded-tr-sm focus-within:rounded-bl-lg focus-within:rounded-tl-lg focus-within:border-b-4 hover:cursor-text
    `},
    {
        name: 'location', placeholder: 'Location', icon: <MapPin className='mx-3 size-5' />, styleProps: `
        flex items-center text-slate-600 w-full h-full focus-within:outline-none focus-within:border focus-within:border-r-2 focus-within:border-[${currentColor}] 
        focus-within:rounded-br-lg focus-within:rounded-tr-lg focus-within:rounded-bl-sm focus-within:rounded-tl-sm focus-within:border-b-4 hover:cursor-text
    `}
]

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

const getJobListings = async (user, fetchUsersPostsOnly) => {
    const response = await Get(`${import.meta.env.VITE_API_PREFIX}/joblisting`);

    if (!response.ok) {
        throw new Error(data.error);
    }

    const data = await response.json();

    const newData = data.data.flat().map((job, index) => {
        job.hours = job.hours || 0;
        job.location = job.location || 'Location not specified';

        job.tags = {
            payment_type: job.payment_type,
            payment_amount: job.payment_amount,
            category: job.category,
            start_date: job.start_date,
            days: job.days,
            hours: job.hours,
        }

        const newJobTags = formatTags(job.tags);

        return {
            ...job,
            tags: newJobTags,
        }
    });

    if (fetchUsersPostsOnly) {
        return newData.filter((job) => job.user_id === user.id);
    }

    return newData.filter((job) => job.user_id !== user.id);
}

const ActiveJobListings = (props) => {
    const {
        user,
        isLoaded,
        isSignedIn,
        userDetails,

        locationFromSearch,
        jobTitleFromSearch
    } = props;

    const navigate = useNavigate();
    const location = useLocation();
    const queryClient = useQueryClient();

    const { data: jobListings, isLoading: jobListingsIsLoading, isError: jobListingsIsError, error: jobListingsError, status: jobListingStatus } = useQuery(['activeJobListings'], () => getJobListings(user, true), {
        enabled: !!user && isLoaded && isSignedIn
    });

    const [searchParams, setSearchParams] = useSearchParams();
    const currentJobIdFromSearch = searchParams.get('currentJobId');

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

    const handleCurrentJobId = (e, jobId) => {
        e.preventDefault();

        handleOpenInNewTab(e, `/job-listings/viewjob/${jobId}`);
    }

    return (
        <div className='flex items-center justify-center w-full'>
            <div className='flex justify-center my-5 max-md:w-full max-md:px-2 w-[900px]'>
                <div className='flex items-center flex-col mt-5 w-full'>
                    {
                        jobListingsIsLoading ?
                            <div className='mx-5 h-auto mb-2 bg-white border-2 border-black rounded-lg lg:w-[700px] md:w-[700px] max-md:w-full'>
                                <div className='flex items-center justify-between m-5'>
                                    <div className='w-full'>
                                        <div className="space-y-2 p-5">
                                            <Skeleton className="h-4 w-[250px] md:w-[350px] lg:w-[350px]" />
                                            <Skeleton className="h-4 w-[200px]" />

                                            <div className='flex flex-row items-center gap-2'>
                                                <Skeleton className="h-2 w-[50px]" />
                                                <Skeleton className="h-2 w-[50px]" />
                                                <Skeleton className="h-2 w-[50px]" />
                                                <Skeleton className="h-2 w-[50px]" />
                                            </div>

                                            <Skeleton className="h-4 w-[100px]" />
                                        </div>
                                    </div>
                                </div>
                            </div>
                            :
                            (jobListings && jobListings.length === 0 || (jobListings && jobListings
                                .filter(job =>
                                    (job.location && locationFromSearch !== null ? job.location.toLowerCase().includes(locationFromSearch.toLocaleLowerCase()) : job) &&
                                    (job.title && jobTitleFromSearch !== null ? job.title.toLowerCase().includes(jobTitleFromSearch.toLocaleLowerCase()) : job)
                                ).length === 0)) ?
                                <div className='flex items-center justify-center w-full h-full gap-2'>
                                    <div className='flex items-center justify-center gap-2 w-full'>
                                        <div className='flex items-center justify-center w-full h-full gap-2'>
                                            <div className='flex items-center justify-center w-full h-full gap-2'>
                                                <h1 className='text-xl font-bold text-slate-900'>No job listings found</h1>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                : null
                    }

                    {(jobListings && jobListings.length !== 0) && jobListings
                        .filter(job =>
                            (job.location && locationFromSearch !== null ? job.location.toLowerCase().includes(locationFromSearch.toLocaleLowerCase()) : job) &&
                            (job.title && jobTitleFromSearch !== null ? job.title.toLowerCase().includes(jobTitleFromSearch.toLocaleLowerCase()) : job)
                        ).sort((a, b) => {
                            const formattedDateA = a.posted_at?.replace(/-/g, (match, index, original) => {
                                return (original.indexOf(match) === 4 || original.indexOf(match) === 7) ? '-' : ' ';
                            }).replace(':', ':');

                            const formattedDateB = b.posted_at?.replace(/-/g, (match, index, original) => {
                                return (original.indexOf(match) === 4 || original.indexOf(match) === 7) ? '-' : ' ';
                            }).replace(':', ':');

                            const dateA = a.posted_at ? new Date(formattedDateA) : 0;
                            const dateB = b.posted_at ? new Date(formattedDateB) : 0;

                            return dateB - dateA;
                        }).map((job, index) => {
                            const newIndex = index + 1;
                            const jobId = job._id;
                            const formattedDate = formatDate(job.posted_at);

                            return (
                                <div
                                    key={newIndex}
                                    onClick={(e) => handleCurrentJobId(e, jobId)}
                                    onAuxClick={(e) => handleCurrentJobId(e, jobId)}
                                    className={`mx-5 group h-auto mb-2 bg-white border-2 rounded-lg hover:cursor-pointer ${currentJobIdFromSearch ? 'lg:w-[500px] md:w-[700px] max-md:w-full' : 'lg:w-[700px] md:w-[700px] max-md:w-full'} ${currentJobIdFromSearch && currentJobIdFromSearch === jobId ? 'border-[#e8562d]' : 'border-black'}`}>

                                    <div className='flex items-center justify-between m-5'>
                                        <div className='w-full'>

                                            <div className='w-full inline-block break-words whitespace-normal'>
                                                <h1 className='text-xl font-bold text-slate-900 group-hover:underline'>{job.title}</h1>
                                                <p className='text-slate-600'>{job.location}</p>
                                                <p className='text-slate-600 text-sm line-clamp-2'>{job.description}</p>
                                            </div>

                                            <div role='tags' className='grid grid-flow-row-dense grid-cols-4 items-center mt-2 gap-1 text-center text-black text-opacity-70 group-hover:text-opacity-90'>
                                                {Object.entries(job.tags)
                                                    .filter(([key, value]) => value !== '' && key.startsWith('Tag_'))
                                                    .map(([key, value], index) => {
                                                        return (
                                                            <div key={index} className='bg-slate-100 px-2 py-1 h-full rounded-md text-ellipsis overflow-hidden flex items-center justify-center'>
                                                                <p className='text-xs'>{value}</p>
                                                            </div>
                                                        )
                                                    })
                                                }
                                            </div>

                                            <div className='flex items-center mt-3'>
                                                <p className='text-slate-600 text-sm'>Posted on {formattedDate}</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                </div>
            </div>
        </div>
    )
}

const AllJobListings = (props) => {
    const {
        user,
        isLoaded,
        isSignedIn,
        userDetails,

        locationFromSearch,
        jobTitleFromSearch
    } = props;

    const navigate = useNavigate();
    const location = useLocation();
    const queryClient = useQueryClient();

    const { data: jobListings, isLoading: jobListingsIsLoading, isError: jobListingsIsError, error: jobListingsError, status: jobListingStatus } = useQuery(['jobListings'], () => getJobListings(user), {
        enabled: !!user && isLoaded && isSignedIn
    });

    const [searchParams, setSearchParams] = useSearchParams();
    const currentJobIdFromSearch = searchParams.get('currentJobId');

    const [currentJobId, setCurrentJobId] = useState(null);

    const [userFromJobId, setUserFromJobId] = useState(null);
    const [waitingForUser, setWaitingForUser] = useState(false);

    const [waitForChatToCreate, setWaitForChatToCreate] = useState(false);

    const handleCloseCurrentJobId = (e, jobId) => {
        e.preventDefault();
        if (jobId !== currentJobId) return;

        if (currentJobIdFromSearch) {
            navigate('/job-listings');
        }

        setCurrentJobId(null);
    }

    const handleCurrentJobId = (e, jobId) => {
        e.preventDefault();

        if (e.altKey === true && e.type === 'click' || e.type === 'auxclick') {
            handleOpenInNewTab(e, `/job-listings/viewjob/${jobId}`);
        } else {
            setCurrentJobId(jobId);

            if (window.innerWidth < 1180) {
                navigate(`/job-listings/viewjob/${jobId}`)
            } else {
                navigate(`/job-listings?currentJobId=${jobId}`)
            }
        }
    }

    const createChats = useCallback(async () => {
        const response = await Post(`${import.meta.env.VITE_API_PREFIX}/chats/createChat`, {
            data: {
                'members': [user.id, userFromJobId.id],
                'created_by': user.id,
                'name': jobListings[jobListings.findIndex((job) => job._id === currentJobId)]?.title,
            }
        });

        if (!response.ok) {
            toast.error('An error occurred while trying to create the chat');
            return false;
        }

        const data = await response.json();
        if (data.chatExists) {
            toast.error('Chat already exists, moving to the chat');
            return data.data;
        }

        await queryClient.invalidateQueries('gatherChats');
        return data.data;
    });

    const handleChat = async (e, jobId) => {
        e.preventDefault();

        if (!user) {
            navigate('/login', { state: { info: 'You must be logged in to send a message!' } });
            return;
        }

        setWaitForChatToCreate(true);
        if (user.id === userFromJobId.id) {
            toast.error('You cannot message yourself');

            return setTimeout(() => {
                setWaitForChatToCreate(false);
            }, 2500);
        }

        const chatCreated = await createChats();
        if (!chatCreated) {
            return setTimeout(() => {
                setWaitForChatToCreate(false);
            }, 2500);
        }

        setTimeout(() => {
            setWaitForChatToCreate(false);

            if (e.altKey && e.type === 'click' || e.type === 'auxclick') {
                handleOpenInNewTab(e, `/chat?currentChatId=${chatCreated._id}`);
                return;
            }

            if (window.innerWidth < 1180) {
                navigate(`/chat?currentChatId=${chatCreated._id}`)
            } else {
                navigate(`/chat?currentChatId=${chatCreated._id}`)
            }
        }, 2500);
    }

    useEffect(() => {
        if (jobListings && jobListings.length === 0) {
            setCurrentJobId(null);
            navigate('/job-listings');
        }

        if (currentJobIdFromSearch && !currentJobId) {
            setCurrentJobId(currentJobIdFromSearch);
        }

        return () => { }
    }, [jobListings]);

    useEffect(() => {
        if (jobListingStatus !== 'success') return;

        const jobFound = jobListings.find((job) => job._id === currentJobIdFromSearch);
        if (!jobFound) {
            setCurrentJobId(null);
            setSearchParams(prevSearchInput => {
                const newSearchParams = new URLSearchParams(prevSearchInput);
                newSearchParams.delete('currentJobId');

                return newSearchParams.toString();
            });

            return;
        }

        if (currentJobIdFromSearch && currentJobIdFromSearch !== currentJobId) {
            const jobIndex = jobListings.findIndex((job) => job._id === currentJobIdFromSearch);

            if (jobIndex !== -1) {
                setCurrentJobId(jobListings[jobIndex]._id);
                return;
            }

            setCurrentJobId(null);
        } else if (currentJobId && !currentJobIdFromSearch) {
            setCurrentJobId(null);
        }

        return () => { }
    }, [currentJobIdFromSearch, jobListingStatus]);

    useEffect(() => {
        if (jobListingStatus !== 'success') return;
        if (!currentJobId) return;

        let timeoutId = null;

        const getUserByIdFromJob = async (userId) => {
            if (!userId) return;

            setWaitingForUser(true);
            setUserFromJobId(null);

            const response = await Get(`${import.meta.env.VITE_API_PREFIX}/joblisting/${userId}`);

            if (!response.ok) {
                const data = await response.json();

                if (data.error === "UserNotFound") {
                    const index = jobListings.findIndex((job) => job._id === currentJobId);
                    if (index !== -1) {
                        jobListings.splice(index, 1);
                    }
                }

                setCurrentJobId(null);
                navigate('/job-listings');
                toast.error('An error occurred while trying to fetch the user');
                return;
            }

            const data = await response.json();

            timeoutId = setTimeout(() => {
                setWaitingForUser(false);
                setUserFromJobId(data.data);
            }, 2500);
        };

        getUserByIdFromJob(jobListings[jobListings.findIndex((job) => job._id === currentJobId)]?.user_id);

        return () => {
            if (timeoutId) {
                clearTimeout(timeoutId);
            }
        }
    }, [currentJobId, jobListingStatus]);

    useEffect(() => {
        if (jobListingStatus !== 'success') return;

        const jobListingLength = jobListings.filter(job =>
            (job.location && locationFromSearch !== null ? job.location.toLowerCase().includes(locationFromSearch.toLocaleLowerCase()) : job) &&
            (job.title && jobTitleFromSearch !== null ? job.title.toLowerCase().includes(jobTitleFromSearch.toLocaleLowerCase()) : job)
        )

        if (jobListingLength.length === 0 && currentJobId) {
            setCurrentJobId(null);
            setSearchParams(prevSearchInput => {
                const newSearchParams = new URLSearchParams(prevSearchInput);
                newSearchParams.delete('currentJobId');

                return newSearchParams.toString();
            });
        }
    }, [locationFromSearch, jobTitleFromSearch, jobListingStatus]);

    const [newHeight, setNewHeight] = useState(930);
    useLayoutEffect(() => {
        const handleEvent = () => {
            const scrollPosition = window.pageYOffset;
            const windowHeight = window.innerHeight;
            const windowWidth = window.innerWidth;

            const height = Math.round(scrollPosition * 1.05);

            let newHeight = 930 + (height * 0.8);

            switch (true) {
                case (newHeight > windowHeight):
                    newHeight = windowHeight - 20;
                    break;

                case (newHeight <= 300):
                    newHeight = 300;
                    break;

                case (newHeight < windowHeight && newHeight > 300):
                    newHeight = windowHeight - 410 + height;
                    if (newHeight >= windowHeight) newHeight = windowHeight - 20;
                    break;

                default:
                    break;
            }

            setNewHeight(newHeight);
        };

        window.addEventListener('scroll', handleEvent);
        window.addEventListener('resize', handleEvent);

        return () => {
            window.removeEventListener('scroll', handleEvent);
            window.removeEventListener('resize', handleEvent);
        };
    }, []);

    const elementCurrentJobHeaderRef = useRef(null);
    const [elementCurrentJobHeaderHeight, setElementCurrentJobHeaderHeight] = useState(0);

    useLayoutEffect(() => {
        if (elementCurrentJobHeaderRef.current) {
            setElementCurrentJobHeaderHeight(elementCurrentJobHeaderRef.current.getBoundingClientRect().height);
        }

        return () => { }
    }, [jobListings, userFromJobId, currentJobIdFromSearch]);

    const elementJobListingAdvertisementRef = useRef(null);
    useLayoutEffect(() => {
        const handleScroll = () => {
            const scrollPosition = window.pageYOffset;
            const windowHeight = window.innerHeight;

            if (elementJobListingAdvertisementRef.current) {
                const elementPosition = elementJobListingAdvertisementRef.current.getBoundingClientRect().top;

                if (elementPosition < windowHeight) {
                    elementJobListingAdvertisementRef.current.style.opacity = 1;
                    elementJobListingAdvertisementRef.current.style.transform = 'translateY(0)';
                }
            }
        }

        return () => {
            window.removeEventListener('scroll', handleScroll);
        }
    }, [currentJobIdFromSearch]);

    return (
        <div className='flex items-center justify-center w-full'>
            <div className='flex justify-center my-5 max-md:w-full max-md:px-2 w-[900px]'>
                <div className='flex items-center flex-col mt-5 w-full'>
                    {
                        jobListingsIsLoading ?
                            <div className='mx-5 h-auto mb-2 bg-white border-2 border-black rounded-lg lg:w-[700px] md:w-[700px] max-md:w-full'>
                                <div className='flex items-center justify-between m-5'>
                                    <div className='w-full'>
                                        <div className="space-y-2 p-5">
                                            <Skeleton className="h-4 w-[250px] md:w-[350px] lg:w-[350px]" />
                                            <Skeleton className="h-4 w-[200px]" />

                                            <div className='flex flex-row items-center gap-2'>
                                                <Skeleton className="h-2 w-[50px]" />
                                                <Skeleton className="h-2 w-[50px]" />
                                                <Skeleton className="h-2 w-[50px]" />
                                                <Skeleton className="h-2 w-[50px]" />
                                            </div>

                                            <Skeleton className="h-4 w-[100px]" />
                                        </div>
                                    </div>
                                </div>
                            </div>
                            :
                            (jobListings && jobListings.length === 0 || (jobListings && jobListings
                                .filter(job =>
                                    (job.location && locationFromSearch !== null ? job.location.toLowerCase().includes(locationFromSearch.toLocaleLowerCase()) : job) &&
                                    (job.title && jobTitleFromSearch !== null ? job.title.toLowerCase().includes(jobTitleFromSearch.toLocaleLowerCase()) : job)
                                ).length === 0)) ?
                                <div className='flex items-center justify-center w-full h-full gap-2'>
                                    <div className='flex items-center justify-center gap-2 w-full'>
                                        <div className='flex items-center justify-center w-full h-full gap-2'>
                                            <div className='flex items-center justify-center w-full h-full gap-2'>
                                                <h1 className='text-xl font-bold text-slate-900'>No job listings found</h1>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                : null
                    }

                    {(jobListings && jobListings.length !== 0) && jobListings
                        .filter(job =>
                            (job.location && locationFromSearch !== null ? job.location.toLowerCase().includes(locationFromSearch.toLocaleLowerCase()) : job) &&
                            (job.title && jobTitleFromSearch !== null ? job.title.toLowerCase().includes(jobTitleFromSearch.toLocaleLowerCase()) : job)
                        ).sort((a, b) => {
                            const formattedDateA = a.posted_at?.replace(/-/g, (match, index, original) => {
                                return (original.indexOf(match) === 4 || original.indexOf(match) === 7) ? '-' : ' ';
                            }).replace(':', ':');

                            const formattedDateB = b.posted_at?.replace(/-/g, (match, index, original) => {
                                return (original.indexOf(match) === 4 || original.indexOf(match) === 7) ? '-' : ' ';
                            }).replace(':', ':');

                            const dateA = a.posted_at ? new Date(formattedDateA) : 0;
                            const dateB = b.posted_at ? new Date(formattedDateB) : 0;

                            return dateB - dateA;
                        }).map((job, index) => {
                            const newIndex = index + 1;
                            const jobId = job._id;
                            const formattedDate = formatDate(job.posted_at);

                            return (
                                <div
                                    ref={elementJobListingAdvertisementRef}
                                    key={newIndex}
                                    onClick={(e) => handleCurrentJobId(e, jobId)}
                                    onAuxClick={(e) => handleCurrentJobId(e, jobId)}
                                    className={`mx-5 group h-auto mb-2 bg-white border-2 rounded-lg hover:cursor-pointer ${currentJobId ? 'lg:w-[500px] md:w-[700px] max-md:w-full' : 'lg:w-[700px] md:w-[700px] max-md:w-full'} ${currentJobId && currentJobId === jobId ? 'border-[#e8562d]' : 'border-black'}`}>

                                    <div className='flex items-center justify-between m-5'>
                                        <div className='w-full'>

                                            <div className='w-full inline-block break-words whitespace-normal'>
                                                <h1 className='text-xl font-bold text-slate-900 group-hover:underline'>{job.title}</h1>
                                                <p className='text-slate-600'>{job.location}</p>
                                                <p className='text-slate-600 text-sm line-clamp-2'>{job.description}</p>
                                            </div>

                                            <div role='tags' className='grid grid-flow-row-dense grid-cols-4 items-center mt-2 gap-1 text-center text-black text-opacity-70 group-hover:text-opacity-90'>
                                                {Object.entries(job.tags)
                                                    .filter(([key, value]) => value !== '' && key.startsWith('Tag_'))
                                                    .map(([key, value], index) => {
                                                        return (
                                                            <div key={index} className='bg-slate-100 px-2 py-1 h-full rounded-md text-ellipsis overflow-hidden flex items-center justify-center'>
                                                                <p className='text-xs'>{value}</p>
                                                            </div>
                                                        )
                                                    })
                                                }
                                            </div>

                                            <div className='flex items-center mt-3'>
                                                <p className='text-slate-600 text-sm'>Posted on {formattedDate}</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                </div>

                {currentJobId && (
                    <div className='w-[600px] h-dvh md:min-h-svh max-md:min-h-svh sticky top-2 z-50 lg:block md:hidden sm:hidden extraSm:hidden max-extraSm:hidden mr-5'>
                        <div
                            className={`bg-white border-2 border-black rounded-lg box-border w-[600px]`}
                            style={{ height: `${newHeight - 12}px` }}
                        >
                            {waitingForUser ?
                                <React.Fragment>
                                    <div className='flex items-center'>
                                        <div className="space-y-2 p-5">
                                            <Skeleton className="h-4 w-[350px]" />
                                            <Skeleton className="h-4 w-[200px]" />
                                        </div>
                                    </div>

                                    <hr className='w-11/12 mx-5 opacity-30 border-t border-slate-400' />

                                    <div className="space-y-2 p-5">
                                        <Skeleton className="h-4 w-[300px]" />
                                        <Skeleton className="h-4 w-[200px]" />
                                        <Skeleton className="h-4 w-full" />
                                        <Skeleton className="h-4 w-full" />
                                    </div>
                                </React.Fragment>
                                :
                                (jobListingStatus === 'success' && (jobListings && jobListings.length > 0 && jobListings[jobListings.findIndex((job) => job._id === currentJobId)])) ?
                                    <React.Fragment>
                                        <div className='flex items-center'>
                                            <div ref={elementCurrentJobHeaderRef} className='shadow-md w-full rounded-sm'>
                                                <div className='p-5'>
                                                    <Button onClick={(e) => { handleCloseCurrentJobId(e, currentJobId) }} className='bg-white hover:bg-[#a0a0a06e] absolute top-2 right-2'>
                                                        <span className='text-black'>X</span>
                                                    </Button>

                                                    <div className='w-11/12 inline-block whitespace-normal break-words'>
                                                        <h1 className='text-2xl font-bold text-slate-900'>{jobListings[jobListings.findIndex((job) => job._id === currentJobId)]?.title}</h1>
                                                        <h1 className='w-fit text-md text-slate-900 underline hover:cursor-pointer'>by {userFromJobId ? userFromJobId.fullName : ''}</h1>
                                                        <p className='text-slate-600 text-opacity-75'>{jobListings[jobListings.findIndex((job) => job._id === currentJobId)]?.location}</p>
                                                    </div>

                                                    <div role='tags' className='grid grid-flow-row-dense grid-cols-4 items-center mt-2 gap-1 text-center text-black text-opacity-70 group-hover:text-opacity-90'>
                                                        {Object.entries(jobListings[jobListings.findIndex((job) => job._id === currentJobId)]?.tags).filter(([key, value]) => value !== '' && key.startsWith('Tag_')).map(([key, value], index) => {
                                                            return (
                                                                <div key={index} className='bg-slate-100 px-2 py-1 h-full rounded-md text-ellipsis overflow-hidden flex items-center justify-center'>
                                                                    <p className='text-xs'>{value}</p>
                                                                </div>
                                                            )
                                                        })}
                                                    </div>

                                                    <Button
                                                        disabled={waitForChatToCreate}
                                                        onClick={(e) => handleChat(e, currentJobId)}
                                                        onAuxClick={(e) => handleChat(e, currentJobId)}
                                                        className='mt-5 bg-[#dd673cfd] bg-opacity-90 hover:bg-[#e8432dea] hover:bg-opacity-100'>Message</Button>
                                                </div>
                                            </div>
                                        </div>

                                        <ScrollArea className='w-full min-w-[90%]' style={{ height: `calc(100% - ${elementCurrentJobHeaderHeight}px)` }}>
                                            <div className='w-full flex flex-col gap-5 whitespace-normal break-words p-5'>
                                                <h1 className='text-xl font-bold text-slate-900'>Job Details</h1>
                                                <p className='text-slate-600'>{jobListings[jobListings.findIndex((job) => job._id === currentJobId)]?.location}</p>

                                                <h1 className='text-xl font-bold text-slate-900'>Job Full Description</h1>
                                                <p className='text-slate-600 line-clamp-2'>{jobListings[jobListings.findIndex((job) => job._id === currentJobId)]?.description}</p>

                                                {jobListings[jobListings.findIndex((job) => job._id === currentJobId)]?.additional_information && (
                                                    <React.Fragment>
                                                        <hr className='w-full opacity-30 border-t border-slate-400' />

                                                        <h1 className='text-xl font-bold text-slate-900'>Job Additional Details</h1>
                                                        <p className='text-slate-600'>{jobListings[jobListings.findIndex((job) => job._id === currentJobId)]?.additional_information}</p>
                                                    </React.Fragment>
                                                )}
                                            </div>

                                            <ScrollBar orientation="vertical" />
                                        </ScrollArea>
                                    </React.Fragment>
                                    : ''
                            }
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}

const JobListing = () => {
    useDocumentTitle('Job Listings');

    const navigate = useNavigate();

    const { isLoaded, isSignedIn, user } = useUserAuth();
    const [userDetails, setUserDetails] = useState(null);

    const { data: userAdditionalInfo, isLoading: userInfoIsLoading, isError: userInfoIsError, error: userInfoError, status: userInfoStatus } = useQuery(['userAdditionalInfo', user], () => fetchUserAdditionalInfo(user), {
        enabled: !!user && isLoaded && isSignedIn
    });

    const { data: jobListings, isLoading: jobListingsIsLoading, isError: jobListingsIsError, error: jobListingsError, status: jobListingStatus } = useQuery(['allActiveJobListings'], () => getJobListings(user, true), {
        enabled: !!user && isLoaded && isSignedIn
    })

    const [searchParams, setSearchParams] = useSearchParams();

    const locationFromSearch = searchParams.get('location');
    const jobTitleFromSearch = searchParams.get('jobTitle');

    const [searchInput, setSearchInput] = useState(
        {
            jobTitle: jobTitleFromSearch ? jobTitleFromSearch : '',
            location: locationFromSearch ? locationFromSearch : ''
        }
    );
    const [searchResults, setSearchResults] = useState([]);
    const [currentTab, setCurrentTab] = useState('All');

    const handleInputChange = (e, inputName) => {
        setSearchInput({
            ...searchInput,
            [inputName]: e.target.value
        });

        setSearchParams(prevSearchInput => {
            const newSearchParams = new URLSearchParams(prevSearchInput);

            if (e.target.value === '') {
                newSearchParams.delete(inputName);
                return newSearchParams.toString();
            }

            newSearchParams.set(inputName, e.target.value);
            return newSearchParams.toString();
        });
    }

    const handleDeleteInput = (inputName) => {
        setSearchInput({
            ...searchInput,
            [inputName]: ''
        });

        setSearchParams(prevSearchInput => {
            const newSearchParams = new URLSearchParams(prevSearchInput);
            newSearchParams.delete(inputName);

            return newSearchParams.toString();
        });
    }

    const handleChangeTab = (e) => {
        e.preventDefault();

        setCurrentTab(e.target.value);
    }

    useEffect(() => {
        if (isLoaded && isSignedIn) {
            if (userAdditionalInfo) {
                setUserDetails(userAdditionalInfo);
            }
        }

        return () => { };
    }, [isSignedIn, isLoaded, userInfoStatus]);

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
            <ToastContainer
                position="bottom-right"
                autoClose={5000}
                limit={3}
                hideProgressBar={false}
                newestOnTop
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
                theme="light"
                stacked={true}
            />

            <section className='mx-auto min-h-5'>
                <div className='flex flex-col items-center justify-center mx-5'>
                    <h1 className='mb-10 text-3xl text-center font-bold text-slate-900'>Find people in need for help</h1>

                    <div className='flex items-center max-md:hidden'>
                        <div className='flex items-center border border-slate-600 rounded-lg h-[60px] shadow-2xl'>
                            {inputFields.map((input, index) => {
                                return (
                                    <React.Fragment key={index}>
                                        <div className='w-[300px] h-full mr-1'>
                                            <label className={input.styleProps}>
                                                {input.icon && (
                                                    input.icon
                                                )}

                                                <input name={input.name} onChange={(e) => handleInputChange(e, input.name)} className='outline-none w-3/4' type='text' placeholder={input.placeholder} value={searchParams.get(input.name) ? searchParams.get(input.name) : searchInput[input.name]} />

                                                {searchInput[input.name] && (
                                                    <Button onClick={() => { handleDeleteInput(input.name) }} className='ml-1 bg-white hover:bg-[#a0a0a06e]'>
                                                        <span className='text-black'>X</span>
                                                    </Button>
                                                )}
                                            </label>
                                        </div>
                                        {index < inputFields.length - 1 && (<Separator className='h-6 w-px mr-2 ml-0.5 bg-slate-400' />)}
                                    </React.Fragment>
                                )
                            })}
                            <Button className='mr-2'>Search</Button>
                        </div>
                    </div>

                    <div className='hidden max-md:block w-full'>
                        <div className='flex items-center justify-center gap-2 h-max'>
                            <div className='flex flex-col items-center gap-2 w-full'>
                                {inputFields.map((input, index) => {
                                    return (
                                        <React.Fragment key={index}>
                                            <div className='h-full w-[400px] max-md:w-full'>
                                                <label className={`flex items-center border border-slate-600 text-slate-600 w-full h-[60px] px-2 rounded-lg focus-within:outline-none focus-within:border focus-within:border-[${currentColor}] focus-within:rounded-br-sm focus-within:rounded-tr-sm focus-within:rounded-bl-lg focus-within:rounded-tl-lg focus-within:border-b-4 hover:cursor-text`}>
                                                    <div className='flex items-center text-slate-600 w-full'>
                                                        {input.icon && (
                                                            input.icon
                                                        )}

                                                        <input name={input.name} onChange={(e) => handleInputChange(e, input.name)} className='outline-none w-full h-full' type='text' placeholder={input.placeholder} value={searchInput[input.name]} />

                                                        {searchInput[input.name] && (
                                                            <Button onClick={() => { handleDeleteInput(input.name) }} className='bg-white hover:bg-[#a0a0a06e]'>
                                                                <span className='text-black'>X</span>
                                                            </Button>
                                                        )}
                                                    </div>
                                                </label>
                                            </div>
                                        </React.Fragment>
                                    )
                                })}
                            </div>
                        </div>

                        <div className='flex items-center justify-center mt-5'>
                            <Button className='w-full'>Search</Button>
                        </div>
                    </div>

                    {userDetails && userDetails.account_type === 'option_requester' && calculateAge(userDetails.option_age_user) >= 21 && (
                        <div className='flex items-center justify-center my-5'>
                            <h1 onClick={() => { navigate('/job-listings/new') }} className='w-fit text-center hover:underline hover:cursor-pointer text-[#e8562ddd] font-bold'>Post a help enquiry</h1>
                        </div>
                    )}

                    <div className='flex items-center justify-center w-full gap-2'>
                        <Button className={`bg-inherit text-black hover:bg-inherit rounded-none h-fit py-0 pb-2 ${currentTab === 'All' ? `border-[${currentColor}] border-b-4` : ''}`} value="All" onClick={handleChangeTab}>All</Button>
                        <Button className={`bg-inherit text-black hover:bg-inherit rounded-none h-fit py-0 pb-2 ${currentTab === 'Active' ? `border-[${currentColor}] border-b-4` : ''}`} value="Active" onClick={handleChangeTab}>Active ({jobListings ? jobListings.length : 0})</Button>
                    </div>
                </div>

                <hr className='w-full opacity-30 border-t border-slate-400' />

                {currentTab === 'All' ?
                    <AllJobListings
                        user={user}
                        isLoaded={isLoaded}
                        isSignedIn={isSignedIn}
                        userDetails={userDetails}

                        locationFromSearch={locationFromSearch}
                        jobTitleFromSearch={jobTitleFromSearch}
                    />
                    :
                    <ActiveJobListings
                        user={user}
                        isLoaded={isLoaded}
                        isSignedIn={isSignedIn}
                        userDetails={userDetails}

                        locationFromSearch={locationFromSearch}
                        jobTitleFromSearch={jobTitleFromSearch}
                    />
                }

            </section>
        </Suspense >
    )
}

export default JobListing;