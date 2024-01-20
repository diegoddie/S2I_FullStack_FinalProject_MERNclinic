import React from 'react'
import header from '../../assets/header.png'
import { FaShieldHeart } from "react-icons/fa6";
import { Link } from 'react-router-dom';

const Hero = () => {
  return (
    <section className='px-12 xl:pb-8 overflow-hidden'>
      <div className='container mx-auto h-full'>
        <div className='flex flex-col md:flex-row-reverse items-center justify-between h-full'>
          <div className='md:w-1/2 text-center xl:text-left justify-center'>
            <div className='justify-center flex items-center bg-white py-[10px] px-[20px] w-max gap-x-2 rounded-full mx-auto xl:mx-0 mb-[26px]'>
              <FaShieldHeart className='text-2xl text-secondary' />
              <div className='uppercase text-base font-medium text-[#9ab4b7] tracking-[2.24px]'>
                Live your Life
              </div>
            </div>
            <h1 className='text-5xl mb-6 font-bold text-[#168aad]'>Welcome to MyClinic. Your Health, Our Priority.</h1>
            <p className='text-xl mb-8 md:max-w-xl text-gray-700'>At MyClinic, you can book and manage your appointments with our expert doctors, putting your health journey at the forefront of innovation.</p>
            <div className='font-bold text-2xl text-gray-800'>
              <Link to='/sign-up' className='bg-[#ffafcc] py-2 px-4 transition-all duration-300 rounded-xl hover:bg-[#fa7fac]'>
                Join MyClinic
              </Link>
            </div>
          </div>
          <div className='mt-4 flex justify-center items-center mx-auto'>
            <img src={header} alt=""  className=' h-[70%] w-[70%] 2xl:h-full 2xl:w-full'/>
          </div>
        </div>
      </div>
    </section>
  )
}

export default Hero;
