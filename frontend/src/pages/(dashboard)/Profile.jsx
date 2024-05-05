import { Get } from '@/lib/utils';
import { useState, useEffect } from 'react'
import { useQuery } from 'react-query';
import { useParams } from 'react-router-dom';

const fetchProfile = async (profileId) => {
    const response = await Get(`${import.meta.env.VITE_API_PREFIX}/profile/${profileId}`);

    if (!response.ok) {
        return null;
    }

    const data = await response.json();
    return data;
}

const Profile = () => {
    const { profileId } = useParams();
    const [profile, setProfile] = useState(null);

    const { data } = useQuery(['profile', profileId], () => fetchProfile(profileId), {
        enabled: !!profileId,
    });

    useEffect(() => {
        if (data) {
            setProfile(data);
        }
    }, [data]);

    return (
        <div>
            <h1>Profile</h1>

            {profile && Object.keys(profile).map((key) => (
                <div key={key}>
                    <h2>{key}</h2>
                </div>
            ))}
        </div>
    )
}

export default Profile
