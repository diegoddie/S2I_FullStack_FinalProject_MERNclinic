import React, { useState } from 'react';
import { useUpdateUser } from '../../hooks/users/useUpdateUser';
import { useAuthContext } from '../../hooks/auth/useAuthContext';
import Alert from '../Utils/Alert';
import Spinner from '../Utils/Spinner';

const Settings = () => {
    const { updateUser, isLoading, error } = useUpdateUser();
    const { user } = useAuthContext();

    const [isFormModified, setIsFormModified] = useState(false);
    const [formData, setFormData] = useState({
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        password: '', 
        confirmPassword: '',
        taxId: user.taxId,
        phoneNumber: user.phoneNumber,
        profilePicture: user.profilePicture
    });

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
        setIsFormModified(true);
    };

    const handleFileChange = async(e) => {
      const file = e.target.files[0];

      if (file) {
        setIsFormModified(true);
        const reader = new FileReader();
        reader.onload = () => {
          setFormData({
            ...formData,
            profilePicture: reader.result
          });
        };
        reader.onerror = (err) =>{
          console.log("Error: ", err)
        }
        reader.readAsDataURL(file);
      }
    }

    const handleSubmit = async (e) => {
      e.preventDefault();
    
      if (formData.password === '') {
        delete formData.password;
        delete formData.confirmPassword;
      }
    
      try {
        await updateUser({ formData });
      } catch (error) {
        console.error('Update User Error:', error);
      }
    };

    return (
      <div>
        {isLoading && 
          <div className='flex items-center justify-center mx-auto py-10'>
            <Spinner />
          </div>
        }
        {error.length > 0 && (
          <div className='w-full max-w-[570px] items-center justify-center text-center mx-auto'>
            {error.map((error, index) => (
              <Alert key={index} type='error' message={error} />
            ))}
          </div>
        )}
        {!isLoading && (
          <>
            <div className='font-semibold flex items-center mx-auto justify-center mt-3'>
              <h3 className='text-4xl leading-[30px] text-[#168aad] text-center px-3 mb-3'>
                Settings
              </h3>
            </div>
            <form onSubmit={handleSubmit} className=''>
              <div className='flex justify-center items-center gap-4 mx-auto pt-4'>
                <div className='flex items-center justify-center'>
                  <figure className='w-[100px] h-[100px] md:w-[120px] md:h-[120px] rounded-full border-2 border-solid border-secondary flex items-center justify-center'>
                    <img src={formData.profilePicture} alt='' className='w-full h-full rounded-full' />
                  </figure>
                </div>
                <div className='flex items-center justify-center'>
                  <label
                    htmlFor="dropzone-file"
                    className='flex flex-col items-center justify-center border-2 border-secondary border-dashed rounded-lg bg-gray-50 cursor-pointer hover:bg-gray-100'
                  >
                    <div className='flex flex-col items-center justify-center py-5 px-2'>
                      <p className="mb-2 text-sm text-gray-600 text-center"><span className="font-semibold">Click to upload</span> or drag and drop</p>
                      <p className="text-xs text-gray-600">PNG, JPG only</p>
                    </div>
                    <input id="dropzone-file" type="file" className="hidden" onChange={handleFileChange} accept='.jpeg, .png, .jpg'/>
                  </label>
                </div>
              </div>
              <div className='grid grid-cols-1 sm:grid-cols-2 my-8 gap-8 items-center justify-center mx-auto px-10'>
                <div>
                  <label className='text-xl leading-[20px] text-[#168aad] font-bold'>
                    First Name
                    <input
                      type="text"
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleChange}
                      className='font-semibold text-lg w-full px-4 py-2 mt-2 text-gray-700 bg-gray-200 border-2 border-gray-400 rounded-md  focus:border-blue-500 focus:outline-none focus:ring'
                    />
                  </label>
                </div>
                <div>
                  <label className='text-xl leading-[20px] text-[#168aad] font-bold'>
                    Last Name
                    <input
                      type="text"
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleChange}
                      className='font-semibold text-lg w-full px-4 py-2 mt-2 text-gray-700 bg-gray-200 border-2 border-gray-400 rounded-md  focus:border-blue-500 focus:outline-none focus:ring'
                    />
                  </label>
                </div>
                <div>
                  <label className='text-xl leading-[20px] text-[#168aad] font-bold'>
                    Email
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      className='font-semibold text-lg w-full px-4 py-2 mt-2 text-gray-700 bg-gray-200 border-2 border-gray-400 rounded-md  focus:border-blue-500 focus:outline-none focus:ring'
                    />
                  </label>
                </div>
                <div>
                  <label className='text-xl leading-[20px] text-[#168aad] font-bold'>
                    Phone Number
                    <input
                      type="text"
                      name="phoneNumber"
                      value={formData.phoneNumber}
                      onChange={handleChange}
                      className='font-semibold text-lg w-full px-4 py-2 mt-2 text-gray-700 bg-gray-200 border-2 border-gray-400 rounded-md  focus:border-blue-500 focus:outline-none focus:ring'
                    />
                  </label>
                </div>
                <div>
                  <label className='text-xl leading-[20px] text-[#168aad] font-bold'>
                    Change Password
                    <input
                      type="password"
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      className='font-semibold text-lg w-full px-4 py-2 mt-2 text-gray-700 bg-gray-200 border-2 border-gray-400 rounded-md  focus:border-blue-500 focus:outline-none focus:ring'
                    />
                  </label>
                </div>
                <div>
                  <label className='text-xl leading-[20px] text-[#168aad] font-bold'>
                    Confirm Password
                    <input
                      type="password"
                      name="confirmPassword"
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      className='font-semibold text-lg w-full px-4 py-2 mt-2 text-gray-700 bg-gray-200 border-2 border-gray-400 rounded-md  focus:border-blue-500 focus:outline-none focus:ring'
                    />
                  </label>
                </div>
              </div>
              
              <div className='flex justify-center py-5'>
                <button 
                  type="submit" 
                  disabled={isLoading || !isFormModified}
                  className={`px-8 py-4 leading-5 transition-colors duration-200 transform rounded-full text-xl font-semibold ${(!isFormModified) ? 'bg-[#b6a7a7] cursor-not-allowed' : 'bg-[#ffc8dd] hover:bg-[#fa7fac]'}`}
                >
                  UPDATE
                </button>
              </div>
            </form>
          </> 
        )}
      </div>
    );
};

export default Settings;
