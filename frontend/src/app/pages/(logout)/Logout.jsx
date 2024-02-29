import { useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';

import { Get, Post, UserConnected, AuthContext } from '../../utils';

export const Logout = () => {
    const {setUserAuth} = useContext(AuthContext);
    const navigate = useNavigate();

    useEffect(() => {        
        const UserLoggedOut = Get(`${import.meta.env.VITE_API_PREFIX}/logout`);
        UserLoggedOut.then(response => {
            if (response.ok) {
                return response.json();
            } else {
                return response.json().then(data => {
                    alert(data.Error)
                    throw new Error(`Request failed with status code ${response.status}`);
                });
            }
        })
        .then(data => {
            setUserAuth(null);
            return navigate('/');
        });
    }, []);

    return (<></>)
}