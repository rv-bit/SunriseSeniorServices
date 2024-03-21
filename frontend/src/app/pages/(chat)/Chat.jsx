import React, { useCallback, useContext, useEffect, useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'

import AuthContext from '@/app/context/AuthContext'
import useDocumentTitle from '@/app/hooks/UseDocumentTitle' // Custom hooks

import { Get } from '@/app/lib/utils' // Common functions 

import { ScrollArea, ScrollBar } from '@/app/components/ui/scroll-area';
import { Button } from '@/app/components/ui/button'
import io from 'socket.io-client';

let socket;

const Chat = () => {
    useDocumentTitle('Chat')

    const {userAuthData, setUserAuth} = useContext(AuthContext);
    const navigate = useNavigate();
    const location = useLocation();

    const queryParams = new URLSearchParams(location.search);
    const currentChatIdFromSearch = queryParams.get('currentChatId');

    const [alertState, setAlertState] = useState({
        open: false,
        message: '',
    });

    const [chats, setChats] = useState([]);
    
    const [chatOpen, setChatOpen] = useState(true);
    const [selectedChatId, setSelectedChatId] = useState({});
    
    const handleOpenInNewTab = useCallback((e, locationTab) => {
        e.preventDefault();
        
        const newWindow = window.open(`${window.location.origin}/#${locationTab}`, '_blank', 'noopener,noreferrer');
        
        if (newWindow) {
            newWindow.opener = null;
        }
    })
    
    const handleChatOpen = (e, chatId) => {
        e.preventDefault();

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

    useEffect(() => {
        if (userAuthData && userAuthData.length < 0 || userAuthData && !userAuthData.isConnected) {
            navigate('/');
            return;
        }

        const fetchData = async () => {
            const response = await Get(`${import.meta.env.VITE_API_PREFIX}/gatherChats`);

            if (!response.ok) {
                const data = await response.json();

                if (data.Error === 'Unauthorized') {
                    setUserAuth(null);
                    navigate('/');
                }

                return;
            }
            
            const data = await response.json();
            setChats(data.chats);
        };
        fetchData();

        return () => {}
    }, [])

    useEffect(() => {
        if (currentChatIdFromSearch && currentChatIdFromSearch !== selectedChatId) {
            const chatIdIndex = chats.findIndex((chat) => chat._id === currentChatIdFromSearch);

            if (chatIdIndex !== -1) {
                setSelectedChatId(chats[chatIdIndex]._id);
                return;
            }
            
            setSelectedChatId(null);

            if (socket) {
                socket.disconnect();
            }
        } else if (selectedChatId && !currentChatIdFromSearch) {
            setSelectedChatId(null);

            if (socket) {
                socket.disconnect();
            }
        }

        return () => {}
    }, [currentChatIdFromSearch, chats]);

    useEffect(() => {
        if (selectedChatId === null && socket) {
            socket.disconnect();
            return;
        }

        if (selectedChatId) {
            socket = io({autoConnect: false});

            // Manually connect
            socket.connect();

            socket.on('connect', () => {
                console.log('Connected to server');
            });

            socket.on('connect_error', (error) => {
                console.log('Connection Error', error);
            });
        }

        return () => {}
    }, [selectedChatId])

    const lastMessage = undefined;

    return (
        <div className='flex items-center justify-center w-full'>
            <div className='mx-5 max-w-[1400px] w-full'>

                <div className={`flex flex-row items-center justify-center w-full ${chatOpen ? 'max-sm:h-auto max-md:h-auto h-[1000px]' : 'h-[1000px]'} my-5`}>

                    <section role='all-chats' className={`items-center justify-between h-full ${chatOpen ? 'sm:hidden max-md:hidden md:flex lg:flex lg:w-[40%] md:w-[50%]' : 'extraSm:flex sm:flex md:flex lg:flex w-[90%] md:w-[70%] lg:w-[40%] max-extraSm:w-[95%]'}`}>
                        <div className='border border-black rounded-l-md w-full h-full'>
                            <ScrollArea className='flex flex-col gap-2 items-center justify-between w-full h-full'>
                                {
                                    chats.map((chat, index) => {
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
                                                        <span className='text-xs'>June 17, 2024</span>
                                                    </div>
                                                </div>
                                            </div>
                                        )
                                    })
                                }

                                <ScrollBar orientation="vertical" />
                            </ScrollArea>
                        </div>
                    </section>

                    <section role='opened-chats' className={`border border-l-0 border-black max-md:border-0 rounded-r-md w-1/2 max-md:w-full max-sm:h-[80dvh] max-extraSm:h-[71dvh] max-md:h-[80dvh] h-full ${chatOpen ? 'block' : 'hidden'}`}>
                        
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
                                <ScrollArea className='p-5 w-full h-[90%]'>
                                    <div className='flex w-full h-auto'>
                                        <div className='flex w-auto h-auto'>

                                            <div className='flex flex-col w-full gap-1'>
                                                <div className='align-top'>
                                                    <h1>John Doe</h1>
                                                </div>

                                                <div className='align-bottom bg-slate-200 rounded-md p-5 overflow-hidden'>
                                                    <p className='text-sm' style={{ overflowWrap: 'anywhere' }} >daklwjhdawkuhdkawhdkawhdawhudawhduahwkdhhawkudikuawhdkawhudhukdkawuhdkwauhdklawhduiawh</p>
                                                </div>
                                            </div>

                                        </div>
                                    </div>

                                    <div className='flex w-full h-auto my-5'>
                                        <div className='flex w-auto h-auto'>

                                            <div className='flex flex-col items-end justify-end w-full gap-1'>
                                                <div className='align-top'>
                                                    <h1>John Doe</h1>
                                                </div>

                                                <div className='align-bottom bg-[#dd673ca9] rounded-md p-5 overflow-hidden'>
                                                    <p className='text-sm' style={{ overflowWrap: 'anywhere' }} >daklwjhdawkuhdkawhdkawhdawhudawhduahwkdhhawkudikuawhdkawhudhukdkawuhdkwauhdklawhduiawh</p>
                                                </div>
                                            </div>
                                            
                                        </div>
                                    </div>
                                    
                                    <ScrollBar orientation="vertical" />
                                </ScrollArea>

                                <div className='px-5'>
                                    <div className='flex items-center justify-center w-full border border-slate-600 rounded-lg h-[60px] shadow-2xl bg-slate-200'>
                                        <label className='flex items-center text-slate-600 w-full h-full focus-within:outline-none focus-within:border focus-within:border-[#ed6c39de] focus-within:rounded-br-sm focus-within:rounded-tr-sm focus-within:rounded-bl-lg focus-within:rounded-tl-lg focus-within:border-b-4 hover:cursor-text'>
                                            <input type='text' className='w-[95%] outline-none bg-inherit mx-5' placeholder='Type a message...'/>
                                        </label>
                                        <hr className='border border-slate-300 h-[90%] mr-5'/>
                                        <Button className='mr-5'>Send</Button>
                                    </div>
                                </div>
                            </React.Fragment>
                        )}

                    </section>
                    
                    {/* This is going to be the location for the opened chats section */}
                </div>
            </div>
        </div>
    )
}

export default Chat;