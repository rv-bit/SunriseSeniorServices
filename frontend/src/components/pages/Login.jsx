import { useState, useEffect } from 'react';
import {config} from '../common/config.js'

export default function Login () {
  const [data, setData] = useState(null)

  // useEffect(() => {
  //   fetch(`${config.apiPrefix}/chat`)
  //     .then(response => response.json())
  //     .then(data => {
  //       setData(data) 
  //       console.log(data)
  //     })
  //     .catch(error => console.error('Error fetching data:', error));
  // }, []);

  return (
    <div>
      <h1>Login</h1>
      <form>
        <input type='text' placeholder='Username' />
        <input type='password' placeholder='Password' />
        <button type='submit'>Login</button>
      </form>

      {data && (
        <div>
          {Object.values(data).map((value, index) => {
            return (
              <div key={index}>
                <h2>{value}</h2>
                <hr />
              </div>
            );
          })}
        </div>
      )}
    </div>
  )
}
