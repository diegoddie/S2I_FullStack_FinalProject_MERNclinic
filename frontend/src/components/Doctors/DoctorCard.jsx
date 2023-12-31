import React from 'react';
import { Link } from 'react-router-dom';
import { MdArrowRightAlt } from 'react-icons/md';

const DoctorCard = ({ doctor }) => {
  const { firstName, lastName, specialization, profilePicture, _id } = doctor;

  return (
    <div className='px-4'>
      <div className='relative'>
        <img src={profilePicture} alt='doctor' className='w-full h-[250px] md:h-[400px] object-cover' />
      </div>
      <h2 className='text-lg leading-[30px] lg:text-xl lg:leading-9 font-semibold mt-2'>
        {firstName} {lastName}
      </h2>
      <div className='mt-2 flex items-center justify-between'>
        <span className='bg-[#ffc8dd] hover:bg-[#fa7fac] px-3 py-3 lg:px-6 md:text-lg rounded leading-4 lg:leading-7 font-bold'>
          {specialization}
        </span>
        <div className='flex items-center'>
          <Link
            to={`/doctor/${_id}`}
            className='w-[32px] h-[32px] md:w-[44px] md:h-[44px] rounded-full border border-solid border-black flex items-center justify-center group hover:bg-secondary'
          >
            <MdArrowRightAlt className='w-6 h-6' />
          </Link>
        </div>
      </div>
    </div>
  );
};

export default DoctorCard;
