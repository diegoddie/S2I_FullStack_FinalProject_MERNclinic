import React, { useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import axios from 'axios';
import Alert from '../../components/Utils/Alert';
import Spinner from '../../components/Utils/Spinner';

const PasswordReset = ({ model }) => {
    const { token } = useParams();
    const [formData, setFormData] = useState({
        newPassword: '',
        confirmNewPassword: '',
    });
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState([]);
    const [successMessage, setSuccessMessage] = useState('');

    const handleInputChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        try {
            setSuccessMessage('');
            setIsLoading(true);
            setError([])
            const res = await axios.post(`http://localhost:3000/${model}/password-reset/${token}`, formData);

            if(res.status === 200){
                setIsLoading(false)
                setSuccessMessage(res.data.message);
            }
        } catch (error) {
            setIsLoading(false)
            console.error('Error during password reset', error);

            if (error.response && error.response.data && error.response.data.errors) {
                setError(error.response.data.errors.map((err) => err.msg));
            } else if (error.response && error.response.data && error.response.data.message) {
                setError([error.response.data.message]);
            } else {
                setError(['Something went wrong.']);
            }
        } 
    };

    const getLoginPath = (model) => {
        if (model === 'user') {
            return '/login';
        } else if (model === 'doctor') {
            return '/doctor/login';
        }
    }

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
            Change Password
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
                    type='password'
                    placeholder='New Password'
                    name='newPassword'
                    value={formData.newPassword}
                    onChange={handleInputChange}
                    className='w-full py-3 pl-2 border-b border-solid border-gray-300 focus:outline-none focus:border-gray-800 text-xl leading-7 text-gray-500 cursor-pointer'
                    required
                />
                </div>
                <div className='mb-5'>
                <input
                    type='password'
                    placeholder='Confirm New Password'
                    name='confirmNewPassword'
                    value={formData.confirmNewPassword}
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
                    Reset Password
                </button>
                </div>
            </form>
            )}
            {successMessage && (
                <>
                    <p className='mt-4 text-green-500 text-lg font-bold text-center'>{successMessage}</p>
                    <p className='mt-2 text-gray-400 text-center text-lg'>
                    Please
                        <Link to={getLoginPath(model)} className='text-blue-500 hover:text-blue-700 ml-1 font-semibold'>
                            Login Here
                        </Link>
                    </p>
                </>
            )}
        </div>
        </section>
    );
};

export default PasswordReset;
