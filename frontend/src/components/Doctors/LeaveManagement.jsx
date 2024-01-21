import React, { useState } from 'react'
import { useUpdateUser } from '../../hooks/users/useUpdateUser';
import { useAuthContext } from '../../hooks/auth/useAuthContext';
import Spinner from '../Utils/Spinner';
import Alert from '../Utils/Alert';
import PendingLeaveRequests from '../Admin/PendingLeaveRequests';

const LeaveManagement = ({ model }) => {
    const { updateUser, isLoading, error } = useUpdateUser();
    const { user } = useAuthContext();

    const [formData, setFormData] = useState({
        leaveRequests: user.leaveRequests
    });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
      
        try {
          await updateUser({ formData, model });
        } catch (error) {
          console.error('Update User Error:', error);
        }
    };

    return (
        <div className=''>
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
                            Leave Management
                        </h3>
                    </div>
                    <div className='overflow-x-auto'>
                        {user.isAdmin && <PendingLeaveRequests />}
                    </div>
                </>
            )}
        </div>
    )
}

export default LeaveManagement