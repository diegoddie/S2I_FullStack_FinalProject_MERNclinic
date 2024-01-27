import React, { useEffect, useState } from 'react';
import VisitTimeSlot from './VisitTimeSlot';
import { useAuthContext } from '../../hooks/auth/useAuthContext';
import axios from 'axios';
import Spinner from '../Utils/Spinner';

const VisitBook = ({ doctor }) => {
  const { user } = useAuthContext();

  const [isLoading, setIsLoading] = useState(false)
  const [availableSlots, setAvailableSlots] = useState([]);
  console.log(availableSlots)

  useEffect(() => {
    const fetchAvailableSlots = async () => {
      try {
        setIsLoading(true);

        // Esegui la chiamata API per ottenere gli slot disponibili dal backend
        const res = await axios.get(`http://localhost:3000/doctor/${doctor._id}/monthlyAvailability`);

        if(res.status === 200){
          setIsLoading(false)
          setAvailableSlots(res.data.availableSlots);
      }
      } catch (error) {
        console.error('Error fetching available slots:', error);
        setIsLoading(false);
      }
    };

    // Chiamata API solo se l'utente è autenticato
    if (user) {
      fetchAvailableSlots();
    };
  }, [user]);

  return (
    <div className=''>
      {!user && (
        <div>
          <h3 className='text-xl leading-[30px] text-gray-800 font-semibold flex items-center gap-2'>
            Please Log In to see availabilities and book your visit.
          </h3>
        </div>
      )}
      {user && (
        <>
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
          
        </>
      )}
    </div>
  );
};

export default VisitBook;
