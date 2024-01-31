import React from 'react';
import { useManageAuth } from '../../hooks/auth/useManageAuth';

const LogoutButton = () => {
  const { logout } = useManageAuth()

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
