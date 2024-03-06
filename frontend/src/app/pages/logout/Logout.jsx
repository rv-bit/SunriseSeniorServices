import { useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';

import AuthContext from '../../context/AuthContext'

import { Post, Get } from '../../lib/utils' // Common functions

import { Alertbox } from '@/app/components/custom/Alertbox';

const Logout = () => {
    const {userAuthData, setUserAuth} = useContext(AuthContext);
    const navigate = useNavigate();

    const onSubmit = async (e) => {
        e.preventDefault();

        const response = await Get(`${import.meta.env.VITE_API_PREFIX}/logout`);
        const data = await response.json();

        if (!response.ok) {
            return alert('You are not logged in');
        }

        if (response.ok) {
            setUserAuth(null);
            navigate('/');
        }
    }

    const onCancel = (e) => {
        e.preventDefault();

        navigate('/');
    }

    useEffect(() => {
        if (userAuthData === null || userAuthData === undefined) {
            navigate('/');
            return;
        }

        return () => {};
    }, []);

    return (
        <Alertbox Title="Logout" Description="Are you sure you want to logout?" onSubmit={onSubmit} onCancel={onCancel} />
    )
}

export default Logout;