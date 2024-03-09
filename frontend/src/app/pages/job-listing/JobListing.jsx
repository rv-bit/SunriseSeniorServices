import React, { useState, useEffect } from 'react';
 
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

const jobListings = [
    {
        title: 'Help with childcare',
        location: 'London, UK, WV10 9QL',
        description: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Aliquam, dignissimos. Rem vitae quos nulla aliquam molestiae ipsam, doloribus repellendus omnis quas officiis provident possimus eligendi culpa veritatis voluptas unde fugiat.',
        tags: [
            { name: '£30hr, 7hr / week' },
            { name: 'Starts: 12/05/2024' },
            { name: 'Starts: 12/05/2024' },
            { name: 'Starts: 12/05/2024' },
            { name: 'Starts: 12/05/2024' },
        ],
        person: 'John Doe',
        postedOn: '21st August 2021'
    },
    {
        title: 'Help with childcare',
        location: 'London, UK, WV10 9QL',
        description: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Aliquam, dignissimos. Rem vitae quos nulla aliquam molestiae ipsam, doloribus repellendus omnis quas officiis provident possimus eligendi culpa veritatis voluptas unde fugiat.',
        tags: [
            { name: '£30hr, 7hr / week' }
        ],
        person: 'John Doe',
        postedOn: '21st August 2021'
    },
    {
        title: 'Help with childcare',
        location: 'London, UK, WV10 9QL',
        description: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Aliquam, dignissimos. Rem vitae quos nulla aliquam molestiae ipsam, doloribus repellendus omnis quas officiis provident possimus eligendi culpa veritatis voluptas unde fugiat.',
        tags: [
            { name: '£30hr, 7hr / week' }
        ],
        person: 'John Doe',
        postedOn: '21st August 2021'
    },
    {
        title: 'Help with childcare',
        location: 'London, UK, WV10 9QL',
        description: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Aliquam, dignissimos. Rem vitae quos nulla aliquam molestiae ipsam, doloribus repellendus omnis quas officiis provident possimus eligendi culpa veritatis voluptas unde fugiat.',
        tags: [
            { name: '£30hr, 7hr / week' }
        ],
        person: 'John Doe',
        postedOn: '21st August 2021'
    },
    {
        title: 'Help with childcare',
        location: 'London, UK, WV10 9QL',
        description: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Aliquam, dignissimos. Rem vitae quos nulla aliquam molestiae ipsam, doloribus repellendus omnis quas officiis provident possimus eligendi culpa veritatis voluptas unde fugiat.',
        tags: [
            { name: '£30hr, 7hr / week' }
        ],
        person: 'John Doe',
        postedOn: '21st August 2021'
    },
        {
        title: 'Help with childcare',
        location: 'London, UK, WV10 9QL',
        description: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Aliquam, dignissimos. Rem vitae quos nulla aliquam molestiae ipsam, doloribus repellendus omnis quas officiis provident possimus eligendi culpa veritatis voluptas unde fugiat.',
        tags: [
            { name: '£30hr, 7hr / week' }
        ],
        person: 'John Doe',
        postedOn: '21st August 2021'
    },
        {
        title: 'Help with childcare',
        location: 'London, UK, WV10 9QL',
        description: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Aliquam, dignissimos. Rem vitae quos nulla aliquam molestiae ipsam, doloribus repellendus omnis quas officiis provident possimus eligendi culpa veritatis voluptas unde fugiat.',
        tags: [
            { name: '£30hr, 7hr / week' }
        ],
        person: 'John Doe',
        postedOn: '21st August 2021'
    },
        {
        title: 'Help with childcare',
        location: 'London, UK, WV10 9QL',
        description: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Aliquam, dignissimos. Rem vitae quos nulla aliquam molestiae ipsam, doloribus repellendus omnis quas officiis provident possimus eligendi culpa veritatis voluptas unde fugiat.',
        tags: [
            { name: '£30hr, 7hr / week' }
        ],
        person: 'John Doe',
        postedOn: '21st August 2021'
    },
        {
        title: 'Help with childcare',
        location: 'London, UK, WV10 9QL',
        description: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Aliquam, dignissimos. Rem vitae quos nulla aliquam molestiae ipsam, doloribus repellendus omnis quas officiis provident possimus eligendi culpa veritatis voluptas unde fugiat.',
        tags: [
            { name: '£30hr, 7hr / week' }
        ],
        person: 'John Doe',
        postedOn: '21st August 2021'
    },
        {
        title: 'Help with childcare',
        location: 'London, UK, WV10 9QL',
        description: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Aliquam, dignissimos. Rem vitae quos nulla aliquam molestiae ipsam, doloribus repellendus omnis quas officiis provident possimus eligendi culpa veritatis voluptas unde fugiat.',
        tags: [
            { name: '£30hr, 7hr / week' }
        ],
        person: 'John Doe',
        postedOn: '21st August 2021'
    },

]


