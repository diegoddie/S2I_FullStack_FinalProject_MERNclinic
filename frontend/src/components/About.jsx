import React from "react";
import clinic from "../assets/clinic.jpg";

const About = () => {
  return (
    <section id='about'>
      <div className='py-16 md:px-4 px-2 mx-auto bg-green-100'>
        <div className='md:w-1/2 mx-auto text-center'>
          <h2 className='text-4xl mb-3 font-semibold'>
            About MyClinic
          </h2>
        </div>
        <div className="flex flex-col lg:flex-row justify-between items-center lg:px-32 px-5 mt-10 gap-5">
          <div className="w-full lg:w-3/4 space-y-6">
            <h2 className="text-justify lg:text-start text-3xl font-semibold">
              Why Mucsjcadi
            </h2>
            <p className="text-justify lg:text-start">
              Lorem ipsum dolor sit amet consectetur, adipisicing elit. Tempora quia
              suscipit illum, numquam incidunt nostrum dolor officia doloremque
              cupiditate, placeat explicabo sed iure atque neque quidem ipsam!
              Dolor, minus reiciendis.
            </p>
          </div>
          <div className="w-full lg:w-3/4">
            <img className="rounded-lg" src={clinic} alt="img" />
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;
