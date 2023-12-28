import React from 'react'
import { useAuthContext } from '../hooks/useAuthContext';

const Profile = () => {
    const { user } = useAuthContext();
    const userLoggedIn = user.user

    return (
        <div className='text-4xl py-10 h-screen'>
            <h2>Profile</h2>
            <p>{userLoggedIn.firstName} {userLoggedIn.lastName}</p>
        </div>
    )
}

export default Profile