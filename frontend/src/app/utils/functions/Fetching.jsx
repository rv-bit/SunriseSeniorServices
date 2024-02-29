import React from 'react';

const Post = async (url, data) => {
  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(data)
  });

  return response;
}

const Get = async (url, headers) => {
  const response = await fetch(url, {
    method: 'GET',
    headers: headers ? headers : {
      'Content-Type': 'application/json'
    }
  });

  return response;
}

const UserConnected = async () => {
  const response = await Get(`${import.meta.env.VITE_API_PREFIX}/`);

  if (!response.ok) {
    return [];
  }

  const data = await response.json();

  if (data.user === 'Anonymous') {
    return [];
  }

  if (data.user) {
    data.user['isConnected'] = true;
    return data.user;
  }

  return [];
}

const AuthContext = React.createContext();

export { Post, Get, UserConnected, AuthContext }