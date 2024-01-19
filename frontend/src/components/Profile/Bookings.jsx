import React, { useEffect, useState } from 'react'
import { useGetDoctors } from '../../hooks/doctors/useGetDoctors'
import DoctorCard from '../Doctors/DoctorCard'
import Alert from '../Utils/Alert'
import Spinner from '../Utils/Spinner'

const Bookings = () => {
  const { getDoctors, error, loading } = useGetDoctors()
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
    <div className=''>
        {error.length > 0 && (
          <div className='w-full max-w-[570px]'>
            {error.map((error, index) => (
              <Alert key={index} type='error' message={error} />
            ))}
          </div>
        )}
        {loading && 
          <div className='flex items-center justify-center mx-auto py-10'>
            <Spinner />
          </div>
        }
        {!loading && (
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
            <div className='flex flex-wrap mt-5 mx-auto justify-center items-center'>
              {filteredDoctors.map((doctor, id) => (
                <div key={id} className='p-2 mx-2 my-2 md:mx-0 object-cover md:w-[350px] md:h-[350px] 2xl:w-[430px] 2xl:h-[430px]'>
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