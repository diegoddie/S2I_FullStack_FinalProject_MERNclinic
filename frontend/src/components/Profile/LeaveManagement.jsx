import React, { useEffect, useState } from 'react';
import { useAuthContext } from '../../hooks/auth/useAuthContext';
import LeaveManagementTable from '../Utils/LeaveManagementTable';
import { useGetDoctors } from '../../hooks/doctors/useGetDoctors';
import Spinner from '../Utils/Spinner';
import CreateLeaveRequest from '../Doctors/CreateLeaveRequest';

const LeaveManagement = () => {
    const { getDoctors, loading } = useGetDoctors();
    const { user } = useAuthContext();

    const [pendingLeaveRequestsData, setPendingLeaveRequestsData] = useState([]);
    const [allLeaveRequestsData, setAllLeaveRequestsData] = useState([]);
    const [selectedTab, setSelectedTab] = useState('pendingRequests');

    const isAdmin = user.isAdmin

    const handleTabChange = (tab) => {
        setSelectedTab(tab);
    }

    const fetchAllData = async () => {
        try {
            if (user.isAdmin) {
                const allDoctors = await getDoctors();

                const allUserLeaveRequests = allDoctors.reduce((acc, doctor) => {
                    const { firstName, lastName, _id } = doctor;
                    const leaveRequests = doctor.leaveRequests.map(request => ({
                        firstName,
                        lastName,
                        doctorId: _id,
                        ...request,
                    }));

                    if (leaveRequests.length > 0) {
                        acc.push(...leaveRequests);
                    }

                    return acc;
                }, []);

                setAllLeaveRequestsData(allUserLeaveRequests);
            } else {
                const allUserLeaveRequests = user.leaveRequests.map(request => ({
                    firstName: user.firstName,
                    lastName: user.lastName,
                    doctorId: user._id,
                    ...request,
                }));

                setAllLeaveRequestsData(allUserLeaveRequests);
            }
        } catch (error) {
            console.log(error);
        }
    };

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
        fetchAllData();
    }, []);

    return (
        <div className=''>
            <div className='font-semibold flex items-center mx-auto justify-center mt-3'>
                <h3 className='text-4xl leading-[30px] text-[#168aad] text-center px-3 mb-3'>
                    Leave Management
                </h3>
            </div>
            {loading && (
                <div className="flex items-center justify-center mx-auto py-10">
                    <Spinner />
                </div>
            )}
            {!loading && (
                <div className='overflow-x-auto'>
                    {isAdmin ? (
                        <LeaveManagementTable isAdmin={isAdmin} data={pendingLeaveRequestsData} title="Pending Requests"/>
                    ) : (
                        <>
                        <div className="flex gap-2 justify-center pt-4">
                            <button onClick={() => handleTabChange('pendingRequests')} className="px-6 py-4 leading-5 transition-colors duration-200 transform rounded-md text-xl font-semibold bg-green-500 hover:bg-green-600">Pending Requests</button>
                            <button onClick={() => handleTabChange('allRequests')} className="px-6 py-4 leading-5 transition-colors duration-200 transform rounded-md text-xl font-semibold bg-green-500 hover:bg-green-600">All Requests</button>
                            <CreateLeaveRequest />
                        </div>
                        {selectedTab === 'pendingRequests' && (
                            <LeaveManagementTable isAdmin={isAdmin} data={pendingLeaveRequestsData} title="Pending Requests"/>
                        )}

                        {selectedTab === 'allRequests' && (
                            <LeaveManagementTable isAdmin={isAdmin} data={allLeaveRequestsData} title="Requests"/>
                        )}
                        </>
                    )}
                </div>
            )}
        </div>
    );
};

export default LeaveManagement;
