import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer, toast } from 'react-toastify';

import { useState, useEffect, useCallback } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useQuery, useQueryClient } from 'react-query';

import { Get, Post, formatTags } from '@/lib/utils';

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
    const queryClient = useQueryClient();

    const { profileId } = useParams();
    const { isLoaded, isSignedIn, user } = useUserAuth();

    const { data: profileData, isLoading: profileDataIsLoading, isError: profileDataIsError, error: profileDataError, status: profileDataStatus } = useQuery(['profile', profileId], () => fetchProfile(profileId), {
        enabled: !!profileId && !!user && isLoaded && isSignedIn
    });

    const [waitForChatToCreate, setWaitForChatToCreate] = useState(false);

    const [profile, setProfile] = useState(null);
    const [userTab, setUserTab] = useState('posts');

    const createChats = useCallback(async (props) => {
        console.log('Creating chat with', props.members);
        const response = await Post(`${import.meta.env.VITE_API_PREFIX}/chats/createChat`, { data: props });

        if (!response.ok) {
            toast.error('An error occurred while trying to create the chat');
            return false;
        }

        const data = await response.json();
        if (data.chatExists) {
            toast.error('Chat already exists, moving to the chat');
            return data.data;
        }

        return data.data;
    });

    const handleCreateChat = async (e) => {
        e.preventDefault();

        if (!user) {
            navigate('/login', { state: { info: 'You must be logged in to send a message!' } });
            return;
        }

        setWaitForChatToCreate(true);
        if (user.id === profileData.id) {
            toast.error('You cannot message yourself');
            setWaitForChatToCreate(false);
            return;
        }

        const chatCreated = await createChats(
            {
                members: [user.id, profileData.id],
                created_by: user.id,
                fromJobListing: false
            }
        );

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

    useEffect(() => {
        if (profileDataStatus !== 'success') return;

        if (profileData) {
            setProfile(profileData);
        }

        return () => { };
    }, [isSignedIn, isLoaded, profileDataStatus]);

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

            <div className='flex flex-col items-center justify-center w-full h-screen'>

                {profileDataIsLoading ?
                    <div className='w-full h-full flex justify-center items-center'>
                        <p>Loading...</p>
                    </div>
                    :

                    <>

                        <div className='w-full max-w-[65rem] flex flex-col relative'>
                            <div className='flex w-full max-w-[65rem] pt-[37%] flex-shrink-0 bg-[#f0f2f5] rounded-2xl z-10'>
                                <div className='w-full flex items-end pt-[10%] bg-gradient-to-t from-[#00000085] from-20% via-[#e5e5e5] via-80% to-[#f0f2f5] to-100% rounded-2xl'></div>
                            </div>

                            <div className='w-full flex justify-center items-center px-5'>
                                <div className='w-full flex justify-between max-md:items-center max-md:justify-center max-md:flex-col max-md:gap-5 z-20 relative -mt-12 max-md:-mt-20'>
                                    <div className='flex justify-start items-center max-md:flex-col max-md:justify-center max-md:gap-2'>
                                        <img src={profile?.imageUrl} alt='Profile Image' className='size-[155px] max-md:size-[80%] rounded-full bg-muted flex-shrink-0' />

                                        <div className='flex max-md:justify-center max-md:items-center flex-col gap-2 ml-5 mt-5 max-md:m-0'>
                                            <h1 className='text-2xl font-bold'>{profile?.firstName} {profile?.lastName}</h1>
                                        </div>
                                    </div>

                                    <div className='max-md:w-full flex justify-end items-end max-md:items-center max-md:justify-center gap-2'>
                                        <Button
                                            onAuxClick={(e) => handleCreateChat(e)}
                                            onClick={(e) => handleCreateChat(e)}
                                            className='max-md:w-full bg-primary text-white'>Message
                                        </Button>

                                        {user && user.id.replace('user_', '') === profileId && (
                                            <Link onClick={() => navigate('/account#/edit-profile')} className='max-md:w-full bg-primary text-white'>Edit Profile</Link>
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
                            {userTab === 'posts' &&
                                <ProfilePosts
                                    isLoaded={isLoaded}
                                    isSignedIn={isSignedIn}
                                    user={user}

                                    profileId={profileId}
                                />}
                            {userTab === 'about' &&
                                <ProfileAbout
                                    isLoaded={isLoaded}
                                    isSignedIn={isSignedIn}
                                    user={user}

                                    profileData={profileData}
                                />}
                        </div>
                    </>
                }
            </div>
        </>
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
    )
}

const ProfileAbout = (props) => {
    const {
        isLoaded,
        isSignedIn,
        user,

        profileData
    } = props;

    return (
        <div className='w-full flex flex-col justify-center items-center px-5 mt-5 gap-5 overflow-auto break-words'>
            <h1 className='text-2xl font-bold'>About</h1>
            {profileData?.additionalData.option_about === '' || profileData?.additionalData.option_about === undefined ?
                <p>No information provided</p>
                :
                <p>{profileData?.additionalData.option_about}</p>
            }
        </div>
    )
}

export default Profile
