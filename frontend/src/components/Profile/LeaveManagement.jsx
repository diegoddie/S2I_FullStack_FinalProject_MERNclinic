import React, { useEffect, useState } from 'react';
import { useAuthContext } from '../../hooks/auth/useAuthContext';
import LeaveManagementTable from '../Table/LeaveManagementTable';
import Spinner from '../Utils/Spinner';
import CreateLeaveRequest from '../Button/CreateLeaveRequestButton';
import { useManageDoctors } from '../../hooks/doctors/useManageDoctors';

const LeaveManagement = () => {
    const { getDoctors, isLoading } = useManageDoctors();
    const { user } = useAuthContext();

    const [pendingLeaveRequestsData, setPendingLeaveRequestsData] = useState([]);
    const [allLeaveRequestsData, setAllLeaveRequestsData] = useState([]);
    const [selectedTab, setSelectedTab] = useState('pendingRequests');

    const isAdmin = user.isAdmin

    const handleTabChange = (tab) => {
        setSelectedTab(tab);
    }

    const fetchAllLeaveRequests = async () => {
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

    const fetchPendingLeaveRequests = async () => {
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
        fetchPendingLeaveRequests();
        fetchAllLeaveRequests();
    }, []);

    return (
        <div className=''>
            <div className='font-semibold flex items-center mx-auto justify-center mt-3'>
                <h3 className='text-4xl leading-[30px] text-[#168aad] text-center px-3 mb-3'>
                    Leave Management
                </h3>
            </div>
            {isLoading && (
                <div className="flex items-center justify-center mx-auto py-10">
                    <Spinner />
                </div>
            )}
            {!isLoading && (
                <>
                    {!isAdmin && (
                        <>
                        <div className="pt-4 flex px-2 gap-1 md:gap-2 justify-center">                      
                            <button onClick={() => handleTabChange('pendingRequests')} className="px-3 md:px-4 py-4 md:py-5 leading-3 md:leading-4 transition-colors duration-200 transform rounded-md text-lg md:text-xl font-semibold text-white bg-[#d69347] hover:bg-[#ad783b]">Pending</button>
                            <button onClick={() => handleTabChange('allRequests')} className="px-3 md:px-4 py-4 md:py-5 leading-3 md:leading-4 transition-colors duration-200 transform rounded-md text-lg md:text-xl font-semibold text-white bg-[#168aad] hover:bg-[#12657f]">All Requests</button>
                            <CreateLeaveRequest />
                        </div>
                        </>
                    )}
                    <div className=''>
                        {isAdmin ? (
                            <LeaveManagementTable isAdmin={isAdmin} data={pendingLeaveRequestsData} title="Pending Requests"/>
                        ) : (
                            <>    
                                {selectedTab === 'pendingRequests' && (
                                    <LeaveManagementTable isAdmin={isAdmin} data={pendingLeaveRequestsData} title="Pending Requests"/>
                                )}

                                {selectedTab === 'allRequests' && (
                                    <LeaveManagementTable isAdmin={isAdmin} data={allLeaveRequestsData} title="Requests"/>
                                )}
                            </>
                        )}
                    </div>
                </>
            )}
        </div>
    );
};

export default LeaveManagement;
