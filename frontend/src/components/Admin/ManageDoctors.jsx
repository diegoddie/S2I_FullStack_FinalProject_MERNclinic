import React, { useEffect, useState } from 'react'
import Spinner from '../Utils/Spinner'
import DoctorCard from '../Doctors/DoctorCard'
import DeleteDoctorButton from './DeleteDoctorButton'
import CreateDoctorButton from './CreateDoctorButton'
import { useManageDoctors } from '../../hooks/doctors/useManageDoctors'

const ManageDoctors = () => {
    const { getDoctors, isLoading } = useManageDoctors()
    
    const [doctors, setDoctors] = useState([]);

    const updateDoctorsList = async () => {
      try {
          const doctorsData = await getDoctors();
          setDoctors(doctorsData);
      } catch (error) {
          console.log(error);
      }
    };

    useEffect(() => {
      updateDoctorsList();
    }, []);

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
                Manage Doctors
              </h3>
            </div>
            <div className='flex justify-center mt-5 gap-3'>
              <CreateDoctorButton updateDoctorsList={updateDoctorsList} />
              <DeleteDoctorButton doctors={doctors} updateDoctorsList={updateDoctorsList} />
            </div>
            <div className='flex flex-wrap mt-8 mx-auto justify-center items-center gap-6'>
              {doctors.map((doctor, id) => (
                <div key={id} className='my-2 2xl:w-[350px] w-[340px] mb-8'>
                  <DoctorCard doctor={doctor} />          
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    )
}

export default ManageDoctors