import './Home.css';

import { useContext } from "react";
import { Post, Get, AuthContext, useDocumentTitle} from '../../utils'

export const Home = () => {
  useDocumentTitle('Home');
  const {userAuthData} = useContext(AuthContext);

  return (
    <section className='flex items-center justify-center min-h-5'>
      <div className='max-w-screen-sm mx-auto'>
        <h1 className='text-center'>Home</h1>
        
        <h1 className='text-center'>
          {userAuthData && Object.values(userAuthData).map((value, index) => (
            <div key={index}>{value}</div>
          ))}
        </h1>
      </div>
    </section>
  )
}
