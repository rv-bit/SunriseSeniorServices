import { Suspense, useEffect, useState } from 'react'

import { Get } from '../../utils/utils' // Common functions 
import { useDocumentTitle} from '../../utils' // Custom hooks

import Loading from '@/app/utils/hooks/Loading'

export const Chat = () => {
    useDocumentTitle('Login')

    const [chatsData, setChatsData] = useState([]);

    useEffect(() => {
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
            <div className='max-w-screen-sm mx-auto mb-5'>
                <h1 className='text-center mb-10'>Chats</h1>

                {chatsData && Object.values(chatsData).map((value, index) => (
                    <div className='text-center' key={index}>{value}</div>
                ))}
            </div>
        </section>
    )
}