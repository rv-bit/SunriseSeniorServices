
import { clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export const Post = async (url, data) => {
  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(data)
  });

  return response;
}

export const Get = async (url, headers) => {
  const response = await fetch(url, {
    method: 'GET',
    headers: headers ? headers : {
      'Content-Type': 'application/json'
    }
  });

  return response;
}

export const googleCheckAccount = async (code) => {
  if (!code) return;

  const promiseData = await Post(`${import.meta.env.VITE_API_PREFIX}/google/checkAccount`, { code });
  const response = await promiseData;

  if (!response.ok) {
    const data = await response.json();
    return [false, data];
  }

  const data = await response.json();
  return [true, data];
};

export const userLogIn = async (formData) => {
  if (!formData) return;

  const promiseData = Post(`${import.meta.env.VITE_API_PREFIX}/login`, { email: formData.email, password: formData.password });
  const response = await promiseData;

  if (!response.ok) {
    const data = await response.json();
    return [false, data];
  }

  const data = await response.json();
  return [true, data];
}

export function cn(...inputs) {
  return twMerge(clsx(inputs))
}