import React from 'react'
import { FaSearch, FaCheckCircle, FaCalendar } from "react-icons/fa";

const Services = () => {
    const services = [
        {id: 1, title: "Find a doctor", description: "Connect with experienced doctors near you.", icon: <FaSearch className='w-10 h-10 text-emerald-500'/>},
        {id: 2, title: "Book a visit", description: "Schedule and manage your appointments online.", icon: <FaCalendar className='w-10 h-10 text-emerald-500' />},
        {id: 3, title: "Visit Completed", description: "You successfully concluded your visit with our doctors.", icon: <FaCheckCircle className='w-10 h-10 text-emerald-500'/>}
    ]

    return (
        <section id='services' className='bg-white'>
          <div className='py-12 md:py-20 md:px-4 px-8 mx-auto'>
            <div className='md:w-1/2 mx-auto text-center pb-4'>
                <h2 className='text-4xl mb-4 font-semibold text-[#168aad]'>
                    Services
                </h2>
                <p className="lg:text-start text-center text-lg 2xl:text-xl">
                    At MyClinic, we are driven by a passion for delivering exceptional healthcare services. Our commitment extends beyond medical expertise to creating a compassionate and supportive environment for our patients.
                </p>
            </div>
            <div className='mt-12 mx-auto flex flex-wrap gap-12 md:gap-0'>
                {
                    services.map(service => 
                    <div key={service.id} className='mx-auto md:h-60 rounded-md shadow cursor-pointer hover:-translate-y-5 hover:border-b-4 hover:border-secondary transition-all duration-300 flex items-center justify-center h-full px-4 py-8 text-center w-[300px]'>
                        <div className=''>
                            <div className='bg-gray-200 h-14 w-14 mx-auto rounded-tl-3 rounded-br-3xl mb-4'>{service.icon}</div>
                            <h4 className='text-2xl font-bold mb-2 px-2'>{service.title}</h4>
                            <p className='px-2'>{service.description}</p>
                        </div>    
                    </div>
                    )
                }
            </div>
          </div>
        </section>
    )
}

export default Services