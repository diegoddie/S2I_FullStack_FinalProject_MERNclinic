import React, { useState } from 'react';
import { MdClose } from 'react-icons/md';
import Spinner from '../Utils/Spinner';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useAuthContext } from '../../hooks/auth/useAuthContext';
import { toast } from 'react-toastify';
import errorHandler from '../../hooks/utils/errorHandler';

const DeleteAccountButton = ({ model }) => {
    const navigate = useNavigate()
    
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [password, setPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const { user, dispatch } = useAuthContext();

    const handleOpenModal = () => {
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setPassword('');
    };

    const handleDelete = async () => {
        try {
            setPassword('');
            setIsLoading(true);

            if (!password) {
                setIsLoading(false);
                toast.error('Please enter your password to confirm deletion.');
                return;
            }

            try {
                await axios.post(`http://localhost:3000/${model}/verify-password`, { password }, { withCredentials: true });
            } catch (error) {
                setIsLoading(false);
                toast.error('Password verification failed. Please check your password.');
                return;
            }

            try{
                const res = await axios.delete(`http://localhost:3000/${model}/delete/${user._id}`, { withCredentials: true });

                if (res.status === 200) {
                    setIsLoading(false);
                    handleCloseModal();
                    dispatch({ type: 'LOGOUT' });
                    navigate('/')
                    toast.success('Account deleted successfully.');
                }
            }catch(error){
                setIsLoading(false);
                errorHandler(error);
            }
        } catch (error) {
            console.error('Error deleting account:', error);
            setIsLoading(false);

            errorHandler(error)
        }
    };

    return (
        <>
            <button
                onClick={handleOpenModal}
                className='px-8 py-4 leading-5 transition-colors duration-200 transform rounded-full text-xl font-semibold bg-red-500 hover:bg-red-600'
            >
                Delete Account
            </button>

            {isModalOpen && (
                <div className='px-2 py-2 md:px-0 fixed inset-0 z-50 overflow-auto bg-gray-800 bg-opacity-50 flex items-center justify-center'>
                    <div className='bg-white p-8 rounded-lg shadow my-auto'>
                        <div className='flex justify-end'>
                            <button onClick={handleCloseModal} className='text-gray-600 hover:text-gray-800'>
                                <MdClose className='text-xl' />
                            </button>
                        </div>
                        <div className='w-full items-center mx-auto justify-center text-center'>
                            <h3 className='text-2xl font-semibold mb-4'>Delete Account</h3>
                        </div>
                        <div className='p-2 space-y-4'>
                            {isLoading && (
                                <div className='flex items-center justify-center mx-auto py-10'>
                                    <Spinner />
                                </div>
                            )}
                            {!isLoading && (
                                <>
                                    <p className='text-center text-gray-700 mb-2 text-lg md:text-xl font-semibold'>
                                        Are you sure you want to delete your account? This action is irreversible.
                                    </p>
                                    <div>
                                        <p className='text-sm mb-2'>To confirm, please enter your password:</p>
                                        <div>
                                            <input
                                                type='password'
                                                id='password'
                                                name='password'
                                                placeholder='Enter your password'
                                                value={password}
                                                onChange={(e) => setPassword(e.target.value)}
                                                className='border rounded p-2 w-full mb-2'
                                            />
                                        </div>
                                        <button
                                            className='bg-red-500 text-white py-2 px-4 mt-4 rounded'
                                            onClick={handleDelete}
                                        >
                                            Confirm Deletion
                                        </button>
                                    </div>
                                </>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default DeleteAccountButton;