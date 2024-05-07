import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer, toast } from 'react-toastify';

import React, { useCallback, useRef, useContext, useEffect, useState, useLayoutEffect, lazy, Suspense } from 'react'
import { useNavigate, useParams, Link } from 'react-router-dom'
import { useQuery, useQueryClient } from 'react-query'

import SocketioProvider from '@/providers/SocketioProvider'

import useUserAuth from '@/hooks/useUserAuth'
import useDocumentTitle from '@/hooks/useDocumentTitle'

import { Get, Post, Delete, formatDate } from '@/lib/utils' // Common functions 

import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';
import { Button } from '@/components/ui/button'
import { set } from 'react-hook-form';

const Alertbox = lazy(() => import('@/components/custom/Alertbox'));

const fetchChats = async (user) => {
    if (!user) {
        throw new Error('User is not authenticated');
    }

    const response = await Get(`${import.meta.env.VITE_API_PREFIX}/chats/${user.id}`,);

    if (!response.ok) {
        throw new Error('Failed to fetch chats');
    }

    const data = await response.json();
    return data.data;
};

const fetchPossibleMembers = async (user) => {
    if (!user) {
        throw new Error('User is not authenticated');
    }

    const response = await Get(`${import.meta.env.VITE_API_PREFIX}/users/possibleMembers/${user.id}`);

    if (!response.ok) {
        throw new Error('Failed to fetch possible members');
    }

    const data = await response.json();
    return data.data;
};

