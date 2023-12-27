import React from 'react'

const VisitTimeSlot = ({day, timeSlot}) => {
  return (
    <div className='shadow-2xl p-5 rounded-md bg-white'>
        <div className='justify-center items-center mx-auto flex'>
            <ul className=''>
                <li className='flex flex-col md:flex-row gap-5 items-center justify-between'>
                    <p className='text-xl leading-6 text-gray-500 font-semibold'>
                        {day}
                    </p>
                    <p className='text-xl leading-6 text-gray-500 font-semibold'>
                        {timeSlot}
                    </p>
                    <button className='bg-[#6fe288] hover:bg-[#2bad36] py-4 px-5 lg:py-2 lg:px-4 text-xl rounded leading-4 lg:leading-7 font-bold text-gray-800'>
                        Book
                    </button>
                </li>
            </ul>
        </div>
    </div>
  )
}

export default VisitTimeSlot