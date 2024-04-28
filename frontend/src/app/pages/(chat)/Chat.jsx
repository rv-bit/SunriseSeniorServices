import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer, toast } from 'react-toastify';

import React, { useCallback, useRef, useContext, useEffect, useState, useLayoutEffect, lazy, Suspense } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { useQuery } from 'react-query'

import useUserAuth from '@/app/hooks/useUserAuth'
import useDocumentTitle from '@/app/hooks/useDocumentTitle'

import SocketioProvider from '@/app/providers/SocketioProvider'

import { formatDate, Get, Post } from '@/app/lib/utils' // Common functions 

import { ScrollArea, ScrollBar } from '@/app/components/ui/scroll-area';
import { Button } from '@/app/components/ui/button'
import { BsChevronLeft } from "react-icons/bs";

const fetchChats = async (user) => {
    if (!user) {
        throw new Error('User is not authenticated');
    }

    const response = await Get(`${import.meta.env.VITE_API_PREFIX}/chats/${user.id}`, );

    if (!response.ok) {
        throw new Error('Failed to fetch chats');
    }
    
    const data = await response.json();
    return data.data;
};

const Chat = () => {
    useDocumentTitle('Chat')

    const navigate = useNavigate();
    const location = useLocation();

    const { socket } = useContext(SocketioProvider);
    const { isLoaded, isSignedIn, user } = useUserAuth();

    const { data: chatsData, isLoading: chatsDataIsLoading, isError: chatsDataIsError, error: chatsDataError, status: chatsDataStatus } = useQuery(['gatherChats'], () => fetchChats(user), {
        enabled: !!user && isLoaded && isSignedIn
    });

    const queryParams = new URLSearchParams(location.search);
    const currentChatIdFromSearch = queryParams.get('currentChatId');

    const [chats, setChats] = useState([]);
    const [chatMessages, setChatMessages] = useState([]);
    const [sentMessage, setSentMessage] = useState('');
    
    const [chatOpen, setChatOpen] = useState(true);
    const [selectedChatId, setSelectedChatId] = useState({});

    const chatBoxRef = useRef(null);
    const scrollChatArea = useRef(null);
    
    const handleOpenInNewTab = useCallback((e, locationTab) => {
        e.preventDefault();
        
        const newWindow = window.open(`${window.location.origin}/#${locationTab}`, '_blank', 'noopener,noreferrer');
        
        if (newWindow) {
            newWindow.opener = null;
        }
    })
    
    const handleChatOpen = (e, chatId) => {
        e.preventDefault();

        if (selectedChatId !== chatId && selectedChatId !== null && selectedChatId.length > 0) {
            socket.emit('disconnectChat', { 
                chat_id: selectedChatId,
                memberDisconnect: user.id,
            }, (error) => {
                if (error) {
                    console.log('Error', error);
                }
            });
        }

        if (e.altKey === true && e.type === 'click' || e.type === 'auxclick') {
            handleOpenInNewTab(e, `/chat?currentChatId=${chatId}`);
        } else {
            setSelectedChatId(chatId);

            if (window.innerWidth < 1180) {
                navigate(`/chat?currentChatId=${chatId}`)
            } else {
                navigate(`/chat?currentChatId=${chatId}`)
            }
        }
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

    // Check if the user is authenticated using a useEffect because the user is loaded asynchronously
    useEffect(() => {        
        if (isLoaded && !isSignedIn) {
            navigate('/');
            return;
        }

        return () => {};
    }, [isSignedIn, isLoaded]);

    useEffect(() => {
        if (chatsDataStatus !== 'success') return;
        setChats(chatsData);

        return () => {};
    }, [chatsDataStatus]);

    useEffect(() => {
        if (currentChatIdFromSearch && currentChatIdFromSearch !== selectedChatId) {
            const chatIdIndex = chats.findIndex((chat) => chat._id === currentChatIdFromSearch);

            if (chatIdIndex !== -1) {
                setSelectedChatId(chats[chatIdIndex]._id);
                return;
            }
            
            setSelectedChatId(null);
        } else if (selectedChatId && !currentChatIdFromSearch) {
            setSelectedChatId(null);
        }

        return () => {}
    }, [currentChatIdFromSearch, chats]);

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
            const response = await Get(`${import.meta.env.VITE_API_PREFIX}/chats/gatherMessages/${selectedChatId}`);

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
            socket.off('connectChat', () => {});
        };
    }, [selectedChatId, isLoaded])

    useEffect(() => {
        if (socket) {
            const receiveMessageHandler = (data) => {
                console.log('Received message', data);

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
                    pauseOnFocusLoss
                    draggable
                    pauseOnHover
                    theme="light"
                    stacked={true}
                />
                
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
                                                                <div key={index} 
                                                                onClick={(e) => handleChatOpen(e, chat._id)}
                                                                onAuxClick={(e) => handleChatOpen(e, chat._id)}
                                                                className='flex w-full h-[100px] hover:bg-[#dd673cfd] hover:opacity-70 hover:cursor-pointer'>

                                                                    <div className='flex align-middle items-center px-5 w-full'>
                                                                        <div className='flex'>
                                                                            <div className='size-[55px] rounded-full bg-muted mr-3 flex-shrink-0'></div>
                                                                            
                                                                            <div className='flex flex-col md:w-[200px] lg:w-[300px] max-extraSm:w-[80px] max-sm:w-[120px] max-md:w-[280px]'>
                                                                                <div className='align-top'>
                                                                                    <h1 className='line-clamp-2'>{chat.name}</h1>
                                                                                </div>

                                                                                <div className='align-bottom text-sm'>
                                                                                    <p className='line-clamp-1 overflow-hidden text-ellipsis whitespace-nowrap'>Start to chat!</p>
                                                                                </div>
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            )
                                                        }
                                                        
                                                        const dateFormatedLastMessage = formatDate(chat.last_message_date);
                                                        return (
                                                            <div key={index} 
                                                                onClick={(e) => handleChatOpen(e, chat._id)}
                                                                onAuxClick={(e) => handleChatOpen(e, chat._id)}
                                                                className='flex w-full h-[100px] hover:bg-[#dd673cfd] hover:opacity-70 hover:cursor-pointer'>

                                                                <div className='flex align-middle items-center px-5 w-full'>
                                                                    <div className='flex'>
                                                                        <div className='size-[55px] rounded-full bg-muted mr-3 flex-shrink-0'></div>
                                                                        
                                                                        <div className='flex flex-col md:w-[200px] lg:w-[300px] max-extraSm:w-[80px] max-sm:w-[120px] max-md:w-[280px]'>
                                                                            <div className='align-top'>
                                                                                <h1 className='line-clamp-2'>{chat.name}</h1>
                                                                            </div>

                                                                            <div className='align-bottom text-sm'>
                                                                                <p className='line-clamp-1 overflow-hidden text-ellipsis whitespace-nowrap'>{lastMessage}</p>
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                </div>

                                                                <div className='flex items-center justify-center mx-5 w-[40%] lg:w-[30%]'>
                                                                    <div className='align-middle'>
                                                                        <span className='text-xs'>{dateFormatedLastMessage}</span>
                                                                    </div>
                                                                </div>
                                                            </div>
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

                                {selectedChatId && (
                                    <React.Fragment>
                                        <span
                                            onClick={(e) => handleChatClose(e, selectedChatId)}
                                            className='max-lg:flex hidden items-center gap-1 -mt-5 hover:underline hover:cursor-pointer'>
                                            <BsChevronLeft size={15}/>
                                            <h1>Go Back</h1>
                                        </span>

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
                                                    
                                                    <input type='text' ref={chatBoxRef} className='w-[95%] outline-none bg-inherit mx-5' placeholder='Type a message...'/>
                                                </label>
                                                <hr className='border border-slate-300 h-[90%] mr-5'/>
                                                <Button
                                                    onClick={(e) => handleSendChatMessage(e, selectedChatId)} 
                                                    className='mr-5'>Send
                                                </Button>
                                            </div>
                                        </div>
                                    </React.Fragment>
                                )}

                            </section>
                            
                            {/* This is going to be the location for the opened chats section */}
                        </div>
                    </div>
                </div>
            </React.Fragment>
        </Suspense>
    )
}

export default Chat;
