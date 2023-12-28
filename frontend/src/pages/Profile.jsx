import React, {useEffect} from 'react'
import { useAuth } from '../context/authContext';
import { useNavigate } from 'react-router-dom';

const Profile = () => {
    const { user, login } = useAuth();
    console.log(user)
    const navigate = useNavigate();
    
    useEffect(() => {
        const storedUser = localStorage.getItem('user');
    
        if (storedUser) {
          const parsedUser = JSON.parse(storedUser);
          login(parsedUser);
        } else {
          navigate('/login');
        }
    }, []);
    

    return (
        <div className='text-4xl py-10 h-screen'>
            <h2>Profile</h2>
            <p>{user.firstName} {user.lastName}</p>
        </div>
    )
}

export default Profile