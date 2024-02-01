import React, { useState } from 'react';
import { MdClose } from 'react-icons/md';
import Spinner from '../Utils/Spinner';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { useManageDoctors } from '../../hooks/doctors/useManageDoctors';

const CreateLeaveRequest = () => {
  const { updateDoctor, isLoading } = useManageDoctors();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    leaveRequests: [
      {
        typology: '',
        startDate: '',
        endDate: '',
      },
    ],
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      leaveRequests: [
        {
          ...prevData.leaveRequests[0],
          [name]: value,
        },
      ],
    }));
  };

  const handleDateChange = (date, field) => {
    setFormData((prevData) => ({
      ...prevData,
      leaveRequests: [
        {
          ...prevData.leaveRequests[0],
          [field]: date,
        },
      ],
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await updateDoctor({
        formData,
      });

      setFormData({
        leaveRequests: [
          {
            typology: '',
            startDate: '',
            endDate: '',
          },
        ],
      });
      
      handleCloseModal()

    } catch (error) {
      console.error("Error updating doctor's leave requests:", error);
    }
  };

  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  return (
    <>
      <button
        className='px-5 py-3 leading-4 transition-colors duration-200 transform rounded-md text-xl font-semibold text-white bg-[#29992e] hover:bg-green-800'
        onClick={handleOpenModal}
      >
        New Request
      </button>
      {isModalOpen && (
        <div className='p-2 px-2 md:px-0 fixed inset-0 z-50 overflow-auto bg-gray-800 bg-opacity-50 flex items-center justify-center'>
          <div className='bg-white p-4 rounded-lg shadow my-auto'>
            <div className='flex justify-end'>
              <button onClick={handleCloseModal} className='text-gray-600 hover:text-gray-800'>
                <MdClose className='text-xl' />
              </button>
            </div>
            <div className='w-full items-center mx-auto justify-center text-center'>
              <h3 className='text-2xl font-semibold text-[#168aad]'>New Request</h3>
            </div>
            <div className='p-2 space-y-4'>
              {isLoading && (
                <div className='flex items-center justify-center mx-auto py-10'>
                  <Spinner />
                </div>
              )}
              {!isLoading && (
                <>
                  <form onSubmit={handleSubmit} className=''>
                    <div className='flex flex-col my-8 gap-8 items-center justify-center mx-auto px-10'>
                      <div className='flex gap-5'>
                      <div>
                        <label className='text-lg leading-[20px] text-[#168aad] font-semibold'>
                          Vacation
                          <input
                            type='checkbox'
                            name='typology'
                            checked={formData.leaveRequests[0].typology === 'vacation'}
                            onChange={() => handleInputChange({ target: { name: 'typology', value: 'vacation' } })}
                            className='ml-2 text-lg leading-[20px] text-[#168aad] font-semibold'
                          />
                        </label>
                      </div>
                      <div>
                        <label className='text-lg leading-[20px] text-[#168aad] font-semibold'>
                          Leave
                          <input
                            type='checkbox'
                            name='typology'
                            checked={formData.leaveRequests[0].typology === 'leaves'}
                            onChange={() => handleInputChange({ target: { name: 'typology', value: 'leaves' } })}
                            className='ml-2'
                          />
                        </label>
                      </div>
                      </div>
                      {formData.leaveRequests[0].typology && (
                        <>
                          <div className=''>
                          <label className='flex flex-col text-lg leading-[20px] text-[#168aad] font-semibold'>
                            From
                            <DatePicker
                              selected={formData.leaveRequests[0].startDate}
                              onChange={(date) => handleDateChange(date, 'startDate')}
                              dateFormat={formData.leaveRequests[0].typology === 'vacation' ? 'dd/MM/yyyy' : 'dd/MM/yyyy HH:mm'}
                              showTimeSelect={formData.leaveRequests[0].typology === 'leaves'} 
                              timeFormat='HH:mm'
                              timeIntervals={30}
                              timeCaption='Time'
                              className='font-semibold text-lg w-full px-4 py-2 mt-2 text-gray-700 bg-gray-100 border-2 border-gray-400 rounded-md focus:border-blue-500 focus:outline-none focus:ring'
                            />
                          </label>
                          </div>
                          <div>
                            <label className='flex flex-col text-lg leading-[20px] text-[#168aad] font-semibold'>
                              To
                              <DatePicker
                                selected={formData.leaveRequests[0].endDate}
                                onChange={(date) => handleDateChange(date, 'endDate')}
                                dateFormat={formData.leaveRequests[0].typology === 'vacation' ? 'dd/MM/yyyy' : 'dd/MM/yyyy HH:mm'}
                                showTimeSelect={formData.leaveRequests[0].typology === 'leaves'} 
                                timeFormat='HH:mm'
                                timeIntervals={30}
                                timeCaption='Time'
                                className='font-semibold text-lg w-full px-4 py-2 mt-2 text-gray-700 bg-gray-100 border-2 border-gray-400 rounded-md focus:border-blue-500 focus:outline-none focus:ring'
                              />
                            </label>
                          </div>
                        </>
                      )}
                    </div>
                    <div className='flex justify-center mx-auto'>
                      <button type='submit' className='bg-[#45aece] text-white py-2 px-4 rounded text-lg font-semibold hover:bg-[#168aad]'>
                        Confirm
                      </button>
                    </div>
                  </form>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default CreateLeaveRequest;
