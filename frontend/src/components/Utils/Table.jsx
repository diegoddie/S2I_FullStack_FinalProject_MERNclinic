import React, { useState } from 'react';
import { format, compareDesc } from 'date-fns';
import { it } from 'date-fns/locale';
import { FaLongArrowAltUp, FaLongArrowAltDown } from "react-icons/fa";

const Table = ({ doctorsData, approveLeaveRequest }) => {
    const [sortOrder, setSortOrder] = useState('desc');

    const toggleSortOrder = () => {
        setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    };

    const sortLeaveRequests = (doctor) => {
        return doctor.leaveRequests
          .filter((leaveRequest) => leaveRequest.isApproved === null)
          .sort((a, b) =>
            sortOrder === 'asc'
              ? compareDesc(new Date(a.createdAt), new Date(b.createdAt))
              : compareDesc(new Date(b.createdAt), new Date(a.createdAt))
        );
    };

    const formatDate = (dateString) => {
        const date = new Date(dateString);

        const formattedDate = format(date, 'dd/MM/yyyy', { locale: it });
        const formattedTime = format(date, 'HH:mm', { locale: it });

        return `${formattedDate} ${formattedTime}`;
    };

    return (
        <div className="flex flex-col">
            <div className="py-5 align-middle inline-block px-2 lg:px-4 items-center justify-center mx-auto">
                <div className="shadow overflow-x-auto border-b sm:rounded-lg">
                    <table className="divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="cursor-pointer px-5 py-3 text-center font-medium text-gray-500 uppercase border-r">
                                    Doctor
                                </th>
                                <th className="px-5 py-3 text-center font-medium text-gray-500 uppercase border-r">
                                    Type
                                </th>
                                <th className="cursor-pointer px-5 py-3 text-center font-medium text-gray-500 uppercase border-r" onClick={toggleSortOrder}>
                                    <div className='flex gap-2'>
                                        <span>Created At</span>
                                        <span className='items-center flex text-md'>
                                            {sortOrder === 'asc' ? (
                                                <FaLongArrowAltUp className=''/>
                                            ) : (
                                                <FaLongArrowAltDown />
                                            )}
                                        </span>
                                    </div>
                                </th>
                                <th className="px-5 py-3 text-center font-medium text-gray-500 uppercase border-r">
                                    From
                                </th>
                                <th className="px-5 py-3 text-center font-medium text-gray-500 uppercase border-r">
                                    To
                                </th>
                                <th className="px-5 py-3 text-center font-medium text-gray-500 uppercase border-r">
                                    Status
                                </th>
                                <th className="px-5 py-3 text-center font-medium text-gray-500 uppercase border-r">
                                    Action
                                </th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {doctorsData.length === 0 || doctorsData.every((doctor) =>
                                doctor.leaveRequests.every(
                                    (leaveRequest) => leaveRequest.isApproved !== null
                                )
                            ) ? (
                                <tr>
                                    <td
                                        className="px-5 py-4 whitespace-nowrap text-center text-gray-500"
                                    >
                                        No new leave requests.
                                    </td>
                                </tr>
                            ) : (
                                doctorsData.map((doctor) => (
                                    <React.Fragment key={doctor.id}>
                                        {sortLeaveRequests(doctor).map((leaveRequest) => (
                                            <tr key={leaveRequest._id} className="items-center text-center">
                                                <td className="px-5 py-4 whitespace-nowrap border-r">
                                                    <div className="flex items-center ">
                                                        <div className="text-sm font-medium text-gray-900">{doctor.firstName} {doctor.lastName}</div>
                                                    </div>
                                                </td>
                                                <td className="px-5 py-4 whitespace-nowrap border-r">
                                                    <span className={`px-3 py-1 inline-flex text-md leading-2 font-semibold capitalize rounded-full ${leaveRequest.typology.toLowerCase() === 'vacation' ? 'bg-purple-300' : 'bg-blue-300 '}`}>
                                                        {leaveRequest.typology}
                                                    </span>
                                                </td>
                                                <td className="px-5 py-4 whitespace-nowrap border-r">
                                                    <div className="text-sm text-gray-900">{formatDate(leaveRequest.createdAt)}</div>
                                                </td>
                                                <td className="px-5 py-4 whitespace-nowrap text-sm text-gray-500 border-r">
                                                    {formatDate(leaveRequest.startDate)}
                                                </td>
                                                <td className="px-5 py-4 whitespace-nowrap text-sm text-gray-500 border-r">
                                                    {formatDate(leaveRequest.endDate)}
                                                </td>
                                                <td className="px-5 py-4 whitespace-nowrap border-r">
                                                    <span className="px-3 py-1 inline-flex text-md leading-2 font-semibold rounded-full bg-yellow-300">
                                                        Pending
                                                    </span>
                                                </td>
                                                <td className="px-4 py-4 whitespace-nowrap border-r">
                                                    <div className='flex gap-2'>
                                                        <button className='px-3 py-1 inline-flex text-md leading-2 font-semibold rounded-full bg-green-300 hover:bg-green-500 duration-300' onClick={() => approveLeaveRequest(doctor._id, leaveRequest._id)}>Approve</button>
                                                        <button className='px-3 py-1 inline-flex text-md leading-2 font-semibold rounded-full bg-red-300 hover:bg-red-500 duration-300'>Decline</button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </React.Fragment>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default Table;
