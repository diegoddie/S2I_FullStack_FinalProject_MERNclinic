import React from 'react';
import axios from 'axios';
import { useAuth } from '../../context/authContext';
import { useNavigate } from 'react-router-dom';

const LogoutButton = () => {
  const { logout } = useAuth(); 
  const navigate = useNavigate()

  const handleLogout = async () => {
    try {
      const res = await axios.get('http://localhost:3000/sign-out', {withCredentials: true});

      if(res.status === 200){
        logout()
        navigate('/');
      }
    } catch (error) {
      console.error('Error during logout', error);
    }
  };

  return (
    <button onClick={handleLogout} className='bg-red-300 py-2 px-4 transition-all duration-300 rounded-xl hover:bg-red-400'>
      Logout
    </button>
  );
};

export default LogoutButton;
