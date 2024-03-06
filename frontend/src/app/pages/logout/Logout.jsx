import { useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';

import AuthContext from '../../context/AuthContext'

import { Post, Get } from '../../lib/utils' // Common functions

const Logout = () => {
    const {userAuthData, setUserAuth} = useContext(AuthContext);
    const navigate = useNavigate();

    useEffect(() => {
        if (userAuthData === null || userAuthData === undefined) {
            navigate('/');
            return;
        }

        const fetchData = async () => {
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

        fetchData();
    }, []);

    return (<></>)
}

export default Logout;