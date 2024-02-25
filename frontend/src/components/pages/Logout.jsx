import { useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { config } from '../common/config';

import { Get, Post, UserConnected, AuthContext } from '../utils/Fetching';

export const Logout = () => {
    const {setUserAuth} = useContext(AuthContext);
    const navigate = useNavigate();

    useEffect(() => {        
        const UserLoggedOut = Get(`${config.apiPrefix}/logout`);
        UserLoggedOut.then(response => {
            if (!response.ok || response.status === 403) {
                return alert('You are not logged in');
            }

            if (response.status === 200) {
                UserConnected().then(UserIsConnected => {
                    if (UserIsConnected) {
                        setUserAuth(UserIsConnected);
                        return navigate('/');
                    }
                });
            }
        })
    }, []);

    return (
        <>
        </>
    )
}