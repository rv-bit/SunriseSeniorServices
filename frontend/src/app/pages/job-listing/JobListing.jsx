import React, { useState, useRef, useEffect, Suspense, lazy } from 'react';
import { useNavigate, createSearchParams, useSearchParams } from 'react-router-dom';

import { isMobile } from 'react-device-detect';

import { Button } from '@/app/components/ui/button';
import { Input } from '@/app/components/ui/input';
import { Separator } from '@/app/components/ui/separator';

import { BsSearch, BsFillGeoAltFill } from "react-icons/bs";
import { ScrollArea, ScrollBar } from '@/app/components/ui/scroll-area';

import ViewJobListing from './ViewJobListing';

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

// import jobListings from '@/app/data/JobListinTemp';
import useDocumentTitle from '@/app/hooks/UseDocumentTitle';

const Notification = lazy(() => import('@/app/components/custom/Notifications'));

const JobListing = () => {
    useDocumentTitle('Job Listings');

    const navigate = useNavigate();
    const [searchParams, setSearchParams] = useSearchParams();

    const [jobListings, setJobListings] = useState([]);
    const [jobsDataIsLoading, setJobsDataLoad] = useState(false);

    const [userIsLoading, setUserLoad] = useState(false);
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

    useEffect(() => {
        const getJobListings = async () => {
            setJobsDataLoad(true);

            const response = await fetch(`${import.meta.env.VITE_API_PREFIX}/getJobListings`);
            
            if (!response.ok) {
                const data = await response.json();
                setAlertState({ ...alertState, open: true, message: data.Error });
                return;
            }
    
            const data = await response.json();

            const newData = data.flat().map((job, index) => {
                return {
                    ...job
                }
            });

            setJobsDataLoad(false);
            setJobListings(newData);
        }

        getJobListings();
        return () => {}
    }, []);
    
    const [searchInput, setSearchInput] = useState({ jobTitle: '', location: '' });
    const [searchResults, setSearchResults] = useState([]);
    
    const [currentJobId, setCurrentJobId] = useState(null);
    const currentJobIdFromSearch = searchParams && searchParams.get('currentJobId') ? searchParams.get('currentJobId') : null;

    const handleCurrentJobId = (e, index) => {
        e.preventDefault();
        const idJob = jobListings[index].id;

        setCurrentJobId(idJob);
    }

    useEffect(() => {
        if (!currentJobId) return;

        setSearchParams({ 'currentJobId': currentJobId });

        if (isMobile || window.innerWidth < 1180) {
            navigate({
                pathname: '/job-listings/viewjob',
                search: `?currentJobId=${currentJobId}`
            })

            return;
        }

        return () => {}
    }, [currentJobId]);


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

    const handleCloseCurrentJobId = (e, index) => {
        e.preventDefault();
        if (index !== currentJobIdFromSearch) return;

        if (searchParams.has('currentJobId')) {
            searchParams.delete('currentJobId');
            setSearchParams(searchParams);
        }

        setCurrentJobId(null);
    }

    const handleCreateNewJobListing = (e) => {
        e.preventDefault();

        navigate('/job-listings/new');
    }

    const [newHeight, setNewHeight] = useState(930);
    useEffect(() => {
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
    
    useEffect(() => {
        if (elementCurrentJobHeaderRef.current) {
            setElementCurrentJobHeaderHeight(elementCurrentJobHeaderRef.current.getBoundingClientRect().height);
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
                    <div className='mx-auto'>

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
                            <div className='flex items-center justify-center gap-2 h-max'>
                                <div className='flex flex-col items-center gap-2'>
                                    {inputFields.map((input, index) => {
                                        return (
                                            <React.Fragment key={index}>
                                                <div className='h-full mr-1 w-[400px] max-extraSm:w-[300px]'>
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

                            <div className='flex items-center justify-center mt-5 mr-2'>
                                <Button className='w-full'>Search</Button>
                            </div>
                        </div>

                        <div className='flex items-center justify-center'>
                            <h1 onClick={handleCreateNewJobListing} className='w-fit my-5 text-center hover:underline hover:cursor-pointer text-[#e8562ddd] font-bold'>Post a help enquiry</h1>
                        </div>
                    </div>
                </div>

                <hr className='w-full opacity-30 border-t border-slate-400' />

                <div className='flex justify-center min-h-5 my-5'>
                    <div className='flex items-center flex-col flex-nowrap mt-5 mx-4'>
                        {jobListings.map((job, index) => {
                            return (
                                <div
                                    key={index}
                                    onClick={(e) => handleCurrentJobId(e, index)} 
                                    className={
                                        `group w-full h-auto mb-2 bg-white border-2 border-black rounded-lg hover:cursor-pointer ${currentJobIdFromSearch ? 'lg:w-[500px] max-extraSm:w-11/12' : 'lg:w-full md:w-11/12 sm:w-11/12 extraSm:w-2/3 max-extraSm:w-2/3' }
                                        ${currentJobIdFromSearch && currentJobIdFromSearch >= 0 ? 'mr-5 extraSm:mx-5 max-extraSm:mx-5' : '' }
                                        ${currentJobIdFromSearch && currentJobIdFromSearch === index ? 'border-[#e8562ddd]' : 'border-black' }
                                    `}>

                                    <div className='flex items-center justify-between m-5 overflow-hidden'>
                                        <div>
                                            <h1 className='text-xl font-bold text-slate-900 group-hover:underline'>{job.title}</h1>
                                            <p className='text-slate-600'>{job.location}</p>

                                            <div className='flex items-center my-4'>
                                                <p className='text-slate-600 text-sm line-clamp-2'>{job.description}</p>
                                            </div>

                                            <div role='tags' className='grid grid-flow-row-dense grid-cols-4 items-center mt-2 gap-1 text-center text-black text-opacity-70 group-hover:text-opacity-90'>
                                                {/* {job.tags.map((tag, indexTag) => {
                                                    return (
                                                        <div key={indexTag} className='bg-slate-100 px-2 py-1 rounded-md text-ellipsis overflow-hidden'>
                                                            <p className='text-xs'>{tag.name}</p>
                                                        </div>
                                                    )
                                                })} */}
                                            </div>

                                            <div className='flex items-center mt-3'>
                                                <p className='text-slate-600 text-sm'>Posted on {job.posted_at}</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}

                        <div className='flex items-center justify-center my-2'>
                            <Button className='w-full'>Load More</Button>
                        </div>
                    </div>

                    {currentJobIdFromSearch && currentJobIdFromSearch >= 0 && (
                        <div className='w-[600px] h-dvh md:min-h-svh max-md:min-h-svh sticky top-2 bottom-2 z-50 lg:block md:hidden sm:hidden extraSm:hidden max-extraSm:hidden mr-5'>
                            <div 
                                className={`bg-white border-2 border-black rounded-lg box-border overflow-hidden`}
                                style={{ height: `${newHeight + 2}px`  }}
                            >
                                <div className='flex items-center'>
                                    <div ref={elementCurrentJobHeaderRef} className='shadow-md w-full rounded-sm'>
                                        <div className='p-5'>
                                            <Button onClick={(e) => {handleCloseCurrentJobId(e, currentJobIdFromSearch)}} className='bg-white hover:bg-[#a0a0a06e] absolute top-2 right-2'>
                                                <span className='text-black'>X</span>
                                            </Button>

                                            <h1 className='text-2xl font-bold text-slate-900'>{jobListings[currentJobIdFromSearch-1]?.title}</h1>
                                            <h1 className='text-md text-slate-900 underline hover:cursor-pointer'>by {jobListings[currentJobIdFromSearch-1]?.person}</h1>
                                            <p className='text-slate-600 text-opacity-75'>{jobListings[currentJobIdFromSearch-1]?.location}</p>

                                            <div role='tags' className='grid grid-flow-row-dense grid-cols-4 items-center mt-2 gap-1 text-center text-black text-opacity-70 group-hover:text-opacity-90'>
                                                {jobListings[currentJobIdFromSearch-1]?.tags.map((tag, indexTag) => {
                                                    return (
                                                        <div key={indexTag} className='bg-slate-100 px-2 py-1 rounded-md text-ellipsis overflow-hidden'>
                                                            <p className='text-xs'>{tag.name}</p>
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
                            </div>
                        </div>
                    )}
                </div>

            </section>
        </Suspense>
    )
}

export default JobListing;