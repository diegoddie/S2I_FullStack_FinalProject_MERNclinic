import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Spinner from '../components/Utils/Spinner';
import { animateScroll as scroll } from 'react-scroll';
import { useManageUsers } from '../hooks/users/useManageUsers';
import { IoIosCheckmarkCircle } from "react-icons/io";

const SignUp = () => {
  const { signUp, isLoading } = useManageUsers()

  const [isRegistrationComplete, setIsRegistrationComplete] = useState(false);
  console.log(isRegistrationComplete)
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    taxId: '',
    password: '',
    confirmPassword: '',
  });

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async(e) => {
    e.preventDefault();

    try{
      const registrationSuccessful = await signUp({ formData });
      console.log(registrationSuccessful)
      if (registrationSuccessful) {
        setIsRegistrationComplete(true);
      }
    } catch (error) {
      console.error('Error during sign-up:', error);
    }
  };

  useEffect(() => {
    setIsRegistrationComplete(null);

    scroll.scrollToTop({
        duration: 500,
        smooth: 'easeInOutQuad',
    });
  }, []);

  return (
    <section className='flex flex-col items-center justify-center md:h-full px-3 md:px-0 py-10 md:py-20'>
      {!isRegistrationComplete ? (
      <div className='w-full max-w-[570px] rounded-lg shadow-2xl p-10 bg-white'>
        <h3 className='text-[#168aad] text-2xl leading-9 font-semibold mb-6 text-center'>
          Create an Account
        </h3>
        {isLoading && 
          <div className='flex items-center justify-center mx-auto py-10'>
            <Spinner />
          </div>
        }
        {!isLoading && (
          <form onSubmit={handleSubmit} className='py-4'>
            <div className='mb-5'>
              <input
                type='text'
                placeholder='First Name'
                name='firstName'
                value={formData.firstName}
                onChange={handleInputChange}
                className='w-full py-3 pl-2 border-b border-solid border-gray-300 focus:outline-none focus:border-gray-800 text-xl leading-7 text-gray-500 cursor-pointer'
                required
              />
            </div>
            <div className='mb-5'>
              <input
                type='text'
                placeholder='Last Name'
                name='lastName'
                value={formData.lastName}
                onChange={handleInputChange}
                className='w-full py-3 pl-2 border-b border-solid border-gray-300 focus:outline-none focus:border-gray-800 text-xl leading-7 text-gray-500 cursor-pointer'
                required
              />
            </div>
            <div className='mb-5'>
              <input
                type='email'
                placeholder='Email'
                name='email'
                value={formData.email}
                onChange={handleInputChange}
                className='w-full py-3 pl-2 border-b border-solid border-gray-300 focus:outline-none focus:border-gray-800 text-xl leading-7 text-gray-500 cursor-pointer'
                required
              />
            </div>
            <div className='mb-5'>
              <input
                type='text'
                placeholder='Tax ID'
                name='taxId'
                value={formData.taxId}
                onChange={handleInputChange}
                className='w-full py-3 pl-2 border-b border-solid border-gray-300 focus:outline-none focus:border-gray-800 text-xl leading-7 text-gray-500 cursor-pointer'
                required
              />
            </div>
            <div className='mb-5'>
              <input
                type='password'
                placeholder='Password'
                name='password'
                value={formData.password}
                onChange={handleInputChange}
                className='w-full py-3 pl-2 border-b border-solid border-gray-300 focus:outline-none focus:border-gray-800 text-xl leading-7 text-gray-500 cursor-pointer'
                required
              />
            </div>
            <div className='mb-5'>
              <input
                type='password'
                placeholder='Confirm Password'
                name='confirmPassword'
                value={formData.confirmPassword}
                onChange={handleInputChange}
                className='w-full py-3 pl-2 border-b border-solid border-gray-300 focus:outline-none focus:border-gray-800 text-xl leading-7 text-gray-500 cursor-pointer'
                required
              />
            </div>
            <div className='mt-7'>
              <button
                disabled={isLoading}
                type='submit'
                className='w-full text-white bg-[#168aad] hover:bg-[#12657f] text-xl leading-[30px] rounded-lg px-4 py-3'
              >
                Sign Up
              </button>
            </div>
          </form>
        )}
        <p className='mt-5 text-gray-400 text-center text-lg'>
          Already have an account?
          <Link to='/login' className='text-[#168aad] hover:text-[#12657f] ml-1 font-semibold'>
            Login
          </Link>
        </p>
      </div>
      ) : (
        <div className='text-center md:h-screen'>
          <p className='text-[#168aad] text-3xl leading-9 font-semibold mb-2 md:mb-5'>
            Registration completed successfully!
          </p>
          <div className='flex flex-col md:flex-row mx-auto justify-center items-center gap-3'>
            <IoIosCheckmarkCircle className='w-[100px] h-[100px] text-green-400' />
            <p className='text-gray-500 text-xl font-semibold'>
              Please check your email for verification.
            </p>
          </div>
        </div>
      )}
    </section>
  );
};

export default SignUp;
