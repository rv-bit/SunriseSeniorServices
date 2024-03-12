import React, { useEffect, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom';

import { Button } from '@/app/components/ui/button';

import { BsChevronLeft } from "react-icons/bs";

import jobListings from '@/app/data/JobListinTemp';

const ViewJobListing = () => {
    const navigate = useNavigate();
    const [searchParams, setSearchParams] = useSearchParams();

    const currentJobIdFromSearch = searchParams && searchParams.get('currentJobId') ? parseInt(searchParams.get('currentJobId')) : null;
    
    useEffect(() => {        
        if (!currentJobIdFromSearch) {
            navigate('/job-listings');
        }

        return () => {}
    }, []);

    const handleCloseCurrentJobId = (e, currentJobId) => {
        e.preventDefault();

        navigate({
            pathname: '/job-listings',
            search: `?currentJobId=${currentJobId}`
        });
    }

    return (
        <React.Fragment>
            <hr className='w-full opacity-30 border-t border-slate-400' />

            <div className='flex items-center justify-center w-full h-full gap-2 my-10 px-10 max-extraSm:px-0'>                
                <div className='flex items-center justify-center'>
                    <div className='flex justify-center flex-row w-full h-full'>

                        <div className='flex flex-col gap-3 lg:w-3/12 max-md:w-3/4 sm:w-full extraSm:w-full'>

                            <span
                                onClick={(e) => handleCloseCurrentJobId(e, currentJobIdFromSearch)}
                                className='flex items-center gap-1 -mt-5 hover:underline hover:cursor-pointer'>
                                <BsChevronLeft size={15}/>
                                <h1>Go Back</h1>
                            </span>

                            <div className='inline-block whitespace-normal break-words'>
                                <h1 className='text-xl max-lg:text-2xl lg:text-3xl font-bold text-slate-900'>{jobListings[currentJobIdFromSearch-1]?.title}</h1>
                                <p className='text-slate-600 text-opacity-75 mt-3'>{jobListings[currentJobIdFromSearch-1]?.location}</p>
                            
                                <div className='lg:hidden md:block sm:block extraSm:block max-extraSm:block'>
                                    <div className='flex justify-start mt-5'>
                                        <Button className='w-[300px] bg-[#d06139c5] bg-opacity-80 hover:bg-[#e8432dea]' onClick={(e) => handleCloseCurrentJobId(e, currentJobIdFromSearch)}>Message</Button>
                                    </div>
                                </div>

                                <div className='mt-5'>   
                                    <p className='text-3xl font-bold text-slate-900'>Full Job Description <span className='my-5 float-end text-xl max-sm:text-base max-extraSm:text-base font-normal text-slate-600'>{jobListings[currentJobIdFromSearch-1]?.description}</span></p>
                                </div>

                                <div className='lg:hidden md:block sm:block extraSm:block max-extraSm:block'>
                                    <div className='flex my-5 w-full'>
                                        <div role='tags' className='grid grid-flow-row-dense extraSm:grid-cols-3 max-extraSm:grid-cols-3 sm:grid-cols-5 md:grid-cols-7 items-center mt-2 gap-1 text-center text-black text-opacity-70 group-hover:text-opacity-90'>
                                            {jobListings[currentJobIdFromSearch-1]?.tags.map((tag, indexTag) => {
                                                return (
                                                    <div key={indexTag} className='bg-slate-100 px-4 py-3 rounded-md text-ellipsis overflow-hidden'>
                                                        <p className='text-sm'>{tag.name}</p>
                                                    </div>
                                                )
                                            })}
                                        </div>
                                    </div>
                                </div>

                                <p className='text-slate-600 text-opacity-75'>Posted by <span className='text-slate-900 underline'>{jobListings[currentJobIdFromSearch-1]?.person}</span></p>

                                <div className='mt-5'>
                                    <p className='text-slate-600 text-opacity-75'>Posted on <span className='text-slate-900'>{jobListings[currentJobIdFromSearch-1]?.postedOn}</span></p>
                                </div>

                                <hr className='mt-10 w-full opacity-30 border-t border-slate-400' />
                            </div>
                        </div>

                        <div className='hidden lg:flex md:hidden sm:hidden extraSm:hidden max-extraSm:hidden'>
                            <div className='ml-32 w-[300px]'>
                                <Button className='w-full mt-5 bg-[#d06139c5] bg-opacity-80 hover:bg-[#e8432dea]' onClick={(e) => handleCloseCurrentJobId(e, currentJobIdFromSearch)}>Message</Button>

                                <div className='flex items-center justify-center mt-5'>
                                    <div role='tags' className='grid grid-flow-row-dense grid-cols-3 items-center mt-2 gap-1 text-center text-black text-opacity-70 group-hover:text-opacity-90'>
                                        {jobListings[currentJobIdFromSearch-1]?.tags.map((tag, indexTag) => {
                                            return (
                                                <div key={indexTag} className='bg-slate-100 px-3 py-2 rounded-md text-ellipsis overflow-hidden'>
                                                    <p className='text-sm'>{tag.name}</p>
                                                </div>
                                            )
                                        })}
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
