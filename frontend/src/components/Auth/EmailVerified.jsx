import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { useManageAuth } from '../../hooks/auth/useManageAuth';
import Spinner from '../Utils/Spinner';
import { IoIosCheckmarkCircle } from 'react-icons/io';
import { toast } from 'react-toastify';

const EmailVerified = ({ model }) => {
    const { token } = useParams();
    const { verifyMail, requestNewVerificationEmail, isLoading } = useManageAuth();

    const [verificationStatus, setVerificationStatus] = useState(null);
    const [showNewVerificationMailButton, setshowNewVerificationMailButton] = useState(false);
    const [email, setEmail] = useState('');

    const verifyEmail = async () => {
        try {
            const isMailVerified = await verifyMail(model, token);

            if (isMailVerified) {
                setVerificationStatus('success');
                toast.success("Email verified! You can now Log In.")
            } 
        } catch (error) {
            console.error('Error during email verification:', error);
            setVerificationStatus('error');

            if (error.name === 'TokenExpiredError') {
                setshowNewVerificationMailButton(true);
            }
        }
    };

    const handleRequestNewVerificationEmail = async () => {
        try {
            const isNewVerificationMailSent = await requestNewVerificationEmail(email); 
            if(isNewVerificationMailSent){
                toast.success("New verification email requested successfully. Check your inbox.");
            }
        } catch (error) {
            console.error('Error requesting new verification email:', error);
            toast.error("Failed to request a new verification email. Please try again or contact support.");
        }
    };

    useEffect(() => {
        verifyEmail()
    }, [token]);

    return (
        <section className='flex flex-col items-center justify-center md:h-screen px-3 md:px-0 py-10 md:py-20'>

                {isLoading && 
                    <div className='flex items-center justify-center mx-auto py-10'>
                        <Spinner />
                    </div>
                }
                {!isLoading && verificationStatus === 'success' && (
                    <>
                        <h3 className='text-[#168aad] text-3xl leading-9 font-semibold mb-6 text-center'>
                            Mail verified!
                        </h3>
                        <div className='text-center md:h-screen'>
                            <div className='flex flex-col md:flex-row mx-auto justify-center items-center gap-3'>
                                <IoIosCheckmarkCircle className='w-[100px] h-[100px] text-green-400' />
                                <p className='text-gray-500 text-xl font-semibold'>
                                    You can now Log in.
                                </p>
                            </div>
                        </div>
                    </>
                )}
                {!isLoading && verificationStatus === 'error' && (
                    <>
                        <h3 className='text-[#168aad] text-3xl leading-9 font-semibold mb-6 text-center'>
                            Email verification failed. Please try again or contact support.
                        </h3>
                        {showNewVerificationMailButton && (
                            <div className='w-full max-w-[570px] rounded-lg shadow-2xl p-10 bg-white'>
                                <div className='mb-5'>
                                    <input
                                        type='email'
                                        id="email"
                                        placeholder='Enter your Email'
                                        name='email'
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        className='w-full py-3 pl-2 border-b border-solid border-gray-300 focus:outline-none focus:border-gray-800 text-xl leading-7 text-gray-500 cursor-pointer'
                                        required
                                    />
                                </div>
                                <div className='mt-7'>
                                    <button onClick={handleRequestNewVerificationEmail} className='px-5 py-3 leading-4 transition-colors duration-200 transform rounded-lg text-xl font-semibold text-white bg-[#168aad] hover:bg-[#12657f]'>
                                        Send new verification email
                                    </button>
                                </div>
                            </div>
                        )}
                    </>
                )}


        </section>
    );
};

export default EmailVerified;
