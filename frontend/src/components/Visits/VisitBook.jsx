import React, { useEffect, useState } from 'react';
import VisitTimeSlot from './VisitTimeSlot';
import { useAuthContext } from '../../hooks/auth/useAuthContext';
import axios from 'axios';
import Spinner from '../Utils/Spinner';
import errorHandler from '../../hooks/utils/errorHandler';
import { toast } from 'react-toastify';

const VisitBook = ({ doctor }) => {
  const { dispatch } = useAuthContext();

  const [isLoading, setIsLoading] = useState(false)
  const [availableSlots, setAvailableSlots] = useState([]);

  useEffect(() => {
    const fetchAvailableSlots = async () => {
      try {
        setIsLoading(true);

        const res = await axios.get(`http://localhost:3000/doctor/${doctor._id}/weeklyAvailability`);

        if(res.status === 200){
          setIsLoading(false)
          setAvailableSlots(res.data.availableSlots);
        }
      } catch (error) {
        console.error('Error fetching available slots:', error);

        if (error.response && error.response.status === 401) {
          console.log('Token expired. Logging out...');
          localStorage.removeItem('user');
          localStorage.removeItem('token');
          dispatch({ type: 'LOGOUT' });
          
          toast.warning('Session expired. Please log in again.');
      } else {
          errorHandler(error);
      }
      setIsLoading(false);
      }
    };

    fetchAvailableSlots();
  
  }, []);

  return (
    <div className=''>
      <div className='items-center justify-center mx-auto flex'>
        <h3 className='text-2xl leading-[30px] font-semibold text-gray-800 mb-4 justify-center items-center mx-auto flex md:block'>
          Next Availability
        </h3>
      </div>
      {isLoading && 
        <div className='flex items-center justify-center mx-auto py-10'>
          <Spinner />
        </div>
      }
      {!isLoading && 
        <div className='mt-5 mx-auto justify-center items-center'>
          <VisitTimeSlot data={availableSlots} doctor={doctor} />
        </div>
      }
    </div>
  );
};

export default VisitBook;
