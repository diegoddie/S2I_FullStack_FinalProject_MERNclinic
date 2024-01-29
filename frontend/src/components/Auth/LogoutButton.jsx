import React from 'react';
import { useLogout } from '../../hooks/auth/useLogout';

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
    <button onClick={handleLogout} className='bg-red-500 text-white py-2 px-4 transition-all duration-300 rounded-lg hover:bg-red-600'>
      Logout
    </button>
  );
};

export default LogoutButton;
