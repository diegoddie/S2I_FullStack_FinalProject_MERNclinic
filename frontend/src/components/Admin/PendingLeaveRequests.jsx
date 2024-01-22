import React, { useEffect, useState } from 'react';
import { useGetDoctors } from '../../hooks/doctors/useGetDoctors';
import Alert from '../Utils/Alert';
import Spinner from '../Utils/Spinner';
import Table from '../Utils/Table';

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
                    <Table doctorsData={doctors} />
                </>
            )}
        </div>
    );
};

export default PendingLeaveRequests;
