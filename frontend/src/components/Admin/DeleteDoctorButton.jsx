import React, { useState } from 'react';
import { MdClose } from 'react-icons/md';
import axios from 'axios';
import Spinner from '../Utils/Spinner';
import { toast } from 'react-toastify';
import errorHandler from '../../hooks/utils/errorHandler';

const DeleteDoctorButton = ({doctors}) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedDoctor, setSelectedDoctor] = useState('');
    const [password, setPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleOpenModal = () => {
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setSelectedDoctor('')
    };

    const handleDelete = async () => {
        try {
            setPassword('');
            setIsLoading(true);
      
            if (!selectedDoctor) {
                setIsLoading(false);
                toast.error('Please choose a doctor to delete.');
                return;
            }
      
            if (!password) {
                setIsLoading(false);
                toast.error('Please enter your password to confirm deletion.');
                return;
            }
      
            try {
                await axios.post('http://localhost:3000/user/verify-password', { password }, { withCredentials: true });
            } catch (error) {
                setIsLoading(false);
                toast.error('Password verification failed. Please check your password.');
                return;
            }
      
            try{
                const res = await axios.delete(`http://localhost:3000/doctor/delete/${selectedDoctor}`, { withCredentials: true });

                if (res.status === 200) {
                    setIsLoading(false);
                    handleCloseModal();
                    toast.success('Doctor deleted successfully.');
                    window.location.reload();
                }
            }catch(error){
                setIsLoading(false);
                errorHandler(error);
            } 
        } catch(error){
            console.error('Error deleting doctor:', error);
            setIsLoading(false);

            errorHandler(error);
        }
    }

    return (
        <>
            <button
                className='px-6 py-4 leading-5 transition-colors duration-200 transform rounded-md text-xl font-semibold bg-red-500 hover:bg-red-600'
                onClick={handleOpenModal}
            >
                Delete Doctor
            </button>
            {isModalOpen && (
                <div className='px-2 md:px-0 fixed inset-0 z-50 overflow-auto bg-gray-800 bg-opacity-50 flex items-center justify-center'>
                    <div className='bg-white p-4 rounded-lg shadow my-auto'>
                        <div className='flex justify-end'>
                            <button onClick={handleCloseModal} className='text-gray-600 hover:text-gray-800'>
                                <MdClose className='text-xl' />
                            </button>
                        </div>
                        <div className='w-full items-center mx-auto justify-center text-center'>
                            <h3 className='text-2xl font-semibold'>Delete Doctor</h3>
                        </div>
                        <div className='p-2 space-y-4'>
                            {isLoading && (
                                <div className='flex items-center justify-center mx-auto py-10'>
                                    <Spinner />
                                </div>
                            )}
                            {!isLoading && (
                                <>
                                    <p className='text-center text-lg md:text-xl font-semibold'>
                                       Please choose a doctor do delete.
                                    </p>
                                    <div className='mb-2'>
                                        <label htmlFor='doctorDropdown' className='text-sm mb-1 block'>
                                            Select Doctor:
                                        </label>
                                        <select
                                            id='doctorDropdown'
                                            name='doctorDropdown'
                                            value={selectedDoctor}
                                            onChange={(e) => setSelectedDoctor(e.target.value)}
                                            className='border rounded p-2 w-full'
                                        >
                                            <option value=''>Select a doctor</option>
                                            {doctors.map((doctor) => (
                                                <option key={doctor._id} value={doctor._id}>
                                                    {doctor.firstName} {doctor.lastName}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
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
                                        <p className='text-sm text-red-500 font-semibold'>
                                            Please note that deleting a doctor will result in the removal of all associated appointments,  
                                        </p>
                                        <p className='text-sm mb-2 text-red-500 font-semibold'>
                                            and cancellation emails will be sent to affected patients.
                                        </p>
                                        <button
                                            className='bg-red-400 text-white py-2 px-4 mt-4 rounded justify-center mx-auto flex hover:bg-red-500'
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

export default DeleteDoctorButton;
