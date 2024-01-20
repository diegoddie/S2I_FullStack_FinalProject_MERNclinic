import React from 'react';
import { Link } from 'react-router-dom';
import { MdArrowRightAlt } from 'react-icons/md';

const DoctorCard = ({ doctor }) => {
  const { firstName, lastName, specialization, profilePicture, _id, city } = doctor;

  return (
    <div className='mx-2'>
      <div className='relative overflow-hidden h-[250px] 2xl:h-[330px] rounded-t-xl'>
        <img src={profilePicture} alt='doctor' className='w-full h-full object-cover rounded-t-xl' />
      </div>
      <h2 className='text-2xl leading-[30px] lg:leading-9 font-semibold mt-1'>
        {firstName} {lastName} - <span className='text-lg md:text-lg'>{city}</span>
      </h2>
      <div className='mt-2 flex items-center justify-between'>
        <span className='bg-[#ffc8dd] hover:bg-[#fa7fac] px-3 py-3 lg:px-6 text-xl rounded leading-4 lg:leading-5 font-bold'>
          {specialization}
        </span>
        <div className='flex items-center'>
          <Link
            to={`/doctor/${_id}`}
            className='w-[44px] h-[44px] rounded-full border border-solid border-black flex items-center justify-center group hover:bg-secondary'
          >
            <MdArrowRightAlt className='w-6 h-6' />
          </Link>
        </div>
      </div>
    </div>
  );
};

export default DoctorCard;