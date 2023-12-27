import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const SignUp = () => {
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

  const handleSubmit = (e) => {
    e.preventDefault();
    // Implement logic for sending data to your backend for sign-up
    console.log('Form submitted:', formData);
    // Add API call to your backend for sign-up
  };

  return (
    <section className='flex items-center justify-center md:h-full px-3 md:px-0 py-10 md:py-20'>
      <div className='w-full max-w-[570px] rounded-lg shadow-2xl p-10 bg-white'>
        <h3 className='text-gray-600 text-2xl leading-9 font-bold mb-6 text-center'>
          Create an Account
        </h3>
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
              type='submit'
              className='w-full text-white bg-blue-500 hover:bg-blue-700 text-xl leading-[30px] rounded-lg px-4 py-3'
            >
              Sign Up
            </button>
          </div>
          <p className='mt-5 text-gray-400 text-center text-lg'>
            Already have an account?
            <Link to='/login' className='text-blue-500 hover:text-blue-700 ml-1 font-semibold'>
              Login
            </Link>
          </p>
        </form>
      </div>
    </section>
  );
};

export default SignUp;
