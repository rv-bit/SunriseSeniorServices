import './Home.css';

import { useState, useEffect } from "react";
import { Post, Get, UserConnected } from '../utils/Fetching';

export const Home = () => {
  const [userAuthData, setUserAuth] = useState([]);

  useEffect(() => {
    UserConnected().then(UserIsConnected => {
      if (UserIsConnected) {
        setUserAuth(UserIsConnected);
      }
    });
  }, [])

  return (
    <div>
      <h1>Home</h1>
      
      <h1>
        {userAuthData && Object.values(userAuthData).map((value, index) => (
          <div key={index}>{value}</div>
        ))}
      </h1>
    </div>
  )
}
