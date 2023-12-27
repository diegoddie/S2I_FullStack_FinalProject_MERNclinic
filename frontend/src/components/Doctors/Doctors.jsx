import React from "react";
import Slider from 'react-slick'
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import doctorsData from '../../utils/doctorsData.js';
import DoctorCard from "./DoctorCard";

const Doctors = () => {
    const settings = {
        dots: true,
        infinite: true,
        speed: 500,
        slidesToShow: 3, 
        slidesToScroll: 1,
        responsive: [
          {
            breakpoint: 1024,
            settings: {
              slidesToShow: 2,
              slidesToScroll: 1,
              infinite: true,
              dots: true,
            },
          },
          {
            breakpoint: 600,
            settings: {
              slidesToShow: 1,
              slidesToScroll: 1,
            },
          },
        ],
      };

    return (
        <section id='doctors'>
            <div className='py-12 md:py-20 md:px-4 px-2 mx-auto'>
                <div className='md:w-2/3 mx-auto text-center pb-4'>
                    <h2 className='text-4xl mb-4 font-semibold text-[#168aad]'>
                        Our Doctors
                    </h2>
                    <p className="text-center text-lg 2xl:text-xl text-gray-700">
                        At MyClinic, we are driven by a passion for delivering exceptional healthcare services. Our commitment extends beyond medical expertise to creating a compassionate and supportive environment for our patients.
                    </p>
                </div>
                <div className="gap-10 px-8 items-center justify-center mx-auto my-10">
                    <Slider {...settings}>
                        {doctorsData.map((doctor) => (
                            <DoctorCard key={doctor.id} doctor={{ ...doctor, id: doctor.id }} />
                        ))}
                    </Slider>
                </div>
            </div>
        </section>
    )
}

export default Doctors