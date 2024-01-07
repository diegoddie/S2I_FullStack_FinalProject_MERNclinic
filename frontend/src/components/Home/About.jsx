import React from "react";
import clinic from "../../assets/clinic.jpg";

const About = () => {
  return (
    <section id='about'>
      <div className='py-16 md:px-4 px-2 mx-auto'>
        <div className='md:w-1/2 mx-auto text-center'>
          <h2 className='text-4xl font-semibold text-[#168aad]'>
            About Us
          </h2>
        </div>
        <div className="flex flex-col lg:flex-row justify-between items-center lg:px-40 px-8 mt-5 md:mt-10 gap-5 md:space-x-2">
          <div className="w-full md:w-3/4 space-y-6">
            <h2 className="text-center text-4xl font-semibold text-gray-800">
              Why Choose Our Clinic
            </h2>
            <p className="text-justify text-lg 2xl:text-xl text-gray-700">
              At MyClinic, we are driven by a passion for delivering exceptional healthcare services. Our commitment extends beyond medical expertise to creating a compassionate and supportive environment for our patients. 
            </p>
            <p className="text-justify text-lg 2xl:text-xl text-gray-700">
              We prioritize the well-being of our patients and strive to provide personalized care tailored to individual needs. Our team of dedicated professionals is here to ensure a positive and comfortable experience throughout your healthcare journey.
            </p>
          </div>
          <div className="w-full lg:w-3/4">
            <img className="rounded-lg 2xl:h-[90%] 2xl:w-[90%] justify-center mx-auto items-center" src={clinic} alt="img"/>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;
