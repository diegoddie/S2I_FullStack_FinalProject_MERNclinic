import React, { useEffect, useState } from 'react';
import { useGetDoctors } from '../../hooks/doctors/useGetDoctors';
import Alert from '../Utils/Alert';
import Spinner from '../Utils/Spinner';
import Table from '../Utils/Table';
import axios from 'axios';

const PendingLeaveRequests = () => {
    const { getDoctors, error, loading } = useGetDoctors();
    const [doctors, setDoctors] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const doctorsData = await getDoctors();
                setDoctors(doctorsData);
            } catch (error) {
                console.log(error);
            }
        };

        fetchData();
    }, []);

    const approveLeaveRequest = async(doctorId, leaveRequestId) => {
        try{
            const res = await axios.put(`http://localhost:3000/doctor/${doctorId}/approve/${leaveRequestId}`, {}, { withCredentials: true });

            if(res.status === 200){
                window.location.reload();
            }
        }catch(error){
            console.error('Error approving leave request:', error);
        }
    }

    return (
        <div className=''>
            {error.length > 0 && (
                <div className='w-full max-w-[570px]'>
                    {error.map((error, index) => (
                        <Alert key={index} type='error' message={error} />
                    ))}
                </div>
            )}
            {loading && (
                <div className='flex items-center justify-center mx-auto py-10'>
                    <Spinner />
                </div>
            )}
            {!loading && (
                <>
                    <p className="text-center text-gray-700 mt-2 text-lg md:text-xl font-semibold">Pending Leaves Requests</p>
                    <Table doctorsData={doctors} approveLeaveRequest={approveLeaveRequest}/>
                </>
            )}
        </div>
    );
};

export default PendingLeaveRequests;
