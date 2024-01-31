import React, { useState } from 'react';
import { MdClose } from 'react-icons/md';
import Spinner from '../Utils/Spinner';
import { useCreateDoctor } from '../../hooks/doctors/useCreateDoctor';
import defaultProfilePicture from '../../assets/default-user.jpg'
import CustomWorkShifts from '../Utils/CustomWorkShifts';

const CreateDoctorButton = () => {
    const workingDays = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const {createDoctor, isLoading} = useCreateDoctor()

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [imageError, setImageError] = useState('');
    const [isCustomWorkShifts, setIsCustomWorkShifts] = useState(false);
    const [customWorkShifts, setCustomWorkShifts] = useState([])
    
    const [formData, setFormData] = useState({
      firstName: '',
      lastName: '',
      taxId: '',
      email: '',
      profilePicture: defaultProfilePicture,
      phoneNumber: '',
      specialization: '',
      city: '',
      about: '',
      workShifts: [],
    });

    const handleInputChange = (e) => {
      setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleCustomWorkShiftChange = (day, startTime, endTime) => {
      const isDaySelected = customWorkShifts.some((shift) => shift.dayOfWeek === day);
    
      if (isDaySelected) {
        setCustomWorkShifts((prevShifts) =>
          prevShifts.map((shift) =>
            shift.dayOfWeek === day ? { ...shift, startTime, endTime } : shift
          )
        );
      } else {
        setCustomWorkShifts((prevShifts) => [
          ...prevShifts,
          { dayOfWeek: day, startTime, endTime },
        ]);
      }
    };
    

    const handleFileChange = async(e) => {
      const file = e.target.files[0];

      if (file) {
        if (file.size > 10 * 1024 * 1024) {
          setImageError('File size must be less than 10MB.');
          return;
        }

        const reader = new FileReader();
        reader.onload = () => {
          setFormData({
            ...formData,
            profilePicture: reader.result
          });
          setImageError('');
        };
        reader.onerror = (err) =>{
          console.log("Error: ", err)
        }
        reader.readAsDataURL(file);
      }
    }

    const handleSubmit = async (e) => {
      e.preventDefault();

      try {
        await createDoctor({
          formData: {
            ...formData,
            workShifts: isCustomWorkShifts ? customWorkShifts : undefined,
          },
        });
        handleCloseModal()
      } catch (error) {
        console.error('Error adding a new doctor:', error);
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
                className='px-5 py-3 leading-4 transition-colors duration-200 transform rounded-lg text-xl font-semibold text-white bg-[#168aad] hover:bg-[#12657f]'
                onClick={handleOpenModal}
            >
                Add Doctor
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
                            <h3 className='text-2xl font-semibold text-[#168aad]'>Add A New Doctor</h3>
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
                                    <div className='flex justify-center items-center gap-4 mx-auto pt-4'>
                                      <div className='flex items-center justify-center'>
                                        <figure className='w-[100px] h-[100px] md:w-[120px] md:h-[120px] rounded-full border-2 border-solid border-secondary flex items-center justify-center'>
                                          <img src={formData.profilePicture} alt='' className='w-full h-full rounded-full object-cover' />
                                        </figure>
                                      </div>
                                      <div className='flex items-center justify-center'>
                                        <label
                                          htmlFor="dropzone-file"
                                          className='flex flex-col items-center justify-center border-2 border-secondary border-dashed rounded-lg bg-gray-50 cursor-pointer hover:bg-gray-100'
                                        >
                                          <div className='flex flex-col items-center justify-center py-5 px-2'>
                                            <p className="mb-2 text-sm text-gray-600 text-center"><span className="font-semibold">Click to upload</span> or drag and drop</p>
                                            <p className="text-xs text-gray-600">PNG, JPEG or JPG (max. 10MB)</p>
                                          </div>
                                          <input id="dropzone-file" type="file" className="hidden" onChange={handleFileChange} accept='.jpeg, .png, .jpg'/>
                                        </label>
                                        {imageError && (
                                            <p className="text-red-500 text-sm ml-2">{imageError}</p>
                                        )}
                                      </div>
                                    </div>
                                    <div className='grid grid-cols-1 sm:grid-cols-2 my-8 gap-8 items-center justify-center mx-auto px-10'>
                                      <div>
                                        <label className='text-lg leading-[20px] text-[#168aad] font-semibold'>
                                          First Name
                                          <input
                                            type="text"
                                            name="firstName"
                                            value={formData.firstName}
                                            onChange={handleInputChange}
                                            className='font-semibold text-lg w-full px-4 py-2 mt-2 text-gray-700 bg-gray-100 border-2 border-gray-400 rounded-md  focus:border-blue-500 focus:outline-none focus:ring'
                                          />
                                        </label>
                                      </div>
                                      <div>
                                        <label className='text-lg leading-[20px] text-[#168aad] font-semibold'>
                                          Last Name
                                          <input
                                            type="text"
                                            name="lastName"
                                            value={formData.lastName}
                                            onChange={handleInputChange}
                                            className='font-semibold text-lg w-full px-4 py-2 mt-2 text-gray-700 bg-gray-100 border-2 border-gray-400 rounded-md  focus:border-blue-500 focus:outline-none focus:ring'
                                          />
                                        </label>
                                      </div>
                                      <div>
                                        <label className='text-lg leading-[20px] text-[#168aad] font-semibold'>
                                          Email
                                          <input
                                            type="email"
                                            name="email"
                                            value={formData.email}
                                            onChange={handleInputChange}
                                            className='font-semibold text-lg w-full px-4 py-2 mt-2 text-gray-700 bg-gray-100 border-2 border-gray-400 rounded-md  focus:border-blue-500 focus:outline-none focus:ring'
                                          />
                                        </label>
                                      </div>
                                      <div>
                                        <label className='text-lg leading-[20px] text-[#168aad] font-semibold'>
                                          TaxId
                                          <input
                                            type="text"
                                            name="taxId"
                                            value={formData.taxId}
                                            onChange={handleInputChange}
                                            className='font-semibold text-lg w-full px-4 py-2 mt-2 text-gray-700 bg-gray-100 border-2 border-gray-400 rounded-md  focus:border-blue-500 focus:outline-none focus:ring'
                                          />
                                        </label>
                                      </div>
                                      <div>
                                        <label className='text-lg leading-[20px] text-[#168aad] font-semibold'>
                                          Phone Number
                                          <input
                                            type="text"
                                            name="phoneNumber"
                                            value={formData.phoneNumber}
                                            onChange={handleInputChange}
                                            className='font-semibold text-lg w-full px-4 py-2 mt-2 text-gray-700 bg-gray-100 border-2 border-gray-400 rounded-md  focus:border-blue-500 focus:outline-none focus:ring'
                                          />
                                        </label>
                                      </div>
                                      <div>
                                        <label className='text-lg leading-[20px] text-[#168aad] font-semibold'>
                                          Specialization
                                          <input
                                            type="text"
                                            name="specialization"
                                            value={formData.specialization}
                                            onChange={handleInputChange}
                                            className='font-semibold text-lg w-full px-4 py-2 mt-2 text-gray-700 bg-gray-100 border-2 border-gray-400 rounded-md  focus:border-blue-500 focus:outline-none focus:ring'
                                          />
                                        </label>
                                      </div>
                                      <div>
                                        <label className='text-lg leading-[20px] text-[#168aad] font-semibold'>
                                          City
                                          <input
                                            type="text"
                                            name="city"
                                            value={formData.city}
                                            onChange={handleInputChange}
                                            className='font-semibold text-lg w-full px-4 py-2 mt-2 text-gray-700 bg-gray-100 border-2 border-gray-400 rounded-md  focus:border-blue-500 focus:outline-none focus:ring'
                                          />
                                        </label>
                                      </div>
                                      <div>
                                        <label className='text-lg leading-[20px] text-[#168aad] font-semibold'>
                                          About
                                          <input
                                            type="text"
                                            name="about"
                                            value={formData.about}
                                            onChange={handleInputChange}
                                            className='font-semibold text-lg w-full px-4 py-2 mt-2 text-gray-700 bg-gray-100 border-2 border-gray-400 rounded-md  focus:border-blue-500 focus:outline-none focus:ring'
                                          />
                                        </label>
                                      </div>
                                    </div>
                                    <div className='flex flex-col justify-center mx-auto items-center pt-4 pb-2'>
                                        <label className='text-xl leading-[20px] text-[#168aad] font-semibold mb-2'>
                                          Work Shifts
                                        </label>
                                        <div className='flex items-center space-x-4 mt-2'>
                                          <label className='flex items-center text-xl leading-[10px] text-[#168aad]'>
                                            <input
                                              type='checkbox'
                                              name='isCustomWorkShifts'
                                              checked={!isCustomWorkShifts}
                                              onChange={() => setIsCustomWorkShifts(!isCustomWorkShifts)}
                                              className='mr-2'
                                            />
                                            Default
                                          </label>
                                          <label className='flex items-center text-xl leading-[10px] text-[#168aad]'>
                                            <input
                                              type='checkbox'
                                              name='isCustomWorkShifts'
                                              checked={isCustomWorkShifts}
                                              onChange={() => setIsCustomWorkShifts(!isCustomWorkShifts)}
                                              className='mr-2'
                                            />
                                            Custom
                                          </label>
                                        </div>
                                        <div className='mt-4'>
                                          {isCustomWorkShifts && (
                                            <CustomWorkShifts
                                              workingDays={workingDays}
                                              customWorkShifts={customWorkShifts}
                                              handleCustomWorkShiftChange={handleCustomWorkShiftChange}
                                            />
                                          )}
                                        </div>
                                      </div>
                                    <div className='flex justify-center mx-auto'>
                                      <button type="submit" className='bg-[#45aece] text-white py-2 px-4 rounded text-lg font-semibold hover:bg-[#168aad]'>
                                        Add A New Doctor
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

export default CreateDoctorButton;
