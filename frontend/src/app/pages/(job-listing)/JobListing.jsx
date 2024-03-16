import React, { useState, useRef, useEffect, useLayoutEffect, Suspense, lazy } from 'react';
import { useNavigate, useLocation, useSearchParams } from 'react-router-dom';

import { isMobile } from 'react-device-detect';

import { Button } from '@/app/components/ui/button';
import { Input } from '@/app/components/ui/input';
import { Separator } from '@/app/components/ui/separator';

import { BsSearch, BsFillGeoAltFill } from "react-icons/bs";
import { ScrollArea, ScrollBar } from '@/app/components/ui/scroll-area';

const inputFields = [
    { name: 'jobTitle', placeholder: 'Job Title', icon: <BsSearch className='mx-3 size-5'/>, styleProps: `
        flex items-center text-slate-600 w-full h-full focus-within:outline-none focus-within:border focus-within:border-violet-700 
        focus-within:rounded-br-sm focus-within:rounded-tr-sm focus-within:rounded-bl-lg focus-within:rounded-tl-lg focus-within:border-b-4 hover:cursor-text
    `},
    { name: 'location', placeholder: 'Location', icon: <BsFillGeoAltFill className='mx-3 size-5'/>, styleProps: `
        flex items-center text-slate-600 w-full h-full focus-within:outline-none focus-within:border focus-within:border-r-2 focus-within:border-violet-700 
        focus-within:rounded-br-lg focus-within:rounded-tr-lg focus-within:rounded-bl-sm focus-within:rounded-tl-sm focus-within:border-b-4 hover:cursor-text
    `}
]

import useDocumentTitle from '@/app/hooks/UseDocumentTitle';

import { Get, formatTags } from '@/app/lib/utils';
import { Skeleton } from '@/app/components/ui/skeleton';

const Notification = lazy(() => import('@/app/components/custom/Notifications'));

