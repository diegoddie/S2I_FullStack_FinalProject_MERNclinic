import React, { useEffect, useState } from "react";
import Slider from 'react-slick'
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import DoctorCard from "../Doctors/DoctorCard.jsx";
import Spinner from "../Utils/Spinner.jsx";
import { useManageDoctors } from "../../hooks/doctors/useManageDoctors.js";

const Doctors = () => {
    const { getDoctors, isLoading } = useManageDoctors()
    const [doctors, setDoctors] = useState([]);

    useEffect(() => {
      const fetchData = async () => {
        try {
          const doctorsData = await getDoctors();
          setDoctors(doctorsData);
        } catch (error) {
          console.log(error);
        }
      };
    
      fetchData();
    }, []); 

    const settings = {
        dots: true,
        speed: 500,
        centerPadding: "0",
        slidesToShow: 4, 
        slidesToScroll: 4,
        responsive: [
          {
            breakpoint: 1662,
            settings: {
              slidesToShow: 3,
              slidesToScroll: 3,
              dots: true,
            },
          },
          {
            breakpoint: 1242,
            settings: {
              slidesToShow: 2,
              slidesToScroll: 2,
              dots: true,
            },
          },
          {
            breakpoint: 857,
            settings: {
              slidesToShow: 1,
              slidesToScroll: 1,
              dots: true,
            },
          },
        ],
      };

    return (
        <section id='doctors'>
            <div className='py-12 md:py-20 md:px-4 px-2 mx-auto'>
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
                      <p className="md:text-center text-lg 2xl:text-xl text-gray-600 px-8 text-justify">
                          At MyClinic, we are driven by a passion for delivering exceptional healthcare services. Our commitment extends beyond medical expertise to creating a compassionate and supportive environment for our patients.
                      </p>
                  </div>
                  <div className="px-8 items-center justify-center mx-auto my-10">
                      <Slider {...settings}>
                        {doctors?.map((doctor, id) => (
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