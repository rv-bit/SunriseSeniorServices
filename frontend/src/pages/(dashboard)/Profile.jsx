import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from 'react-query';

import { formatTags, Get } from '@/lib/utils';

import useUserAuth from '@/hooks/useUserAuth'
import useDocumentTitle from '@/hooks/useDocumentTitle';

import { JobPostsComponent } from '@/pages/(job-listing)/JobListing';

import { Button } from '@/components/ui/button';

const fetchProfile = async (profileId) => {
    const response = await Get(`${import.meta.env.VITE_API_PREFIX}/profile/${profileId}`);

    if (!response.ok) {
        return null;
    }

    const data = await response.json();
    return data;
}

const fetchJobListings = async (profileId) => {
    console.log(profileId, 'profileId')

    const response = await Get(`${import.meta.env.VITE_API_PREFIX}/joblisting/listings/${profileId}`);

    if (!response.ok) {
        return null;
    }

    const data = await response.json();
    const newData = data.data.map((job, index) => {
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


    return newData;
}

const tabs = [
    {
        name: 'posts',
        title: 'Posts'
    },
    {
        name: 'about',
        title: 'About'
    }
]

const Profile = () => {
    useDocumentTitle('Login')

    const navigate = useNavigate();
    const { profileId } = useParams();

    const { isLoaded, isSignedIn, user } = useUserAuth();

    const { data: profileData, isLoading: profileDataIsLoading, isError: profileDataIsError, error: profileDataError, status: profileDataStatus } = useQuery(['profile', profileId], () => fetchProfile(profileId), {
        enabled: !!profileId && !!user && isLoaded && isSignedIn
    });

    const [profile, setProfile] = useState(null);
    const [userTab, setUserTab] = useState('posts');

    useEffect(() => {
        if (profileDataStatus !== 'success') return;

        if (profileData) {
            setProfile(profileData);
        }

        return () => { };
    }, [isSignedIn, isLoaded, profileDataStatus]);

    return (
        <div className='flex flex-col items-center justify-center w-full h-screen'>

            <div className='w-full max-w-[65rem] flex flex-col relative'>
                <div className='flex w-full max-w-[65rem] pt-[37%] flex-shrink-0 bg-[#f0f2f5] rounded-2xl z-10'>
                    <div className='w-full flex items-end pt-[10%] bg-gradient-to-t from-[#00000085] from-20% via-[#e5e5e5] via-80% to-[#f0f2f5] to-100% rounded-2xl'></div>
                </div>

                <div className='w-full flex justify-center items-center px-5'>
                    <div className='w-full flex justify-between max-md:items-center max-md:justify-center max-md:flex-col max-md:gap-5 z-20 relative -mt-12 max-md:-mt-20'>
                        <div className='flex justify-start items-center max-md:flex-col max-md:justify-center max-md:gap-2'>
                            <div className='size-[155px] rounded-full bg-muted flex-shrink-0'></div>

                            <div className='flex max-md:justify-center max-md:items-center flex-col gap-2 ml-5 mt-5 max-md:m-0'>
                                <h1 className='text-2xl font-bold'>Name</h1>
                                <p>@username</p>
                            </div>
                        </div>

                        <div className='w-full flex justify-end items-end max-md:items-center max-md:justify-center gap-2'>
                            <Button onClick={() => navigate('/dashboard/profile/edit')} className='max-md:w-full bg-primary text-white'>Message</Button>

                            {user && user.id.replace('user_', '') === profileId && (
                                <Button onClick={() => navigate('/dashboard/profile/edit')} className='max-md:w-full bg-primary text-white'>Edit Profile</Button>
                            )}
                        </div>
                    </div>
                </div>

                <div className='w-full flex justify-center items-center px-5 mt-5'>
                    <div className='w-full flex justify-between max-md:items-center max-md:justify-center max-md:flex-col max-md:gap-5 z-20 relative'>
                        <div className='w-full flex justify-start items-center gap-2'>
                            {tabs.map(tab => (
                                <Button key={tab.name} onClick={(e) => {
                                    e.preventDefault()
                                    setUserTab(tab.name)
                                }} className={`bg-inherit hover:bg-inherit text-xl font-bold h-12 rounded-none ${userTab === tab.name ? 'text-blue-800 border-b-4 border-blue-800' : 'text-black'}`}>{tab.title}</Button>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            <hr className='w-full border-t border-gray-300' />

            <div className='w-full h-full flex flex-col relative bg-[#e4e6eb] shadow-inner'>
                {/* <div className='w-full flex justify-center items-center'>
                    <div className='w-full flex justify-between max-md:items-center max-md:justify-center max-md:flex-col max-md:gap-5 z-20 relative'>
                        <div className='w-full flex justify-start items-start gap-2'>
                            <h1 className='text-2xl font-bold'>Posts</h1>
                        </div>
                    </div>
                </div> */}

                {userTab === 'posts' &&
                    <ProfilePosts
                        isLoaded={isLoaded}
                        isSignedIn={isSignedIn}
                        user={user}

                        profileId={profileId}
                    />}
                {userTab === 'about' && <ProfileAbout />}
            </div>
        </div>
    )
}

const ProfilePosts = (props) => {
    var {
        isLoaded,
        isSignedIn,
        user,

        profileId
    } = props;

    profileId = 'user_' + profileId
    const { data: postsData, isLoading: postsDataIsLoading, isError: postsDataIsError, error: postsDataError, status: postsDataStatus } = useQuery(['profileUserPosts'], () => fetchJobListings(profileId), {
        enabled: !!user && isLoaded && isSignedIn
    });

    return (
        <div className='w-full flex justify-center items-center px-5 mt-5'>
            <div className='w-full flex justify-between max-md:items-center max-md:justify-center max-md:flex-col max-md:gap-5 z-20 relative'>
                <div className='w-full flex justify-start items-start gap-2'>
                    {postsData && postsData.length > 0 ? (
                        <JobPostsComponent
                            user={user}
                            isLoaded={isLoaded}
                            isSignedIn={isSignedIn}

                            jobListings={postsData}
                            jobListingsIsLoading={postsDataIsLoading}
                            jobListingsIsError={postsDataIsError}
                            jobListingsError={postsDataError}
                            jobListingStatus={postsDataStatus}
                        />
                    ) : (
                        <div className='w-full flex justify-center items-center'>
                            <p>No posts found</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}

const ProfileAbout = (props) => {
    return (
        <div className='w-full flex flex-col relative bg-[#e4e6eb] shadow-inner'>
            <div className='w-full flex justify-center items-center'>
                <div className='w-full flex justify-between max-md:items-center max-md:justify-center max-md:flex-col max-md:gap-5 z-20 relative'>
                    <div className='w-full flex justify-start items-start gap-2'>
                        <h1 className='text-2xl font-bold'>About</h1>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Profile
