import { useContext } from "react";

import { useDocumentTitle} from '../../utils' // Custom hooks
import { Post, Get, AuthContext } from '../../utils/utils' // Common functions

export const Home = () => {
  useDocumentTitle('Home');
  const {userAuthData} = useContext(AuthContext);

  return (
    <section className='flex items-center justify-center min-h-5'>
      <div className='max-w-screen-sm mx-auto'>
        <h1 className='text-center'>Home</h1>
        
        <h1 className='text-center'>
          {userAuthData && Object.entries(userAuthData).map(([key, value], index) => (
            <div key={index}>
              {key} : {typeof value === 'object' ? JSON.stringify(value) : value}
            </div>
          ))}
        </h1>
      </div>
    </section>
  )
}
