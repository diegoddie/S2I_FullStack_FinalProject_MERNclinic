import React from "react";
import Slider from 'react-slick'
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import DoctorCard from "./DoctorCard";
import { useGetDoctors } from "../../hooks/doctors/useGetDoctors.js";
import { useDoctorContext } from "../../hooks/doctors/useDoctorContext.js";
import Alert from "../Utils/Alert.jsx";
import Spinner from "../Utils/Spinner.jsx";

const Doctors = () => {
    const { doctors } = useDoctorContext()
    const { error, isLoading } = useGetDoctors()

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
            {error.length > 0 && (
              <div className='w-full max-w-[570px]'>
                {error.map((error, index) => (
                  <Alert key={index} type='error' message={error} />
                ))}
              </div>
            )}
            {isLoading && 
              <div className='flex items-center justify-center mx-auto py-10'>
                <Spinner />
              </div>
            }
            {!isLoading && (
              <>
                <div className='md:w-2/3 mx-auto text-center pb-4'>
                    <h2 className='text-4xl mb-4 font-semibold text-[#168aad]'>
                        Our Doctors
                    </h2>
                    <p className="md:text-center text-lg 2xl:text-xl text-gray-700 px-8 text-justify">
                        At MyClinic, we are driven by a passion for delivering exceptional healthcare services. Our commitment extends beyond medical expertise to creating a compassionate and supportive environment for our patients.
                    </p>
                </div>
                <div className="gap-10 px-8 items-center justify-center mx-auto my-10">
                    <Slider {...settings}>
                        {doctors.map((doctor, id) => (
                            <DoctorCard key={id} doctor={doctor} />
                        ))}
                    </Slider>
                </div>
                </>
              )}
            </div>
        </section>
    )
}

export default Doctors