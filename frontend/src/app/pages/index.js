export * from './(home)/Home';
export * from './(login)/Login';
export * from './(signup)/Signup';
export * from './(chat)/Chat';

export * from './(logout)/Logout';
export * from './(get-started-account)/FormCreateAccount'

import { Post } from '../utils';

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