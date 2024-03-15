import React from 'react'
import { useNavigate } from 'react-router-dom';

import { Button } from '@/app/components/ui/button';

const NotFound = () => {
    const navigate = useNavigate();

    return (
        <React.Fragment>
            <div className='flex flex-col gap-5 items-center justify-center'>
                <h1>Page Not Found</h1>
                <Button onClick={() => navigate('/')}>Go Home</Button>
            </div>
        </React.Fragment>
    )
}

export default NotFound