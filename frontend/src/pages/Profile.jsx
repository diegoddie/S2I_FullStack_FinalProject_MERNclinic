import React from 'react';
import { useEffect, useState } from 'react';
import { useAuthContext } from '../hooks/auth/useAuthContext';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import Alert from '../components/Utils/Alert';
import Spinner from '../components/Utils/Spinner';
import MyVisits from '../components/Profile/MyVisits';
import Bookings from '../components/Profile/Bookings';
import UpdateProfile from '../components/Profile/UpdateProfile';
import Dashboard from '../components/Admin/Dashboard';
import Sidebar from '../components/Utils/Sidebar';
import Security from '../components/Profile/Security';
import ManageDoctors from '../components/Admin/ManageDoctors';
import LeaveManagement from '../components/Profile/LeaveManagement';

const Profile = ({ model }) => {
  const navigate = useNavigate();
  const { token } = useAuthContext();
  const { id } = useParams();

  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState([]);
  const [selectedSection, setSelectedSection] = useState('MyVisits');

  const isAdmin = data?.isAdmin;

  const isDoctor = model === 'doctor';

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError([]);

        const res = await axios.get(`http://localhost:3000/${model}/profile/${id}`, {
          headers: {
            Authorization: `Bearer ${token.token}`,
          },
        });

        if (res.status === 200) {
          setData(res.data);
          setLoading(false);
        }
      } catch (error) {
        setLoading(false);

        if (error.response.status === 401) {
          navigate('*');
        }

        setError(error.response?.data?.errors?.map((err) => err.msg) || ['Something went wrong.']);
      }finally{
        setLoading(false)
      }
    };
    fetchData();
  }, [id, token.token, navigate]);

  const handleMenuItemClick = (section) => {
    setSelectedSection(section);
  };

  return (
      <section className="flex flex-col md:flex-row mx-auto h-full w-full px-2 md:pt-12 pb-4 md:px-6">
        {error.length > 0 && (
          <div className="w-full max-w-[570px]">
            {error.map((error, index) => (
              <Alert key={index} type="error" message={error} />
            ))}
          </div>
        )}
        {loading && (
          <div className="flex items-center justify-center mx-auto py-10">
            <Spinner />
          </div>
        )}
        {!loading && (
          <>
            <Sidebar 
              data={data}
              isAdmin={isAdmin}
              isDoctor={isDoctor}
              selectedSection={selectedSection}
              handleMenuItemClick={handleMenuItemClick}
            />
            <div className='flex-1 bg-[#cef4ed] py-4 rounded-md overflow-x-auto'>
              {selectedSection === 'ManageDoctors' && isAdmin && <ManageDoctors />}
              {selectedSection === 'Dashboard' && isAdmin && <Dashboard />}
              {selectedSection === 'MyVisits' && <MyVisits />}
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
