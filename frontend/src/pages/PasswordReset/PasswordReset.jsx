import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import Spinner from '../../components/Utils/Spinner';
import { useManageAuth } from '../../hooks/auth/useManageAuth';

const PasswordReset = ({ model }) => {
    const { token } = useParams()
    const { passwordReset, isLoading } = useManageAuth()

    const [formData, setFormData] = useState({
        newPassword: '',
        confirmNewPassword: '',
    });

    const handleInputChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        try {
            await passwordReset({ model, token, formData })
            setFormData({
                newPassword: '',
                confirmNewPassword: '',
            });
        } catch (error) {
            console.error('Error during password reset', error);
        } 
    };

    return (
        <section className='flex flex-col items-center justify-center md:h-screen px-3 md:px-0 py-10 md:py-20'>
            <div className='w-full max-w-[570px] rounded-lg shadow-2xl p-10 bg-white'>
                <h3 className='text-[#168aad] text-2xl leading-9 font-semibold mb-6 text-center'>
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
                                className='w-full text-white bg-[#168aad] hover:bg-[#12657f] text-xl leading-[30px] rounded-lg px-4 py-3'
                            >
                                Reset Password
                            </button>
                        </div>
                    </form>
                )}
            </div>
        </section>
    );
};

export default PasswordReset;