const JobListing = () => {
    useDocumentTitle('Job Listings');

    const navigate = useNavigate();
    const location = useLocation();

    const queryParams = new URLSearchParams(location.search);
    const currentJobIdFromSearch = queryParams.get('currentJobId');

    const [jobListings, setJobListings] = useState([]);
    const [jobsDataIsLoading, setJobsDataLoad] = useState(false);
    
    const [searchInput, setSearchInput] = useState({ jobTitle: '', location: '' });
    const [searchResults, setSearchResults] = useState([]);
    
    const [currentJobId, setCurrentJobIds] = useState(null);

    const [userFromJobId, setUserFromJobId] = useState(null);
    const [waitingForUser, setWaitingForUser] = useState(false);

    const [alertState, setAlertState] = useState({
        open: false,
        message: '',
    });

    const alertHandleClose = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }

        setAlertState({ ...alertState, open: false });
    }

    const handleInputChange = (e, inputName) => {
        setSearchInput({
            ...searchInput,
            [inputName]: e.target.value
        });
    }

    const handleDeleteInput = (inputName) => {
        setSearchInput({
            ...searchInput,
            [inputName]: ''
        });
    }

    const handleCloseCurrentJobId = (e, jobId) => {
        e.preventDefault();
        if (jobId !== currentJobId) return;

        if (currentJobIdFromSearch) {
            navigate('/job-listings');
        }

        setCurrentJobIds(null);
    }
    
    const handleCurrentJobId = (e, jobId, middle) => {
        e.preventDefault();

        if (e.altKey && e.type === 'click' || e.type === 'auxclick') {
            const newWindow = windows.open(window.open(`${window.location.origin}/job-listings/viewjob?currentJobId=${jobId}`, '_blank', 'noopener,noreferrer'));

            if (newWindow) {
                newWindow.opener = null;
            }
        } else {
            setCurrentJobIds(jobId);

            if (isMobile || window.innerWidth < 1180) {
                navigate(`/job-listings/viewjob?currentJobId=${jobId}`)
            } else {
                navigate(`/job-listings?currentJobId=${jobId}`)
            }
        }
    }

    useEffect(() => {
        let timeoutId = null;

        const getJobListings = async () => {
            setJobsDataLoad(true);

            const response = await Get(`${import.meta.env.VITE_API_PREFIX}/getJobListings`);
            
            if (!response.ok) {
                const data = await response.json();
                setAlertState({ ...alertState, open: true, message: data.Error });
                return;
            }

            const data = await response.json();

            const newData = data.flat().map((job, index) => {
                const newJobTags = formatTags(job.tags);
                var dateParts = job.posted_at.split('-');
                var formattedDate = dateParts[2] + '/' + dateParts[1] + '/' + dateParts[0];

                return {
                    ...job,
                    tags: newJobTags,
                    posted_at: formattedDate
                }
            });

            timeoutId = setTimeout(() => {
                setJobsDataLoad(false);
                setJobListings(newData);
            }, 2500);
        }

        if (jobListings.length === 0) getJobListings();

        return () => {
            if (timeoutId) {
                clearTimeout(timeoutId);
            }
        }
    }, []);

    useEffect(() => {
        if (currentJobIdFromSearch && !currentJobId) {
            setCurrentJobIds(currentJobIdFromSearch);
        }

        return () => {}
    }, [jobListings]);

    useEffect(() => {
        if (currentJobIdFromSearch && currentJobIdFromSearch !== currentJobId) {
            const jobIndex = jobListings.findIndex((job) => job.id === currentJobIdFromSearch);

            if (jobIndex !== -1) {
                setCurrentJobIds(jobListings[jobIndex].id);
                return;
            }
            
            setCurrentJobIds(null);
        } else if (currentJobId && !currentJobIdFromSearch) {
            setCurrentJobIds(null);
        }

        return () => {}
    }, [currentJobIdFromSearch]);

    useEffect(() => {
        if (!currentJobId) return;

        let timeoutId = null;

        const getUserByIdFromJob = async (userId) => {
            setWaitingForUser(true);
            setUserFromJobId(null);

            const response = await Get(`${import.meta.env.VITE_API_PREFIX}/getUserByIdForJobListing?user_id=${userId}`);

            if (!response.ok) {
                const data = await response.json();

                if (data.Error) {
                    navigate('/job-listings');
                    setAlertState({ ...alertState, open: true, message: data.Error });
                    return;
                }

                setAlertState({ ...alertState, open: true, message: 'An error occurred while trying to fetch the user' });
                return;
            }

            const data = await response.json();

            timeoutId = setTimeout(() => {
                setWaitingForUser(false);
                setUserFromJobId(data);
            }, 2500);
        };

        getUserByIdFromJob(jobListings[jobListings.findIndex((job) => job.id === currentJobId)].user_id);

        return () => {
            if (timeoutId) {
                clearTimeout(timeoutId);
            }
        }
    }, [currentJobId]);

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

        return () => {}
    }, [jobListings, userFromJobId, currentJobIdFromSearch]);

    const elementJobListingAdvertisementRef = useRef(null);

    useLayoutEffect(() => {
        const handleScroll = () => {
            const scrollPosition = window.pageYOffset;
            const windowHeight = window.innerHeight;

            if (elementJobListingAdvertisementRef.current) {
                const elementPosition = elementJobListingAdvertisementRef.current.getBoundingClientRect().top;

                if (elementPosition < windowHeight) {

                }
            }
        }

        return () => {
            window.removeEventListener('scroll', handleScroll);
        }
    }, [currentJobIdFromSearch]);

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
            {alertState.open && (
                <Notification
                    open={alertState.open}
                    handleClose={alertHandleClose}
                    message={alertState.message}
                />
            )}
            
            <section className='mx-auto min-h-5'>
                <div className='flex items-center justify-center'>
                    <div className='mx-5'>
                        <h1 className='mb-10 text-3xl text-center font-bold text-slate-900'>Find your next job</h1>

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

                                                    <input name={input.name} onChange={(e) => handleInputChange(e, input.name)} className='outline-none w-3/4' type='text' placeholder={input.placeholder} value={searchInput[input.name]}/>
                                                
                                                    {searchInput[input.name] && (
                                                        <Button onClick={() => {handleDeleteInput(input.name)}} className='ml-1 bg-white hover:bg-[#a0a0a06e]'>
                                                            <span className='text-black'>X</span>
                                                        </Button>
                                                    )}
                                                </label>
                                            </div>
                                            {index < inputFields.length - 1 && ( <Separator className='h-6 w-px mr-2 ml-0.5 bg-slate-400' />)}
                                        </React.Fragment>
                                    )
                                })}
                                <Button className='mr-2'>Search</Button>
                            </div>
                        </div>

                        <div className='hidden max-md:block'>
                            <div className='flex items-center justify-center gap-2 h-max mx-auto'>
                                <div className='flex flex-col items-center gap-2'>
                                    {inputFields.map((input, index) => {
                                        return (
                                            <React.Fragment key={index}>
                                                <div className='h-full w-[400px] max-extraSm:w-[300px]'>
                                                    <label className='flex items-center border border-slate-600 text-slate-600 w-full h-[60px] px-2 rounded-lg focus-within:outline-none focus-within:border focus-within:border-violet-700 focus-within:rounded-br-sm focus-within:rounded-tr-sm focus-within:rounded-bl-lg focus-within:rounded-tl-lg focus-within:border-b-4 hover:cursor-text'>
                                                        <div className='flex items-center text-slate-600 w-full'>
                                                            {input.icon && (
                                                                input.icon
                                                            )}

                                                            <input name={input.name} onChange={(e) => handleInputChange(e, input.name)} className='outline-none w-full h-full' type='text' placeholder={input.placeholder} value={searchInput[input.name]} />
                                                        
                                                            {searchInput[input.name] && (
                                                                <Button onClick={() => {handleDeleteInput(input.name)}} className='bg-white hover:bg-[#a0a0a06e]'>
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

                        <div className='flex items-center justify-center'>
                            <h1 onClick={() => {navigate('/job-listings/new')}} className='w-fit my-5 text-center hover:underline hover:cursor-pointer text-[#e8562ddd] font-bold'>Post a help enquiry</h1>
                        </div>
                    </div>
                </div>

                <hr className='w-full opacity-30 border-t border-slate-400' />

                <div className='flex items-center justify-center w-full'>
                    <div className='flex justify-center my-5 w-[900px]'>
                        <div className='flex items-center flex-col mt-5 w-full'>
                            {
                                jobsDataIsLoading ?
                                    <div className='mx-5 h-auto mb-2 bg-white border-2 border-black rounded-lg lg:w-[700px] md:w-[700px] sm:w-[400px] extraSm:w-[400px] max-extraSm:w-[300px]'>
                                        <div className='flex items-center justify-between m-5'>
                                            <div className='w-full'>
                                                <div className="space-y-2 p-5">
                                                    <Skeleton className="h-4 w-[350px]" />
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
                                    jobListings.length === 0 ?
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

                            {jobListings.length !== 0 && jobListings.map((job, index) => {
                                const newIndex = index + 1;
                                const jobId = job.id;

                                return (
                                    <div
                                        ref={elementJobListingAdvertisementRef}
                                        key={newIndex}
                                        onClick={(e) => handleCurrentJobId(e, jobId)}
                                        onAuxClick={(e) => handleCurrentJobId(e, jobId, 'middle')}
                                        className={`mx-5 group h-auto mb-2 bg-white border-2 rounded-lg hover:cursor-pointer ${currentJobId ? 'lg:w-[500px] md:w-[700px] sm:w-[400px] extraSm:w-[400px] max-extraSm:w-[300px]' : 'lg:w-[700px] md:w-[700px] sm:w-[400px] extraSm:w-[400px] max-extraSm:w-[300px]' } ${currentJobId && currentJobId === jobId ? 'border-[#e8562d]' : 'border-black' }`}>

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
                                                    <p className='text-slate-600 text-sm'>Posted on {job.posted_at}</p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}

                            {jobListings.length !== 0 && (
                                <div className='flex items-center justify-center my-2 w-1/2'>
                                    <Button className='w-full'>Load More</Button>
                                </div>
                            )}
                        </div>

                        {currentJobId && (
                            <div className='w-[600px] h-dvh md:min-h-svh max-md:min-h-svh sticky top-2 z-50 lg:block md:hidden sm:hidden extraSm:hidden max-extraSm:hidden mr-5'>
                                <div 
                                    className={`bg-white border-2 border-black rounded-lg box-border`}
                                    style={{ height: `${newHeight + 2}px`  }}
                                >
                                    {waitingForUser ? 
                                        <div className='w-[600px]'>
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
                                        </div>
                                    :
                                        <React.Fragment>
                                            <div className='flex items-center'>
                                                <div ref={elementCurrentJobHeaderRef} className='shadow-md w-full rounded-sm'>
                                                    <div className='p-5'>
                                                        <Button onClick={(e) => {handleCloseCurrentJobId(e, currentJobId)}} className='bg-white hover:bg-[#a0a0a06e] absolute top-2 right-2'>
                                                            <span className='text-black'>X</span>
                                                        </Button>

                                                        <div className='w-11/12 inline-block whitespace-normal break-words'>
                                                            <h1 className='text-2xl font-bold text-slate-900'>{jobListings[jobListings.findIndex((job) => job.id === currentJobId)]?.title}</h1>
                                                            <h1 className='w-fit text-md text-slate-900 underline hover:cursor-pointer'>by {userFromJobId ? userFromJobId.name : ''}</h1>
                                                            <p className='text-slate-600 text-opacity-75'>{jobListings[jobListings.findIndex((job) => job.id === currentJobId)]?.location}</p>
                                                        </div>

                                                        <div role='tags' className='grid grid-flow-row-dense grid-cols-4 items-center mt-2 gap-1 text-center text-black text-opacity-70 group-hover:text-opacity-90'>
                                                            {Object.entries(jobListings[jobListings.findIndex((job) => job.id === currentJobId)]?.tags).filter(([key, value]) => value !== '' && key.startsWith('Tag_')).map(([key, value], index) => {
                                                                return (
                                                                    <div key={index} className='bg-slate-100 px-2 py-1 h-full rounded-md text-ellipsis overflow-hidden flex items-center justify-center'>
                                                                        <p className='text-xs'>{value}</p>
                                                                    </div>
                                                                )
                                                            })}
                                                        </div>

                                                        <Button className='mt-5 bg-[#dd673cfd] bg-opacity-90 hover:bg-[#e8432dea] hover:bg-opacity-100'>Message</Button>
                                                    </div>
                                                </div>
                                            </div>

                                            <ScrollArea className='w-full' style={{ height: `calc(100% - ${elementCurrentJobHeaderHeight}px)` }}>
                                                <div className='p-5'>
                                                    <h1 className='text-xl font-bold text-slate-900'>Job Details</h1>
                                                    <p className='text-slate-600'>Location: London, UK, WV10 9QL</p>
                                                </div>
                                                                                        <div className='p-5'>
                                                    <h1 className='text-xl font-bold text-slate-900'>Job Details</h1>
                                                    <p className='text-slate-600'>Location: London, UK, WV10 9QL</p>
                                                </div>
                                                                                        <div className='p-5'>
                                                    <h1 className='text-xl font-bold text-slate-900'>Job Details</h1>
                                                    <p className='text-slate-600'>Location: London, UK, WV10 9QL</p>
                                                </div>
                                                                                        <div className='p-5'>
                                                    <h1 className='text-xl font-bold text-slate-900'>Job Details</h1>
                                                    <p className='text-slate-600'>Location: London, UK, WV10 9QL</p>
                                                </div>
                                                                                        <div className='p-5'>
                                                    <h1 className='text-xl font-bold text-slate-900'>Job Details</h1>
                                                    <p className='text-slate-600'>Location: London, UK, WV10 9QL</p>
                                                </div>
                                                                                        <div className='p-5'>
                                                    <h1 className='text-xl font-bold text-slate-900'>Job Details</h1>
                                                    <p className='text-slate-600'>Location: London, UK, WV10 9QL</p>
                                                </div>
                                                                                        <div className='p-5'>
                                                    <h1 className='text-xl font-bold text-slate-900'>Job Details</h1>
                                                    <p className='text-slate-600'>Location: London, UK, WV10 9QL</p>
                                                </div>
                                                                                        <div className='p-5'>
                                                    <h1 className='text-xl font-bold text-slate-900'>Job Details</h1>
                                                    <p className='text-slate-600'>Location: London, UK, WV10 9QL</p>
                                                </div>

                                                                                        <div className='p-5'>
                                                    <h1 className='text-xl font-bold text-slate-900'>Job Details</h1>
                                                    <p className='text-slate-600'>Location: London, UK, WV10 9QL</p>
                                                </div>
                                                                                        <div className='p-5'>
                                                    <h1 className='text-xl font-bold text-slate-900'>Job Details</h1>
                                                    <p className='text-slate-600'>Location: London, UK, WV10 9QL</p>
                                                </div>
                                                                                        <div className='p-5'>
                                                    <h1 className='text-xl font-bold text-slate-900'>Job Details</h1>
                                                    <p className='text-slate-600'>Location: London, UK, WV10 9QL</p>
                                                </div>

                                                                                        <div className='p-5'>
                                                    <h1 className='text-xl font-bold text-slate-900'>Job Details</h1>
                                                    <p className='text-slate-600'>Location: London, UK, WV10 9QL</p>
                                                </div>
                                                                                        <div className='p-5'>
                                                    <h1 className='text-xl font-bold text-slate-900'>Job Details</h1>
                                                    <p className='text-slate-600'>Location: London, UK, WV10 9QL</p>
                                                </div>

                                                <ScrollBar orientation="vertical" />
                                            </ScrollArea>
                                        </React.Fragment>
                                    }
                                </div>
                            </div>
                        )}
                    </div>
                </div>

            </section>
        </Suspense>
    )
}

export default JobListing;