const EditChat = (props) => {
    const { chatInfo, onClose, onDelete, userInfo, currentChatIdFromSearch } = props;

    const navigate = useNavigate();
    const queryClient = useQueryClient();

    const [showAlert, setShowAlert] = useState({
        show: false,
        title: '',
        message: '',
        action: '',
        func: () => { },
    });
    const [userOptions, setUserOptions] = useState(false);

    const [possibleMembers, setPossibleMembers] = useState([]);
    const [searchPossibleMembers, setSearchPossibleMembers] = useState('');
    const [isSearching, setIsSearching] = useState({
        searchingUsers: false,
        addingUsers: false,
    });

    const userOptionsRef = useRef(null);

    const handleCloseEditing = (e) => {
        e.preventDefault();

        const body = document.querySelector('body');
        body.style.overflow = 'auto';

        onClose();
    }

    const handleDelete = (e) => {
        e.preventDefault();

        setShowAlert({
            show: true,
            action: 'delete',
            title: 'Delete Chat',
            message: 'Are you sure you want to delete this chat?',
            func(e) {
                onDelete(e, chatInfo._id);
            }
        });
    }

    const onSubmit = (e) => {
        e.preventDefault();

        if (showAlert.func) {
            showAlert.func(e);
        }

        setShowAlert({
            show: false,
            action: '',
            title: '',
            message: ''
        });
    }

    const onCancel = (e) => {
        e.preventDefault();

        setShowAlert({
            show: false,
            action: '',
            title: '',
            message: ''
        });
    }

    const handleSearchPossibleMembers = async (e) => {
        if (isSearching.searchingUsers) return;

        setIsSearching(previousData => ({
            ...previousData,
            searchingUsers: true,
        }));

        const response = await Get(`${import.meta.env.VITE_API_PREFIX}/chats/possibleMembers/${userInfo.id}/${chatInfo._id}?search=${searchPossibleMembers}`);

        setIsSearching(previousData => ({
            ...previousData,
            searchingUsers: false,
        }));

        if (!response.ok) {
            const data = await response.json();
            toast.error(data.message);
            return;
        }

        const data = await response.json();
        setPossibleMembers(data.data);
    }

    const handleAddMember = async (e, user) => {
        e.preventDefault();

        setIsSearching({
            searchingUsers: false,
            addingUsers: false,
        });
        setSearchPossibleMembers('');

        if (!user) {
            toast.error('No user selected');
            return;
        }

        const response = await Post(`${import.meta.env.VITE_API_PREFIX}/chats/addMember/${chatInfo._id}`, {
            user_id: user._id,
        });

        if (!response.ok) {
            const data = await response.json();
            toast.error(data.message);
            return;
        }

        const data = await response.json();
        toast.success(data.message);
        chatInfo.members.push(user);

        queryClient.refetchQueries('gatherChats');
    }

    const handleRemoveMembers = async (e, userId) => {
        e.preventDefault();

        const response = await Delete(`${import.meta.env.VITE_API_PREFIX}/chats/removeMember/${chatInfo._id}`, {
            user_id: userId,
        });

        if (!response.ok) {
            const data = await response.json();
            toast.error(data.message);
            return;
        }

        const data = await response.json();
        toast.success(data.message);
        chatInfo.members = chatInfo.members.filter((member) => member.id !== userId);

        queryClient.refetchQueries('gatherChats');
    }

    const handleRemoveSelf = async (e) => {
        e.preventDefault();

        const response = await Delete(`${import.meta.env.VITE_API_PREFIX}/chats/removeMember/${chatInfo._id}`, {
            user_id: userInfo.id,
        });

        if (!response.ok) {
            const data = await response.json();
            toast.error(data.message);
            return;
        }

        const data = await response.json();
        toast.success(data.message);
        queryClient.refetchQueries('gatherChats');

        navigate('/chat');
        handleCloseEditing(e);
    }

    useEffect(() => {
        const body = document.querySelector('body');
        body.style.overflow = 'hidden';

        return () => { };
    }, []);

    useEffect(() => {
        if (showAlert.show) return;

        if (userOptions) {
            const handleClickOutside = (e) => {
                if (userOptionsRef.current && !userOptionsRef.current.contains(e.target)) {
                    setUserOptions(false);
                }
            }

            document.addEventListener('mousedown', handleClickOutside);
            return () => {
                document.removeEventListener('mousedown', handleClickOutside);
            }
        }
    }, [userOptions, userOptionsRef]);

    useEffect(() => {
        if (isSearching.searchingUsers) return;
        if (searchPossibleMembers.length === 0) {
            setPossibleMembers([]);
            setSearchPossibleMembers('');
            return;
        }

        const timer = setTimeout(() => {
            handleSearchPossibleMembers();
        }, 300);

        return () => clearTimeout(timer);
    }, [searchPossibleMembers]);

    useEffect(() => {
        if (currentChatIdFromSearch && !chatInfo) {
            onClose();
        }

        return () => { };
    }, [chatInfo]);

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
            {
                showAlert.show && (
                    <Alertbox
                        Title={showAlert.title}
                        Description={showAlert.message}
                        onSubmit={onSubmit}
                        onCancel={onCancel}
                        button={{ second: "Cancel", main: "Submit" }}
                    />
                )
            }

            <div className='flex justify-center items-center fixed top-0 left-0 w-screen h-screen bg-black bg-opacity-70 z-50 backdrop-blur-md'>
                <div
                    className='max-sm:w-full w-[550px] h-[50%] max-sm:h-[90%] bg-white rounded-2xl p-5'>

                    <div className='flex items-end justify-end mb-5'>
                        <Button
                            className='bg-inherit text-black hover:bg-slate-200 hover:text-black'
                            onClick={(e) => handleCloseEditing(e)}>
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-x"><path d="M18 6 6 18" /><path d="m6 6 12 12" /></svg>
                        </Button>
                    </div>

                    <div className='flex flex-col justify-between mb-5 w-full h-full gap-5'>
                        <ScrollArea className='flex flex-col items-start justify-start gap-2 h-[80%]'>
                            <ul className='flex flex-col items-start justify-start gap-2'>
                                {
                                    chatInfo && Object.entries(chatInfo.members)
                                        .sort(([keyA, valueA], [keyB, valueB]) => {
                                            if ('created_by' in valueA && 'created_by' in valueB) {
                                                return valueA.created_by.localeCompare(valueB.created_by);
                                            }
                                            return 0;
                                        }).map(([key, value]) => {
                                            return (
                                                <li
                                                    className='flex items-center justify-between gap-2 p-5 bg-slate-200 rounded-2xl w-full'
                                                    key={key}
                                                >
                                                    <h1>
                                                        <div className='flex items-center gap-2'>
                                                            <>
                                                                {chatInfo.created_by && (chatInfo.created_by === value.id) ?
                                                                    <>
                                                                        {value.fullName} <span className='text-sm text-gray-500'>{value.id === userInfo.id ? 'You' : ''}</span>
                                                                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-orange-500 lucide lucide-crown"><path d="M11.562 3.266a.5.5 0 0 1 .876 0L15.39 8.87a1 1 0 0 0 1.516.294L21.183 5.5a.5.5 0 0 1 .798.519l-2.834 10.246a1 1 0 0 1-.956.734H5.81a1 1 0 0 1-.957-.734L2.02 6.02a.5.5 0 0 1 .798-.519l4.276 3.664a1 1 0 0 0 1.516-.294z" /><path d="M5 21h14" /></svg>
                                                                    </>
                                                                    :
                                                                    <>
                                                                        {value.fullName} <span className='text-sm text-gray-500'>{value.id === userInfo.id ? 'You' : ''}</span>
                                                                    </>
                                                                }
                                                            </>
                                                        </div>
                                                    </h1>

                                                    <div className='flex items-center justify-end'>
                                                        {!userOptions || (userOptions !== value.id) ?
                                                            <Button className='bg-inherit hover:bg-gray-400 text-black px-2' onClick={(e) => setUserOptions(value.id)}>
                                                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-ellipsis-vertical"><circle cx="12" cy="12" r="1" /><circle cx="12" cy="5" r="1" /><circle cx="12" cy="19" r="1" /></svg>
                                                            </Button>
                                                            :
                                                            <div
                                                                ref={userOptionsRef}
                                                                className='flex items-center justify-end gap-2'>

                                                                <Button
                                                                    onClick={(e) => setUserOptions(false)}
                                                                    className='bg-inherit hover:bg-gray-200 p-0 text-black'
                                                                >
                                                                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-x"><path d="M18 6 6 18" /><path d="m6 6 12 12" /></svg>
                                                                </Button>

                                                                <Link to={`/profile/${value.id.replace('user_', '')}`} className='bg-inherit hover:bg-gray-200 text-black p-0'>Profile</Link>
                                                                {chatInfo.created_by && (chatInfo.created_by === userInfo.id && value.id !== userInfo.id) && chatInfo.fromJobListing && chatInfo.fromJobListing !== false && (
                                                                    <Button className='bg-inherit hover:bg-gray-200 text-black p-0' onClick={(e) => handleRemoveMembers(e, value.id)}>Remove</Button>
                                                                )}
                                                            </div>
                                                        }
                                                    </div>
                                                </li>
                                            )
                                        })
                                }

                            </ul>

                            <ScrollBar orientation="vertical" className='' />
                        </ScrollArea>

                        <div className='flex justify-center gap-2 max-sm:flex-col mb-16'>
                            {
                                chatInfo && chatInfo.created_by && (
                                    chatInfo.created_by === userInfo.id ?
                                        <React.Fragment>
                                            <div className="flex flex-col items-center w-full">

                                                {isSearching.addingUsers && (
                                                    <div className="w-[285px] max-extraSm:w-full h-auto max-h-[300px] relative gap-5 mb-2 bg-slate-100 rounded-lg max-extraSm:mx-5 overflow-y-auto">
                                                        {(possibleMembers && possibleMembers.length > 0) && possibleMembers.map((member, index) => {
                                                            const { fullName } = member;

                                                            if (isSearching.searchingUsers) {
                                                                return (
                                                                    <div key={index} className='flex items-center justify-center w-full h-12'>
                                                                        <h1 className='text-lg'>Searching...</h1>
                                                                    </div>
                                                                )
                                                            }

                                                            return (
                                                                <Button key={index} className="w-full h-12 flex items-center justify-center hover:bg-slate-200 rounded-lg mb-2 px-2 last:mb-0 group hover:text-orange-500 text-center text-white" onClick={(e) => handleAddMember(e, member)}>{fullName}
                                                                </Button>
                                                            )
                                                        })}

                                                        {possibleMembers.length === 0 && (
                                                            <div className='flex items-center justify-center w-full h-12'>
                                                                <h1 className='text-lg'>No possible members found</h1>
                                                            </div>
                                                        )}
                                                    </div>
                                                )}

                                                <div className='flex items-center justify-center gap-2 w-full'>

                                                    {isSearching.addingUsers ?
                                                        <div className='flex items-center justify-center w-full border border-slate-600 rounded-lg h-[60px] shadow-2xl bg-slate-200'>
                                                            <label
                                                                className='flex items-center text-slate-600 w-full h-full focus-within:outline-none focus-within:border focus-within:border-[#ed6c39de] focus-within:rounded-br-sm focus-within:rounded-tr-sm focus-within:rounded-bl-lg focus-within:rounded-tl-lg focus-within:border-b-4 hover:cursor-text'>
                                                                <input
                                                                    onKeyDown={(e) => {
                                                                        e.key === 'Enter' ? (setSearchPossibleMembers(e.target.value)) : null
                                                                    }}
                                                                    onChange={(e) => {
                                                                        setSearchPossibleMembers(e.target.value)
                                                                    }}
                                                                    type='text' className='w-[95%] outline-none bg-inherit mx-5' placeholder='Type a message...' />
                                                            </label>

                                                            <div className='flex items-center justify-center mx-2'>
                                                                <Button onClick={(e) => {
                                                                    setIsSearching({
                                                                        searchingUsers: false,
                                                                        addingUsers: false,
                                                                    })
                                                                    setSearchPossibleMembers('')
                                                                }}>Cancel</Button>
                                                            </div>
                                                        </div>
                                                        :
                                                        <>
                                                            {
                                                                chatInfo.fromJobListing && chatInfo.fromJobListing !== false ?
                                                                    <Button className='w-full' onClick={(e) => setIsSearching({
                                                                        searchingUsers: false,
                                                                        addingUsers: true,
                                                                    })}>Add Person</Button>
                                                                    :
                                                                    null
                                                            }
                                                            <Button className='w-full' onClick={(e) => handleDelete(e)}>Delete Chat</Button>
                                                        </>
                                                    }
                                                </div>
                                            </div>
                                        </React.Fragment>
                                        :
                                        <Button onClick={handleRemoveSelf}>Leave Chat</Button>
                                )
                            }
                        </div>
                    </div>

                </div>
            </div>
        </Suspense >
    )
}

