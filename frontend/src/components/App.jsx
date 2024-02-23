import './App.css'

import { useState, useEffect } from 'react'
import { Routes, Route } from 'react-router-dom'

import Navbar from './utils/Navbar'
import Home from './pages/Home'
import Login from './pages/Login'
import Signup from './pages/Signup'

export default function App() {
  // const [count, setCount] = useState(0)
  // const [data, setData] = useState(null)

  // useEffect(() => {
  //   fetch(`${apiPrefix}/chat`)
  //     .then(response => response.json())
  //     .then(data => {
  //       setData(data) 
  //       console.log(data)
  //     })
  //     .catch(error => console.error('Error fetching data:', error));
  // }, []);

  // return (  
  //   <div>
  //     <p1>
  //       Hello, World! This is a React app. The count is {count}.
  //       <button onClick={() => setCount(count + 1)}>Increment</button>

  //       {data && (
  //         <div>
  //           {Object.values(data).map((value, index) => {
  //             return (
  //               <div key={index}>
  //                 <h2>{value}</h2>
  //                 <hr />
  //               </div>
  //             );
  //           })}
  //         </div>
  //       )}
  //     </p1>
  //   </div>
  // )

  return (
    <div className='App'>
      <Navbar />

      <Routes>
        <Route path='/' element={<Home />} />

        <Route path='/login' element={<Login />} />
        <Route path='/signup' element={<Signup />} />
      </Routes>
    </div>
  ) 
}