const JobListing = () => {
    const [searchInput, setSearchInput] = useState({ jobTitle: '', location: '' });
    const [searchResults, setSearchResults] = useState([]);

    const [currentJobId, setCurrentJobId] = useState(null);

    const handleCurrentJobId = (e, index) => {
        e.preventDefault();

        setCurrentJobId(index);
    }

    useEffect(() => {
        console.log('currentJobId', currentJobId);
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

    return (
        <section>
            <div className='flex items-center justify-center'>
                <div className='mx-auto'>
                    <h1 className='mb-10 text-3xl text-center font-bold text-slate-900'>Find your next job</h1>

                    <div className='flex items-center max-md:hidden'>
                        <div className='flex items-center border border-slate-600 rounded-lg h-[60px] shadow-2xl'>
                            {inputFields.map((input, index) => {
                                return (
                                    <React.Fragment key={index}>
                                        <div className='lg:w-[280px] h-full mr-1'>
                                            <label className={input.styleProps}>
                                                {input.icon && (
                                                    input.icon
                                                )}

                                                <input name={input.name} onChange={(e) => handleInputChange(e, input.name)} className='outline-none' type='text' placeholder={input.placeholder} value={searchInput[input.name]}/>
                                            
                                                {searchInput[input.name] && (
                                                    <Button onClick={() => {handleDeleteInput(input.name)}} className='ml-3 bg-white hover:bg-[#a0a0a06e]'>
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
                        <div className='flex flex-col items-center gap-2'>
                            {inputFields.map((input, index) => {
                                return (
                                    <React.Fragment key={index}>
                                        <div className='w-[390px] max-extraSm:w-[320px] h-full mr-1'>
                                            <label className='flex items-center border border-slate-600 text-slate-600 w-full h-[60px] px-2 rounded-lg focus-within:outline-none focus-within:border focus-within:border-violet-700 focus-within:rounded-br-sm focus-within:rounded-tr-sm focus-within:rounded-bl-lg focus-within:rounded-tl-lg focus-within:border-b-4 hover:cursor-text'>
                                                <div className='flex items-center text-slate-600'>
                                                    {input.icon && (
                                                        input.icon
                                                    )}

                                                    <input name={input.name} onChange={(e) => handleInputChange(e, input.name)} className='outline-none w-[280px] max-extraSm:w-[210px] h-full' type='text' placeholder={input.placeholder} value={searchInput[input.name]} />
                                                
                                                    {searchInput[input.name] && (
                                                        <Button onClick={() => {handleDeleteInput(input.name)}} className='bg-white hover:bg-[#a0a0a06e] ml-2'>
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

                        <div className='flex items-center justify-center mt-5 mr-2'>
                            <Button className='w-full'>Search</Button>
                        </div>
                    </div>

                    <div className='my-5 text-center hover:underline hover:cursor-pointer text-violet-700 font-bold'>Post a help enquiry</div>
                </div>
            </div>

            <hr className='w-full opacity-30 border-t border-slate-400' />

            <div className='flex items-center justify-center'>
                <div className='mx-auto'>
                    <div className='flex gap-2 my-10'>
                        
                        <div className='flex flex-col gap-2 mt-5'>
                            {jobListings.map((job, index) => {
                                const newIndex = index + 1;
                                return (
                                    <div 
                                        key={newIndex} 
                                        onClick={(e) => handleCurrentJobId(e, newIndex)} 
                                        className={`
                                            group w-[500px] max-md:w-[500px] max-sm:w-[400px] max-extraSm:w-[300px] h-auto bg-white border-2 border-black rounded-lg hover:cursor-pointer 
                                            ${currentJobId && currentJobId >= 0 ? 'mr-[50px]' : '' }
                                            ${currentJobId && currentJobId === newIndex ? 'border-violet-700' : 'border-black' }
                                        `}>

                                        <div className='flex items-center justify-between p-5'>
                                            <div>
                                                <h1 className='text-xl font-bold text-slate-900 group-hover:underline'>{job.title}</h1>
                                                <p className='text-slate-600'>{job.location}</p>

                                                <div className='flex items-center my-4'>
                                                    <p className='text-slate-600 text-sm line-clamp-2'>{job.description}</p>
                                                </div>

                                                <div role='tags' className='grid grid-flow-row-dense grid-cols-4 items-center mt-2 gap-1 text-center text-black text-opacity-70 group-hover:text-opacity-90'>
                                                    {job.tags.map((tag, indexTag) => {
                                                        return (
                                                            <div key={indexTag} className='bg-slate-100 px-2 py-1 rounded-md text-ellipsis'>
                                                                <p className='text-xs'>{tag.name}</p>
                                                            </div>
                                                        )
                                                    })}
                                                </div>

                                                <div className='flex items-center mt-3'>
                                                    <p className='text-slate-600 text-sm'>Posted on {job.postedOn}</p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                )
                            })}

                            <div className='flex items-center justify-center'>
                                <Button className='mx-auto w-4/5 ml-6'>Load more</Button>
                            </div>
                        </div>

                        {currentJobId && currentJobId >= 0 && (
                            <div className='h-screen sticky top-2 bottom-2 z-50'>
                                <div className='bg-white border border-black rounded-lg box-border h-[calc(100dvh-15px)]'>
                                    <div className='flex items-center'>
                                        <div className='shadow-md w-full rounded-sm'>
                                            <div className='p-5'>
                                                <h1 className='text-2xl font-bold text-slate-900'>{jobListings[currentJobId-1]?.title}</h1>
                                                <h1 className='text-md text-slate-900 underline hover:cursor-pointer'>by {jobListings[currentJobId-1]?.person}</h1>
                                                <p className='text-slate-600 text-opacity-75'>{jobListings[currentJobId-1]?.location}</p>

                                                <div role='tags' className='grid grid-flow-row-dense grid-cols-4 items-center mt-2 gap-1 text-center text-black text-opacity-70 group-hover:text-opacity-90'>
                                                    {jobListings[currentJobId-1]?.tags.map((tag, indexTag) => {
                                                        return (
                                                            <div key={indexTag} className='bg-slate-100 px-2 py-1 rounded-md text-ellipsis'>
                                                                <p className='text-xs'>{tag.name}</p>
                                                            </div>
                                                        )
                                                    })}
                                                </div>

                                                <Button className='mt-5 bg-violet-700 bg-opacity-80 hover:bg-violet-700 hover:bg-opacity-100'>Message</Button>
                                            </div>
                                        </div>
                                    </div>

                                    <ScrollArea className='w-full h-[calc(100%-240px)]'>
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
                </div>
            </div>
        </section>
    )
}

export default JobListing;