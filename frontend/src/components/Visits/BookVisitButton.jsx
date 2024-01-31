import React, { useState } from 'react'
import { useManageVisits } from '../../hooks/visits/useManageVisits.js'
import { useAuthContext } from '../../hooks/auth/useAuthContext'
import { MdClose } from 'react-icons/md'
import Spinner from '../Utils/Spinner'
import { Link } from 'react-router-dom'

const BookVisitButton = ({ doctor, formattedDate, formattedTime, visitDate }) => {
    const { bookVisit, getUsers, isLoading } = useManageVisits()
    const { user } = useAuthContext()

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [patients, setPatients] = useState([])
    const [selectedPatient, setSelectedPatient] = useState(null);
    console.log(selectedPatient)
    const handleOpenModal = async () => {
        setIsModalOpen(true);

        if (user.isAdmin){
            try {
                const res = await getUsers()
                setPatients(res);
            }catch(error){
                console.error('Error fetching patients:', error);
            }
        }
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try{
            await bookVisit({
                user: user.isAdmin ? selectedPatient : user._id,
                doctor: doctor._id,
                date: visitDate,
            });

            handleCloseModal();
        }catch(error){
            console.error('Error booking a visit:', error);
        }
    };

    return (
        <>
            <button
                className='text-white bg-[#168aad] hover:bg-[#12657f] py-4 lg:py-2 md:mx-2 items-center text-xl rounded leading-4 lg:leading-7 font-bold'
                onClick={handleOpenModal}
            >
                Book
            </button>
            {isModalOpen && (
                <div className='p-2 px-2 md:px-0 fixed inset-0 z-50 overflow-auto bg-gray-800 bg-opacity-50 flex items-center justify-center'>
                    <div className='bg-white p-4 rounded-lg shadow my-auto'>
                        <div className='flex justify-end'>
                            <button onClick={handleCloseModal} className='text-gray-600 hover:text-gray-800'>
                                <MdClose className='text-xl' />
                            </button>
                        </div>
                        {user && (
                            <>
                                <div className='w-full items-center mx-auto justify-center text-center'>
                                    <h3 className='text-2xl font-semibold text-[#168aad]'>Booking Details</h3>
                                </div>
                                <div className='p-6 space-y-4'>
                                    {isLoading && (
                                        <div className='flex items-center justify-center mx-auto py-10'>
                                            <Spinner />
                                        </div>
                                    )}
                                    {!isLoading && (
                                        <>
                                            <div className='flex flex-col justify-center gap-4 mb-4 text-gray-600'>
                                                <label className='text-lg leading-[20px] font-semibold mx-auto mb-1'>
                                                    {formattedDate} {formattedTime}
                                                </label>
                                                {user.isAdmin ? (
                                                    <>  
                                                        <div className='flex flex-row justify-center items-center gap-2'>
                                                            <label className='text-lg leading-[20px] font-semibold'>
                                                                Patient:
                                                            </label>
                                                            <select
                                                                value={selectedPatient}
                                                                onChange={(e) => setSelectedPatient(e.target.value)}
                                                                className='p-2 border border-gray-300 rounded w-full'
                                                            >
                                                                {patients?.map((patient) => (
                                                                    <option key={patient._id} value={patient._id}>
                                                                        {patient.firstName} {patient.lastName} ({patient.taxId})
                                                                    </option>
                                                                ))}
                                                            </select>
                                                        </div>
                                                        
                                                        
                                                    </>
                                                ) : (
                                                    <label className='text-lg leading-[20px] font-semibold'>
                                                        Patient: {user.firstName} {user.lastName}
                                                    </label>
                                                )}
                                                <label className='text-lg leading-[20px] font-semibold'>
                                                    Doctor: {doctor.firstName} {doctor.lastName} ({doctor.specialization})
                                                </label>
                                            </div>
                                            <form onSubmit={handleSubmit} className='pt-3'>
                                                <div className='flex justify-center mx-auto'>
                                                    <button type="submit" className='bg-[#45aece] text-white py-2 px-4 rounded text-lg font-semibold hover:bg-[#168aad]'>
                                                        Confirm
                                                    </button>
                                                </div>
                                            </form>
                                        </>
                                    )}
                                </div>
                            </>
                        )}
                        {!user && (
                            <div className='flex flex-col justify-center gap-4 mb-4'>
                                <label className='text-xl leading-[20px] text-[#168aad] font-semibold mx-auto my-8'>
                                    Please <Link to='/login' className='text-[#173b46]'>login</Link> to book your visit.
                                </label>
                            </div>
                        )}                       
                    </div>
                </div>
            )}
        </>
    )
}

export default BookVisitButton