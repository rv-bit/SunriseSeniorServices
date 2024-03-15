import { useContext, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'

import AuthContext from '@/app/context/AuthContext'
import useDocumentTitle from '@/app/hooks/UseDocumentTitle' // Custom hooks

import { Get } from '@/app/lib/utils' // Common functions 

const Chat = () => {
    useDocumentTitle('Login')
    const {userAuthData} = useContext(AuthContext);
    const navigate = useNavigate();

    const [chatsData, setChatsData] = useState([]);

    useEffect(() => {
        if (userAuthData === null || userAuthData === undefined) {
            navigate('/');
            return;
        }

        const fetchData = async () => {
            const response = await Get(`${import.meta.env.VITE_API_PREFIX}/chat`);
            if (response.ok) {
                const data = await response.json();
                setChatsData(data.chats);
                return;
            }

            const data = await response.json();
            throw new Error(`Request failed with status code ${response.status}`);
        };

        fetchData();
    }, [])

    return (
        <section className='flex items-center justify-center min-h-5'>
            <div className='mx-auto mb-5'>
                {/* <h1 className='text-center mb-10'>Chats</h1>

                {chatsData && Object.values(chatsData).map((value, index) => (
                    <div className='text-center' key={index}>{value}</div>
                ))} */}
            </div>
        </section>
    )
}

export default Chat;