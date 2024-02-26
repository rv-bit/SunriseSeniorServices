import { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';

import {config} from '../common/config.js'

import { Post, Get, UserConnected, AuthContext } from '../utils/Fetching.jsx';

export const Login = () => {
  const {setUserAuth} = useContext(AuthContext);
  const navigate = useNavigate();

  const onSubmit = (e) => {
    e.preventDefault();
    const email = e.target.email.value;
    const password = e.target.password.value;

    const UserLoggedIn = Post(`${config.apiPrefix}/login`, {email, password});
    UserLoggedIn.then(response => {
      if (!response.ok || response.status === 403) {
        alert('Email or password is wrong');
      }

      return response.json()
    })
    .then(data => {
      UserConnected().then(UserIsConnected => {
        if (UserIsConnected) {
          setUserAuth(UserIsConnected);
          return navigate('/');
        }
      });
    });
  }    

  return (
    <div>
      <h1>Login</h1>

      <form onSubmit={onSubmit}>
        <input type='text' id='email' placeholder='Email' />
        <input type='password' id='password' placeholder='Password' />

        <button type='submit'>Login</button>
      </form>

    </div>
  )
}