const Chat = () => {
    useDocumentTitle('Chat')

    const navigate = useNavigate();

    const { chatId } = useParams();

    const queryClient = useQueryClient();

    const { socket } = useContext(SocketioProvider);
    const { isLoaded, isSignedIn, user } = useUserAuth();

    const { data: chatsData, isLoading: chatsDataIsLoading, isError: chatsDataIsError, error: chatsDataError, status: chatsDataStatus } = useQuery(['gatherChats'], () => fetchChats(user), {
        enabled: !!user && isLoaded && isSignedIn
    });

    const currentChatIdFromSearch = chatId;

    const [chats, setChats] = useState([]);
    const [chatMessages, setChatMessages] = useState([]);
    const [sentMessage, setSentMessage] = useState('');

    const [showEditChat, setShowEditChat] = useState(false);

    const [chatOpen, setChatOpen] = useState(true);
    const [selectedChatId, setSelectedChatId] = useState(null);

    const chatBoxRef = useRef(null);
    const scrollChatArea = useRef(null);

    const handleChatOpen = (e, chatId) => {
        if (selectedChatId !== chatId && selectedChatId !== null && socket) {
            socket.emit('disconnectChat', {
                chat_id: selectedChatId,
                memberDisconnect: user.id,
            }, (error) => {
                if (error) {
                    console.log('Error', error);
                }
            });
        }

        setSelectedChatId(chatId);
    }

    const handleChatClose = (e, chatId) => {
        e.preventDefault();

        if (chatId !== selectedChatId) return;

        if (currentChatIdFromSearch) {
            navigate('/chat');
        }

        setSelectedChatId(null);
    }

    const handleSendChatMessage = (e, chatId) => {
        e.preventDefault();

        const messageBoxValue = chatBoxRef.current;

        if (messageBoxValue.current === null || messageBoxValue.value.length === 0) {
            return;
        }

        socket.emit('sendMessage', {
            chat_id: chatId,
            message: messageBoxValue.value,
            sender_id: user.id,
        }, (error) => {
            if (error) {
                console.log('Error', error);
            }
        });

        setSentMessage(messageBoxValue.value);

        messageBoxValue.value = '';
        messageBoxValue.focus();
    }

    const handleEditChat = () => {
        setShowEditChat(!showEditChat);
    }

    const handleDelete = async (e, chatId) => {
        e.preventDefault();

        const response = await Delete(`${import.meta.env.VITE_API_PREFIX}/chats/delete/${chatId}`, {
            user_id: user.id,
        });

        if (!response.ok) {
            const data = await response.json();
            toast.error(data.message);
            return;
        }

        const data = await response.json();
        toast.success(data.message);

        await queryClient.refetchQueries('gatherChats');

        setSelectedChatId(null);
        setShowEditChat(false);

        navigate('/chat');
    }

    useEffect(() => {
        if (isLoaded && !isSignedIn) {
            navigate('/');
            return;
        }

        return () => { };
    }, [isSignedIn, isLoaded]);

    useEffect(() => {
        if (chatsDataStatus !== 'success') return;

        setChats(chatsData);

        return () => { };
    }, [chatsDataStatus, chatsData]);

    useEffect(() => {
        if (chatsDataStatus !== 'success') return;
        if (!chats || chats.length === 0) return;

        if (currentChatIdFromSearch && selectedChatId && currentChatIdFromSearch === selectedChatId) {
            const chatIdIndex = chats.find((chat) => chat._id === selectedChatId);

            if (!chatIdIndex) {
                navigate('/chat');
                setSelectedChatId(null);
                return;
            }
        }

        if (currentChatIdFromSearch && currentChatIdFromSearch !== selectedChatId) {
            const chatIdIndex = chats.findIndex((chat) => chat._id === currentChatIdFromSearch);

            if (chatIdIndex !== -1) {
                setSelectedChatId(chats[chatIdIndex]._id);
                return;
            }

            navigate('/chat');
            setSelectedChatId(null);
        } else if (selectedChatId && !currentChatIdFromSearch) {
            setSelectedChatId(null);
        }

        return () => { }
    }, [currentChatIdFromSearch, chats, chatsDataStatus]);

    useEffect(() => {
        if (!socket) return;
        if (!isLoaded) return;

        if (!selectedChatId) {
            socket.emit('disconnectChat', {
                chat_id: selectedChatId,
                memberDisconnect: user.id,
            }, (error) => {
                if (error) {
                    console.log('Error', error);
                }
            });

            return;
        }

        const gatherChatMessagesByChatId = async () => {
            const response = await Get(`${import.meta.env.VITE_API_PREFIX}/chats/gatherMessages/${selectedChatId}/${user.id}`);

            if (!response.ok) {
                const data = await response.json();

                if (data.Error === 'Unauthorized') {
                    navigate('/');
                }

                return;
            }

            const data = await response.json();
            setChatMessages(data.data);

            if (scrollChatArea.current) {
                scrollChatArea.current.scrollTop = scrollChatArea.current.scrollHeight;
            }

            if (!currentChatIdFromSearch) {
                return;
            }

            socket.emit('connectChat', {
                chat_id: selectedChatId,
                members: chats[chats.findIndex((chat) => chat._id === currentChatIdFromSearch)].members,
            }, (error) => {
                if (error) {
                    console.log('Error', error);
                }
            });
        }

        if (selectedChatId && selectedChatId.length > 0) {
            gatherChatMessagesByChatId();
        }

        const messageBoxValue = chatBoxRef;
        if (messageBoxValue.current === null || messageBoxValue.current.value.length === 0) {
            return;
        }

        messageBoxValue.value = '';
        messageBoxValue.focus();

        return () => {
            socket.off('connectChat', () => { });
        };
    }, [selectedChatId, isLoaded])

    useEffect(() => {
        if (socket) {
            const receiveMessageHandler = (data) => {
                setChatMessages((chatMessages) => [...chatMessages, data]);

                setChats((chats) => {
                    const chatIndex = chats.findIndex((chat) => chat._id === data.chat_id);
                    const chat = chats[chatIndex];

                    chat.last_message = data.message;
                    chat.last_message_date = data.created_at;

                    chats.splice(chatIndex, 1);
                    chats.unshift(chat);

                    return chats;
                });
            };

            socket.on('receiveMessage', receiveMessageHandler);
            return () => {
                socket.off('receiveMessage', receiveMessageHandler);
            };
        }
    }, [sentMessage]); // Run the effect when `sentMessage` changes

    useLayoutEffect(() => {
        if (scrollChatArea.current) {
            scrollChatArea.current.scrollTop = scrollChatArea.current.scrollHeight;
        }
    }, [chatMessages])

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
            <React.Fragment>
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

                {showEditChat && <EditChat chatInfo={chats.find(chat => chat._id === selectedChatId)} onClose={handleEditChat} userInfo={user} onDelete={handleDelete} currentChatIdFromSearch={currentChatIdFromSearch} />}

                <div className='flex items-center justify-center w-full'>
                    <div className='mx-5 max-w-[1400px] w-full'>

                        <div className={`flex flex-row items-center justify-center w-full ${currentChatIdFromSearch ? 'max-sm:h-auto max-md:h-auto h-[1000px]' : 'h-[1000px]'} my-5`}>

                            <section role='all-chats' className={`items-center justify-between h-full ${currentChatIdFromSearch ? 'sm:hidden max-md:hidden lg:flex lg:w-[40%] md:w-[50%]' : 'extraSm:flex sm:flex md:flex lg:flex w-[90%] md:w-[100%] lg:w-[40%] max-extraSm:w-[95%]'}`}>
                                <div className='max-lg:border-0 border border-black rounded-l-md w-full h-full'>

                                    {chatsDataIsLoading ?
                                        <React.Fragment>
                                            <div className='flex items-center justify-center w-full h-full'>
                                                <h1 className='text-lg'>Chats are loading..</h1>
                                            </div>
                                        </React.Fragment>
                                        :
                                        <React.Fragment>
                                            <ScrollArea className='flex flex-col gap-2 items-center justify-between w-full h-full'>
                                                {
                                                    chats.sort((a, b) => {
                                                        const formattedDateA = a.last_message_date?.replace(/-/g, (match, index, original) => {
                                                            return (original.indexOf(match) === 4 || original.indexOf(match) === 7) ? '-' : ' ';
                                                        }).replace(':', ':');

                                                        const formattedDateB = b.last_message_date?.replace(/-/g, (match, index, original) => {
                                                            return (original.indexOf(match) === 4 || original.indexOf(match) === 7) ? '-' : ' ';
                                                        }).replace(':', ':');

                                                        const dateA = a.last_message_date ? new Date(formattedDateA) : 0;
                                                        const dateB = b.last_message_date ? new Date(formattedDateB) : 0;
                                                        return dateB - dateA;
                                                    }).map((chat, index) => {
                                                        const lastMessage = chat.last_message ? chat.last_message : undefined;

                                                        if (!lastMessage || lastMessage.length === 0) {
                                                            return (
                                                                <Link
                                                                    to={`/chat/${chat._id}`}
                                                                    key={index}
                                                                    onClick={(e) => {
                                                                        handleChatOpen(e, chat._id)
                                                                    }}
                                                                    onAuxClick={(e) => {
                                                                        if (e.button !== 1) {
                                                                            handleChatOpen(e, chat._id);
                                                                        }
                                                                    }}
                                                                    className='flex w-full h-[100px] hover:bg-[#dd673cfd] hover:opacity-70 hover:cursor-pointer'>

                                                                    <div className='flex align-middle items-center px-5 w-full'>
                                                                        <div className='flex'>

                                                                            {chat.avatar ?
                                                                                <div className='size-[55px] rounded-full bg-muted mr-3 flex-shrink-0'>
                                                                                    <img src={chat.avatar} alt={chat._id} className='rounded-full' />
                                                                                </div>
                                                                                :
                                                                                <div className='size-[55px] rounded-full bg-muted mr-3 flex-shrink-0'></div>
                                                                            }

                                                                            <div className='flex flex-col md:w-[200px] lg:w-[300px] max-extraSm:w-[80px] max-sm:w-[120px] max-md:w-[280px]'>
                                                                                <div className='align-top'>
                                                                                    <h1 className='line-clamp-2'>{
                                                                                        chat.fromJobListing ? chat.name : chat.members.find((member) => member.id !== user.id).fullName
                                                                                    }</h1>
                                                                                </div>

                                                                                <div className='align-bottom text-sm'>
                                                                                    <p className='line-clamp-1 overflow-hidden text-ellipsis whitespace-nowrap'>Start to chat!</p>
                                                                                </div>
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                </Link>
                                                            )
                                                        }

                                                        const dateFormatedLastMessage = formatDate(chat.last_message_date);
                                                        return (
                                                            <Link
                                                                to={`/chat/${chat._id}`}
                                                                key={index}
                                                                onClick={(e) => {
                                                                    handleChatOpen(e, chat._id)
                                                                }}
                                                                onAuxClick={(e) => {
                                                                    if (e.button !== 1) {
                                                                        handleChatOpen(e, chat._id);
                                                                    }
                                                                }}
                                                                className='flex w-full h-[100px] hover:bg-[#dd673cfd] hover:opacity-70 hover:cursor-pointer'>

                                                                <div className='flex align-middle items-center px-5 w-[80%]'>
                                                                    <div className='flex'>
                                                                        {chat.avatar ?
                                                                            <div className='size-[55px] rounded-full bg-muted mr-3 flex-shrink-0'>
                                                                                <img src={chat.avatar} alt={chat._id} className='rounded-full' />
                                                                            </div>
                                                                            :
                                                                            <div className='size-[55px] rounded-full bg-muted mr-3 flex-shrink-0'></div>
                                                                        }

                                                                        <div className='flex flex-col justify-center md:w-[200px] lg:w-[300px] max-extraSm:w-[80px] max-sm:w-[120px] max-md:w-[280px]'>
                                                                            <div className='align-top'>
                                                                                <h1 className='w-[80%] truncate'>{
                                                                                    chat.fromJobListing ? chat.name : chat.members.find((member) => member.id !== user.id).fullName
                                                                                }</h1>
                                                                            </div>

                                                                            <div className='align-bottom text-sm'>
                                                                                <p className='line-clamp-1 overflow-hidden text-ellipsis whitespace-nowrap'>{lastMessage}</p>
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                </div>

                                                                <div className='flex items-center justify-center mx-5 w-[40%] lg:w-[30%]'>
                                                                    <span className='text-xs'>{dateFormatedLastMessage}</span>
                                                                </div>
                                                            </Link>
                                                        )
                                                    })
                                                }

                                                <ScrollBar orientation="vertical" />
                                            </ScrollArea>
                                        </React.Fragment>
                                    }
                                </div>
                            </section>

                            <section role='opened-chats' className={`max-lg:border-0 border border-l-0 border-black rounded-r-md w-1/2 max-lg:w-full max-md:w-full max-sm:h-[80dvh] max-extraSm:h-[71dvh] max-md:h-[80dvh] h-full ${currentChatIdFromSearch ? 'block' : 'hidden lg:block'}`}>

                                {!selectedChatId && (
                                    <React.Fragment>
                                        {chats.length === 0 ? (
                                            <div className='flex items-center justify-center w-full h-full'>
                                                <h1 className='text-lg'>No chats available</h1>
                                            </div>
                                        ) : (
                                            <div className='flex items-center justify-center w-full h-full'>
                                                <h1 className='text-lg'>Select a chat to start</h1>
                                            </div>
                                        )}
                                    </React.Fragment>
                                )}

                                {selectedChatId && (chats && chats.length > 0) && (
                                    <div className='w-full h-full'>
                                        <div className='flex items-center justify-between max-extraSm:w-full w-full h-[10%] max-lg:h-[7%] px-5 rounded-b-md border-b-2 drop-shadow-lg'>
                                            <div
                                                onClick={(e) => handleChatClose(e, selectedChatId)}
                                                className='w-[70%] flex justify-center items-center hover:cursor-pointer'>

                                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-chevron-left"><path d="m15 18-6-6 6-6" /></svg>
                                                <h1 className='text-lg w-full truncate'>Chat - {
                                                    chats.find((chat) => chat._id === selectedChatId)?.fromJobListing ? chats.find((chat) => chat._id === selectedChatId)?.name : chats.find((chat) => chat._id === selectedChatId)?.members.find((member) => member.id !== user.id).fullName
                                                }</h1>
                                            </div>

                                            <div className='flex items-center justify-end'>
                                                <Button onClick={(e) => handleEditChat(e)}>Edit Chat</Button>
                                            </div>
                                        </div>

                                        <div className='w-full h-[90%]'>
                                            <ScrollArea ref={scrollChatArea} className='p-5 w-full h-[90%]'>
                                                {(chatMessages && chatMessages.length > 0) && chatMessages.map((chatMessage, index) => {
                                                    const isSentByCurrentUser = chatMessage.sender_id === user.id;
                                                    const dateFormated = formatDate(chatMessage.created_at);

                                                    if (isSentByCurrentUser) {
                                                        return (
                                                            <div key={index} className='flex w-full h-auto items-end justify-end my-5'>
                                                                <div className='flex w-auto h-auto'>

                                                                    <div className='flex flex-col items-end justify-end w-full gap-1'>
                                                                        <div className='align-top'>
                                                                            <h1>{user.fullName} <span className='text-xs'>{dateFormated}</span></h1>
                                                                        </div>

                                                                        <div className='align-bottom bg-[#dd673ca9] rounded-md p-5 overflow-hidden'>
                                                                            <p className='text-sm' style={{ overflowWrap: 'anywhere' }} >{chatMessage.message}</p>
                                                                        </div>
                                                                    </div>

                                                                </div>
                                                            </div>
                                                        )
                                                    }

                                                    return (
                                                        <div key={index} className='flex w-full h-auto'>
                                                            <div className='flex w-auto h-auto'>

                                                                <div className='flex flex-col w-full gap-1'>
                                                                    <div className='align-top'>
                                                                        <h1>{chatMessage.sender.fullName} <span className='text-xs'>{dateFormated}</span></h1>
                                                                    </div>

                                                                    <div className='align-bottom bg-slate-200 rounded-md p-5 overflow-hidden'>
                                                                        <p className='text-sm' style={{ overflowWrap: 'anywhere' }} >{chatMessage.message}</p>
                                                                    </div>
                                                                </div>

                                                            </div>
                                                        </div>
                                                    )
                                                })}

                                                <ScrollBar orientation="vertical" />
                                            </ScrollArea>

                                            <div className='px-5'>
                                                <div className='flex items-center justify-center w-full border border-slate-600 rounded-lg h-[60px] shadow-2xl bg-slate-200'>
                                                    <label
                                                        onKeyDown={(e) => e.key === 'Enter' && handleSendChatMessage(e, selectedChatId)}
                                                        className='flex items-center text-slate-600 w-full h-full focus-within:outline-none focus-within:border focus-within:border-[#ed6c39de] focus-within:rounded-br-sm focus-within:rounded-tr-sm focus-within:rounded-bl-lg focus-within:rounded-tl-lg focus-within:border-b-4 hover:cursor-text'>

                                                        <input type='text' ref={chatBoxRef} className='w-[95%] outline-none bg-inherit mx-5' placeholder='Type a message...' />
                                                    </label>
                                                    <hr className='border border-slate-300 h-[90%] mr-5' />
                                                    <Button
                                                        onClick={(e) => handleSendChatMessage(e, selectedChatId)}
                                                        className='mr-5'>Send
                                                    </Button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                )}

                            </section>
                        </div>
                    </div>
                </div>
            </React.Fragment>
        </Suspense>
    )
}

export default Chat;
