import React, { useEffect, useState } from 'react';
import { useAuthContext } from '../../hooks/auth/useAuthContext';
import LeaveManagementTable from '../Utils/LeaveManagementTable';
import { useGetDoctors } from '../../hooks/doctors/useGetDoctors';
import Spinner from '../Utils/Spinner';
import Alert from '../Utils/Alert';

const LeaveManagement = () => {
    const { getDoctors, error, loading } = useGetDoctors();
    const { user } = useAuthContext();

    const isAdmin = user.isAdmin

    const [pendingLeaveRequestsData, setPendingLeaveRequestsData] = useState([]);
    const [selectedTab, setSelectedTab] = useState('pending');

    const handleTabChange = (tab) => {
        setSelectedTab(tab);
    }

    const fetchData = async () => {
        try {
            if (user.isAdmin) {
                const allDoctors = await getDoctors();
    
                const userLeaveRequests = allDoctors.reduce((acc, doctor) => {
                    const { firstName, lastName, _id } = doctor;
                    const leaveRequests = doctor.leaveRequests.filter(request => request.isApproved === null);
    
                    if (leaveRequests.length > 0) {
                        leaveRequests.forEach(request => {
                            acc.push({
                                firstName,
                                lastName,
                                doctorId: _id,
                                ...request,
                            });
                        });
                    }
    
                    return acc;
                }, []);
    
                setPendingLeaveRequestsData(userLeaveRequests);
            } else {
                const userLeaveRequests = user.leaveRequests.filter(request => request.isApproved === null);
    
                setPendingLeaveRequestsData(userLeaveRequests.map(request => ({
                    firstName: user.firstName,
                    lastName: user.lastName,
                    doctorId: user._id,
                    ...request,
                })));
            }
        } catch (error) {
            console.log(error);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    return (
        <div className=''>
            <div className='font-semibold flex items-center mx-auto justify-center mt-3'>
                <h3 className='text-4xl leading-[30px] text-[#168aad] text-center px-3 mb-3'>
                    Leave Management
                </h3>
            </div>
            {error.length > 0 && (
                <div className="flex items-center mx-auto justify-center">
                    {error.map((error, index) => (
                        <Alert key={index} type="error" message={error} />
                    ))}
                </div>
            )}
            {loading && (
                <div className="flex items-center justify-center mx-auto py-10">
                    <Spinner />
                </div>
            )}
            {!loading && (
                <div className='overflow-x-auto'>
                    <LeaveManagementTable isAdmin={isAdmin} data={pendingLeaveRequestsData} />
                </div>
            )}
        </div>
    );
};

export default LeaveManagement;
