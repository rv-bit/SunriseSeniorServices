import { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';

import {config} from '../common/config.js'

import { Post, Get, UserConnected, AuthContext } from '../utils/Fetching.jsx';

export const Signup = () => {
  const {setUserAuth} = useContext(AuthContext);
  const navigate = useNavigate();

  const onSubmit = (e) => {
    e.preventDefault();
    const username = e.target.username.value;
    const email = e.target.email.value;
    const password = e.target.password.value;
    const password2 = e.target.password2.value;

    const UserLoggedIn = Post(`${config.apiPrefix}/signup`, {username, email, password, password2});
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
      <h1>Sign Up</h1>

      <form onSubmit={onSubmit}>
        <input type='text' id='email' placeholder='Email' />
        <input type='text' id='username' placeholder='Username' />
        <input type='password' id='password' placeholder='Password' />
        <input type='password' id='password2' placeholder='Password Confirmation' />

        <button type='submit'>Sign Up</button>
      </form>

    </div>
  )
}