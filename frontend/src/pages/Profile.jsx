import React from 'react';
import { useState } from 'react';
import { useAuthContext } from '../hooks/auth/useAuthContext';
import Spinner from '../components/Utils/Spinner';
import Bookings from '../components/Profile/Bookings';
import UpdateProfile from '../components/Profile/UpdateProfile';
import Dashboard from '../components/Profile/Dashboard';
import Sidebar from '../components/Sidebar';
import Security from '../components/Profile/Security';
import ManageDoctors from '../components/Profile/ManageDoctors';
import LeaveManagement from '../components/Profile/LeaveManagement';
import Visits from '../components/Profile/Visits';

const Profile = ({ model }) => {
  const { user } = useAuthContext();

  const [selectedSection, setSelectedSection] = useState(() => {
    return user.isAdmin ? 'Dashboard' : 'Visits';
  });

  const isAdmin = user?.isAdmin;
  const isDoctor = model === 'doctor';

  const handleMenuItemClick = (section) => {
    setSelectedSection(section);
  };

  return (
      <section className="flex flex-col md:flex-row mx-auto h-full w-full px-2 md:pt-12 pb-4 md:px-6">
        {!user && (
          <div className="flex items-center justify-center mx-auto py-10">
            <Spinner />
          </div>
        )}
        {user && (
          <>
            <Sidebar 
              data={user}
              isAdmin={isAdmin ?? false}
              isDoctor={isDoctor ?? false}
              selectedSection={selectedSection}
              handleMenuItemClick={handleMenuItemClick}
            />
            <div className='flex-1 bg-[#cef4ed] py-4 rounded-md'>
              {selectedSection === 'ManageDoctors' && isAdmin && <ManageDoctors />}
              {selectedSection === 'Dashboard' && isAdmin && <Dashboard />}
              {selectedSection === 'Visits' && <Visits />}
              {selectedSection === 'Bookings' && !isDoctor && <Bookings />}
              {selectedSection === 'LeaveManagement' && (isDoctor || isAdmin) && <LeaveManagement model={model} />}
              {selectedSection === 'Update' && <UpdateProfile model={model}/>}
              {selectedSection === 'Security' && <Security model={model}/>}
            </div>
          </>
        )}  
    </section>
  );
};

export default Profile;
