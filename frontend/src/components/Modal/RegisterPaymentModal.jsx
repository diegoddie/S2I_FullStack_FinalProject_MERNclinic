import React, { useState } from 'react'
import { MdClose } from 'react-icons/md'
import errorHandler from '../../hooks/utils/errorHandler';
import { useManageVisits } from '../../hooks/visits/useManageVisits';
import Spinner from '../Utils/Spinner';

const RegisterPaymentModal = ({ onClose, id, updateFilteredData }) => {
    const { updateVisit, isLoading } = useManageVisits();

    const [fileError, setFileError] = useState('');
    const [formData, setFormData] = useState({
        paid: false,
        amount: 0,
        paymentMethod: 'cash',
        invoiceNumber: '',
        invoiceFile: ''
    });

    const handleFileChange = async(e) => {
        const file = e.target.files[0];
  
        if (file) {
          if (file.size > 10 * 1024 * 1024) {
            setFileError('File size must be less than 10MB.');
            return;
          }
  
          const reader = new FileReader();
          reader.onload = () => {
            setFormData({
              ...formData,
              invoiceFile: reader.result
            });
            setFileError('');
          };
          reader.onerror = (err) =>{
            console.log("Error: ", err)
          }
          reader.readAsDataURL(file);
        }
    }

    const handleInputChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
  
        try {
            await updateVisit({ id, formData })
            updateFilteredData(id)
            onClose()
        } catch (error) {
            console.error('Error updating the visit:', error);
            errorHandler(error)
        }
    };

    return (
        <div className='px-2 py-2 md:px-0 fixed inset-0 z-50 bg-gray-800 bg-opacity-50 flex items-center justify-center'>
            <div className='bg-white p-5 rounded-lg shadow my-auto'>
                <div className='flex justify-end'>
                    <button onClick={onClose} className='text-gray-600 hover:text-gray-800'>
                        <MdClose className='text-xl' />
                    </button>
                </div>
                <div className='w-full items-center mx-auto justify-center text-center'>
                    <h3 className='text-2xl font-semibold mb-2 text-[#168aad]'>Register Payment</h3>
                </div>
                <div className='p-2 space-y-2'>
                    {isLoading && (
                        <div className='flex items-center justify-center mx-auto py-10'>
                            <Spinner />
                        </div>
                    )}
                    {!isLoading && (
                        <>
                            <form onSubmit={handleSubmit} className=''>
                                <div className='flex items-center justify-center'>
                                    <label className='text-lg leading-[20px] text-[#168aad] font-semibold mr-3' htmlFor='paid'>Paid:</label>
                                    <select name='paid' id='paid' value={formData.paid} onChange={handleInputChange} className='bg-gray-100 border border-gray-300 rounded p-1'>
                                        <option value={false}>NO</option>
                                        <option value={true}>YES</option>
                                    </select>
                                </div>
                                {formData.paid && (
                                    <>
                                    <div className='grid grid-cols-1 sm:grid-cols-2 my-4 gap-2 justify-center mx-auto'>
                                        <div className='flex items-center my-2'>
                                            <label htmlFor='amount' className='text-lg leading-[20px] text-[#168aad] font-semibold mr-2'>Amount:</label>
                                            <input 
                                                type='number' 
                                                name='amount' 
                                                id='amount' 
                                                value={formData.amount} 
                                                onChange={handleInputChange} 
                                                className='bg-gray-100 border border-gray-300 rounded p-1'
                                            />
                                        </div>
                                        <div className='flex items-center my-2'>
                                            <label htmlFor='paymentMethod' className='text-lg leading-[20px] text-[#168aad] font-semibold mr-2'>Payment Method:</label>
                                            <select
                                                name="paymentMethod"
                                                value={formData.paymentMethod}
                                                onChange={handleInputChange}
                                                className="border border-gray-300 rounded p-2"
                                            >
                                                <option value="cash">Cash</option>
                                                <option value="credit card">Credit Card</option>
                                                <option value="paypal">PayPal</option>
                                                <option value="bank transfer">Bank Transfer</option>
                                                <option value="debit card">Debit Card</option>
                                            </select>
                                        </div>
                                        <div className='flex items-center my-2'>
                                            <label htmlFor='invoiceNumber' className='text-lg leading-[20px] text-[#168aad] font-semibold mr-2'>Invoice Number:</label>
                                            <input 
                                                type='text' 
                                                name='invoiceNumber' 
                                                id='invoiceNumber' 
                                                value={formData.invoiceNumber} 
                                                onChange={handleInputChange} 
                                                className='bg-gray-100 border border-gray-300 rounded p-1'
                                            />
                                        </div>
                                        <div className='flex items-center my-2'>
                                            <label htmlFor='invoiceFile' className='text-lg leading-[20px] text-[#168aad] font-semibold mr-2'>File:</label>
                                            <input 
                                                type='file' 
                                                name='invoiceFile' 
                                                id='invoiceFile' 
                                                onChange={handleFileChange} 
                                                className=''
                                            />
                                            {fileError && (
                                                <p className="text-red-500 text-sm ml-2">{fileError}</p>
                                            )}
                                        </div>
                                    </div>
                                    <div className='flex justify-center mx-auto mt-8'>
                                      <button type="submit" className='bg-[#45aece] text-white py-2 px-4 rounded text-lg font-semibold hover:bg-[#168aad]'>
                                        Save Payment
                                      </button>
                                    </div>
                                    </>
                                )}
                            </form>
                        </>
                    )}
                </div>
            </div>
        </div>
    )
}

export default RegisterPaymentModal