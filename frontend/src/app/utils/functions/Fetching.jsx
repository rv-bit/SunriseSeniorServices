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

const AuthContext = React.createContext();

export { Post, Get, AuthContext }