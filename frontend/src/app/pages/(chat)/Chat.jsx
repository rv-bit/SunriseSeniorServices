import { useEffect, useState } from 'react'
import { Get, useDocumentTitle} from '../../utils'

export const Chat = () => {
    useDocumentTitle('Login')

    const [chatsData, setChatsData] = useState([]);

    useEffect(() => {
        const chats = Get(`${import.meta.env.VITE_API_PREFIX || ''}/chat`);
        chats.then(response => {
            if (response.ok) {
                return response.json()
            } else {
                return response.json().then(data => {
                    throw new Error(`Request failed with status code ${response.status}`);
                });
            }
        })
        .then(data => {
            setChatsData(data.chats);
        });
    }, [])

  return (
    <div>
        <h1>Chats</h1>

        {chatsData && Object.values(chatsData).map((value, index) => (
            <div key={index}>{value}</div>
        ))}
    </div>
  )
}