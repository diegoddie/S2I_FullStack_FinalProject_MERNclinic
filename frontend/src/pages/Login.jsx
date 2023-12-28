import React, { useEffect, useState } from 'react';
import axios from 'axios'
import { Link, useNavigate } from 'react-router-dom';
import Spinner from '../components/Utils/Spinner';
import Alert from '../components/Utils/Alert';
import { useAuth } from "../context/authContext";

const Login = () => {
  const navigate = useNavigate()
  const { user, login } = useAuth();
  const [errorMessages, setErrorMessages] = useState([]);
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async(e) => {
    e.preventDefault();

    try{
      setLoading(true);
      setErrorMessages([]);
      const res = await axios.post('http://localhost:3000/sign-in', formData, { withCredentials: true });

      if(res.status === 200){
        setLoading(false)
        
        await login(res.data)
        const userId = res.data._id
        navigate(`/profile/${userId}`);
      }

    } catch (error) {
      console.log(error);
      setLoading(false);
    
      if (error.response && error.response.data && error.response.data.errors) {
        setErrorMessages(error.response.data.errors.map((err) => err.msg));
      } else if (error.response && error.response.data && error.response.data.message) {
        setErrorMessages([error.response.data.message]);
      } else {
        setErrorMessages(['Something went wrong.']);
      }
    
      console.error('Error during login', error);
    }
  };

  useEffect(()=>{
    if(user){
      navigate('/')
    }
  }, [])

  return (
    <section className='flex flex-col items-center justify-center md:h-screen px-3 md:px-0 py-10 md:py-20'>
      {errorMessages.length > 0 && (
        <div className='w-full max-w-[570px]'>
          {errorMessages.map((error, index) => (
            <Alert key={index} type='error' message={error} />
          ))}
        </div>
      )}
      <div className='w-full max-w-[570px] rounded-lg shadow-2xl p-10 bg-white'>
        <h3 className='text-gray-600 text-2xl leading-9 font-bold mb-6 text-center'>
          Hello, <span>Welcome</span> Back
        </h3>

        {loading && 
          <div className='flex items-center justify-center mx-auto py-10'>
            <Spinner />
          </div>
        }
        {!loading && (
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
        )}
      </div>
    </section>
  );
};

export default Login;
