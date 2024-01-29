import React from 'react'

const DoctorAbout = ({doctorAbout}) => {
  return (
    <div>
        <div>
            <h3 className='text-xl leading-[30px] text-gray-600 font-semibold flex items-center gap-2'>
                {doctorAbout}
            </h3>
        </div>
    </div>
  )
}

export default DoctorAbout