import React, { useEffect, useState } from 'react'
import DoctorCard from '../Doctors/DoctorCard'
import Spinner from '../Utils/Spinner'
import { useManageDoctors } from '../../hooks/doctors/useManageDoctors'

const Bookings = () => {
  const { getDoctors, isLoading } = useManageDoctors()
  
  const [doctors, setDoctors] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const doctorsData = await getDoctors();
        setDoctors(doctorsData);
      } catch (error) {
        console.log(error);
      }
    };
  
    fetchData();
  }, []);

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const filteredDoctors = doctors.filter((doctor) => {
    const fullName = `${doctor.firstName} ${doctor.lastName}`.toLowerCase();
    const city = doctor.city.toLowerCase();
    const specialization = doctor.specialization.toLowerCase();
    return fullName.includes(searchTerm.toLowerCase()) || specialization.includes(searchTerm.toLowerCase()) || city.includes(searchTerm.toLowerCase());
  });

  return (
    <div className='mb-10'>
        {isLoading && 
          <div className='flex items-center justify-center mx-auto py-10'>
            <Spinner />
          </div>
        }
        {!isLoading && (
          <>
            <div className='font-semibold flex items-center mx-auto justify-center mt-3'>
              <h3 className='text-4xl leading-[30px] text-[#168aad] text-center px-3'>
                Choose a Doctor and Book your visit
              </h3>
            </div>
            <div className='my-6 mx-auto md:max-w-[600px] px-4'>
              <input
                type='text'
                placeholder='🔎 Search by City, Name or Specialization..'
                value={searchTerm}
                onChange={handleSearchChange}
                className='w-full p-2 border border-gray-300 rounded-md bg-gray-200'
              />
            </div>
            <div className='flex flex-wrap mt-5 mx-auto justify-center items-center gap-2'>
              {filteredDoctors.map((doctor, id) => (
                <div key={id} className='my-4 2xl:w-[350px] w-[340px]'>
                  <DoctorCard doctor={doctor} />          
                </div>
              ))}
            </div>
          </>
        )}
    </div>
  )
}

export default Bookings