import React, { useEffect, useState } from 'react';
import VisitTimeSlot from './VisitTimeSlot';
import Spinner from '../Utils/Spinner';
import { useManageDoctors } from '../../hooks/doctors/useManageDoctors';

const BookVisit = ({ doctor }) => {
  const { getDoctorWeeklyAvailability, isLoading } = useManageDoctors()

  const [availableSlots, setAvailableSlots] = useState([]);
  console.log(availableSlots)
  useEffect(() => {
    const fetchAvailableSlots = async () => {
      const data = await getDoctorWeeklyAvailability(doctor._id)
      setAvailableSlots(data);
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

export default BookVisit;
