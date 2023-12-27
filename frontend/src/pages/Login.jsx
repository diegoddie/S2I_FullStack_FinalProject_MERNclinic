import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <section className='flex items-center justify-center md:h-screen px-3 md:px-0 py-10 md:py-20'>
      <div className='w-full max-w-[570px] rounded-lg shadow-2xl p-10 bg-white'>
        <h3 className='text-gray-600 text-2xl leading-9 font-bold mb-6 text-center'>
          Hello, <span>Welcome</span> Back
        </h3>
        <form action='' className='py-4'>
          <div className='mb-5'>
            <input
              type='email'
              placeholder='Enter your Email'
              name='email'
              value={formData.email}
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
          <div className='mt-7'>
            <button
              type='submit'
              className='w-full text-white bg-blue-500 hover:bg-blue-700 text-xl leading-[30px] rounded-lg px-4 py-3'
            >
              Login
            </button>
          </div>
          <p className='mt-5 text-gray-400 text-center text-lg'>
            Don't have an account?
            <Link to='/sign-up' className='text-blue-500 hover:text-blue-700 ml-1 font-semibold'>
              Register
            </Link>
          </p>
        </form>
      </div>
    </section>
  );
};

export default Login;
