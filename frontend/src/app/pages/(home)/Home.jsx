import './Home.css';

import { useContext } from "react";
import { Post, Get, AuthContext, useDocumentTitle} from '../../utils'

export const Home = () => {
  useDocumentTitle('Home');

  const {userAuthData} = useContext(AuthContext);

  return (
    <section className='max-w-screen-xl px-4 md:px-8 mx-auto mt-12'>
      <h1>Home</h1>

      <h1>
        {userAuthData && Object.values(userAuthData).map((value, index) => (
          <div key={index}>{value}</div>
        ))}
      </h1>
    </section>
  )
}
