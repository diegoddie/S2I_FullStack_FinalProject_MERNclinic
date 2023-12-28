import React from 'react';
import { useLogout } from '../../hooks/useLogout';

const LogoutButton = () => {
  const { logout } = useLogout()

  const handleLogout = async () => {
    try {
      logout()
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
