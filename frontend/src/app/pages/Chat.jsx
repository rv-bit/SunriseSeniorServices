import { useEffect, useState } from 'react'
import { Get } from '../utils/Fetching'
import { config } from '../common/config'

export const Chat = () => {
    const [chatsData, setChatsData] = useState([]);

    useEffect(() => {
        const chats = Get(`${config.apiPrefix}/chat`);
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