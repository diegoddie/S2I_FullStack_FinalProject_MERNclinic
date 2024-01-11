import React, { useState } from 'react';
import axios from 'axios';
import Alert from '../../components/Utils/Alert';
import Spinner from '../../components/Utils/Spinner';

const PasswordResetRequest = ({ model }) => {
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
  });

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setIsLoading(true);

    try {
      const response = await axios.post(`http://localhost:3000/${model}/password-reset-request`, formData);
      setMessage(response.data.message);
      setError('');
    } catch (error) {
      console.error('Error during the password reset request', error);
      setMessage('');
      setError(error.response.data.message || 'An error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section className='flex flex-col items-center justify-center md:h-screen px-3 md:px-0 py-10 md:py-20'>
      {error.length > 0 && (
        <div className='w-full max-w-[570px]'>
          {error.map((error, index) => (
            <Alert key={index} type='error' message={error} />
          ))}
        </div>
      )}
      <div className='w-full max-w-[570px] rounded-lg shadow-2xl p-10 bg-white'>
        <h3 className='text-gray-600 text-2xl leading-9 font-bold mb-6 text-center'>
          Password Reset Request
        </h3>

        {isLoading && (
          <div className='flex items-center justify-center mx-auto py-10'>
            <Spinner />
          </div>
        )}
        {!isLoading && (
          <form onSubmit={handleSubmit} className='py-4'>
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
            <div className='mt-7'>
              <button
                disabled={isLoading}
                type='submit'
                className='w-full text-white bg-blue-500 hover:bg-blue-700 text-xl leading-[30px] rounded-lg px-4 py-3'
              >
                Send me an Email
              </button>
            </div>
          </form>
        )}
        {message && <p className='mt-4 text-green-500 text-lg font-bold text-center'>{message}</p>}
      </div>
    </section>
  );
};

export default PasswordResetRequest;
