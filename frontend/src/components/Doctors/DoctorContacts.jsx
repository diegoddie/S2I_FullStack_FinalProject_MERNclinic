import React from 'react';

const DoctorContacts = ({ doctor }) => {
  const { city, email, phoneNumber } = doctor;

  return (
    <div className=''>
      <h3 className='text-2xl leading-[30px] font-semibold text-gray-800 mb-4 justify-center items-center mx-auto flex md:block'>Contact Information</h3>
      <div className='flex flex-col gap-3 text-gray-700'>
        <div className='text-lg'>
          <span className='font-semibold text-xl'>City:</span> {city}
        </div>
        <div className='text-lg'>
          <span className='font-semibold text-xl'>Email:</span> {email}
        </div>
        <div className='text-lg'>
          <span className='font-semibold text-xl'>Phone Number:</span> {phoneNumber}
        </div>
      </div>
    </div>
  );
};

export default DoctorContacts;
