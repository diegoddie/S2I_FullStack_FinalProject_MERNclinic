import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { animateScroll as scroll } from 'react-scroll';
import doctorsData from '../utils/doctorsData';
import DoctorAbout from '../components/Doctors/DoctorAbout';
import DoctorContacts from '../components/Doctors/DoctorContacts';
import VisitBook from '../components/Visits/VisitBook';

const DoctorDetails = () => {
  const { id } = useParams();

  const [tab, setTab] = useState('about')

  // Find the doctor with the matching ID
  const doctor = doctorsData.find((doc) => doc.id === parseInt(id));

  useEffect(() => {
    scroll.scrollToTop({
      duration: 500,
      smooth: 'easeInOutQuad',
    });
  }, []);

  return (
    <section className='py-12 h-full'>
        <div className='md:mt-10 px-5 mx-auto'>
            <div className='flex flex-col md:flex-row gap-[50px] mx-auto justify-center items-center'>
                <div className='max-w-[1120px] w-full'>
                    <div className='flex flex-col md:flex-row items-center gap-5 justify-center mx-auto'>
                        <figure className='max-w-[400px] max-h-[400px]'>
                            <img src={doctor.img} alt="" className='w-full' />
                        </figure>
                        <div>
                             <h3 className='py-2 px-2 text-2xl leading-9 font-bold text-gray-800 justify-center mx-auto items-center flex'>
                                {doctor.firstName} {doctor.lastName}
                            </h3>
                            <span className='bg-[#ffc8dd] hover:bg-[#fa7fac] py-4 px-5 lg:py-2 lg:px-6 text-xl rounded leading-4 lg:leading-7 font-bold text-gray-800 items-center justify-center mx-auto flex'>
                                {doctor.specialization}
                            </span>
                        </div>
                    </div>
                    <div className='flex flex-row mt-[50px] border-b border-solid border-gray-400 justify-center items-center mx-auto'>
                        <button onClick={()=>setTab('about')} className={`${tab === 'about' && 'border-b border-solid border-secondary'} py-2 px-5 mr-5 text-xl leading-7 text-gray-700 font-semibold`}>About</button>
                        <button onClick={()=>setTab('contacts')} className={`${tab === 'contacts' && 'border-b border-solid border-secondary'} py-2 px-5 mr-5 text-xl leading-7 text-gray-700 font-semibold`}>Contacts</button>
                        <button onClick={()=>setTab('book')} className={`${tab === 'book' && 'border-b border-solid border-secondary'} py-2 px-5 mr-5 text-xl leading-7 text-gray-700 font-semibold`}>Book</button>
                    </div>
                    <div className='mt-[20px] md:mt-[40px]'>
                        {
                            tab === 'about' && <DoctorAbout doctorAbout={doctor.about}/>
                        }
                        {
                            tab === 'contacts' && <DoctorContacts doctor={doctor}/>
                        }
                        {
                            tab === 'book' && <VisitBook />
                        }
                    </div>
                </div>
            </div>
        </div>
    </section>
  );
};

export default DoctorDetails;
