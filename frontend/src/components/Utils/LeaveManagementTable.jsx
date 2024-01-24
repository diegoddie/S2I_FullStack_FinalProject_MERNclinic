import React, { useState, useEffect } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { format, compareDesc, startOfMonth, endOfMonth } from 'date-fns';
import { it } from 'date-fns/locale';
import { FaLongArrowAltUp, FaLongArrowAltDown, FaTrash } from "react-icons/fa";
import { useManageLeaveRequests } from '../../hooks/doctors/useManageLeaveRequests';
import Alert from './Alert';
import Spinner from './Spinner';
import Pagination from './Pagination';

const LeaveManagementTable = ({ title, data, isAdmin }) => {
  const { approveLeaveRequest, declineLeaveRequest, deleteLeaveRequest, isLoading, error } = useManageLeaveRequests();

  const [sortColumn, setSortColumn] = useState('createdAt');
  const [sortOrder, setSortOrder] = useState('desc');
  const [startDate, setStartDate] = useState(startOfMonth(new Date()));
  const [endDate, setEndDate] = useState(endOfMonth(new Date()));
  const [currentPage, setCurrentPage] = useState(1);
  const [filteredData, setFilteredData] = useState([]);

  const showDatePicker = title !== 'Pending Requests' 
  const itemsPerPage = 10; 
  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const currentItems = filteredData?.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const toggleSortOrder = (column) => {
    setSortColumn(column);
    setSortOrder((prevSortOrder) => (column === sortColumn ? (prevSortOrder === 'asc' ? 'desc' : 'asc') : 'desc'));
  };

  const sortLeaveRequests = (leaveRequests) =>
    leaveRequests.sort((a, b) => {
      if (sortColumn === 'createdAt' || sortColumn === 'startDate') {
        return sortOrder === 'asc'
          ? compareDesc(new Date(a[sortColumn]), new Date(b[sortColumn]))
          : compareDesc(new Date(b[sortColumn]), new Date(a[sortColumn]));
      }
      return 0;
    });

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const formattedDate = format(date, 'dd/MM/yyyy', { locale: it });
    const formattedTime = format(date, 'HH:mm', { locale: it });
    return `${formattedDate} ${formattedTime}`;
  };

  const handleFilter = () => {
    const filteredData = title !== 'Pending Requests'
      ? data.filter((leaveRequest) => {
          const leaveStartDate = new Date(leaveRequest.startDate);
          const leaveEndDate = new Date(leaveRequest.endDate);
          return leaveStartDate >= startDate && leaveEndDate <= endDate;
        })
      : data;

    setFilteredData(sortLeaveRequests(filteredData));
  };

  useEffect(() => {
    handleFilter();
  }, [data, startDate, endDate, sortColumn, sortOrder, currentPage]);

  return (
    <div className="flex flex-col">
      <div className="py-5 align-middle inline-block px-2 lg:px-4 items-center justify-center mx-auto">
        {error.length > 0 && (
          <div className="w-full max-w-[570px]">
            {error.map((error, index) => (
              <Alert key={index} type="error" message={error} />
            ))}
          </div>
        )}
        {isLoading && (
          <div className="flex items-center justify-center mx-auto py-10">
            <Spinner />
          </div>
        )}
        <>
          {showDatePicker && (
              <div className="flex gap-4 my-4 justify-center">
                <DatePicker
                  selected={startDate}
                  onChange={(date) => setStartDate(date)}
                  selectsStart
                  startDate={startDate}
                  endDate={endDate}
                  dateFormat="dd/MM/yyyy"
                  className="p-2 border border-gray-300 rounded"
                  placeholderText="Start Date"
                />
                <DatePicker
                  selected={endDate}
                  onChange={(date) => setEndDate(date)}
                  selectsEnd
                  startDate={startDate}
                  endDate={endDate}
                  minDate={startDate}
                  dateFormat="dd/MM/yyyy"
                  className="p-2 border border-gray-300 rounded"
                  placeholderText="End Date"
                />
              </div>
            )}
            <p className="text-center text-gray-700 mt-2 text-lg md:text-xl font-semibold">
              {filteredData.length === 0
                ? title === 'Pending Requests'
                  ? 'There are no Pending Requests'
                  : 'No requests for the selected period'
                : null}
            </p>
          </>
          {filteredData.length > 0 && (
            <>
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
                    <th className="cursor-pointer px-5 py-3 text-center font-medium text-gray-500 uppercase border-r" onClick={() => toggleSortOrder('createdAt')}>
                      <div className='flex gap-2 justify-center'>
                        <span>Created At</span>
                        <span className='items-center flex text-md'>
                          {sortOrder === 'asc' && sortColumn === 'createdAt' ? (
                            <FaLongArrowAltUp className=''/>
                          ) : (
                            <FaLongArrowAltDown />
                          )}
                        </span>
                      </div>
                    </th>
                    <th className="cursor-pointer px-5 py-3 text-center font-medium text-gray-500 uppercase border-r" onClick={() => toggleSortOrder('startDate')}>
                      <div className='flex gap-2 justify-center'>
                        <span>From</span>
                        <span className='items-center flex text-md'>
                          {sortOrder === 'asc' && sortColumn === 'startDate' ? (
                            <FaLongArrowAltUp className=''/>
                          ) : (
                            <FaLongArrowAltDown />
                          )}
                        </span>
                      </div>
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
                  {currentItems.map((leaveRequest) => (
                    <tr key={leaveRequest._id} className="items-center text-center">
                      <td className="px-5 py-4 whitespace-nowrap border-r">
                        <div className="flex items-center">
                          <div className="text-sm font-medium text-gray-900">
                            {leaveRequest.firstName} {leaveRequest.lastName}
                          </div>
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
                      <span className={`px-3 py-1 inline-flex text-md leading-2 font-semibold rounded-full ${leaveRequest.isApproved === null ? "bg-yellow-300" : leaveRequest.isApproved ? "bg-green-500" : "bg-red-500" }`}>
                        {leaveRequest.isApproved === null ? "Pending" : leaveRequest.isApproved ? "Approved" : "Declined"}
                      </span>
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap border-r">
                        {isAdmin ? (
                          <div className='flex gap-2'>
                            <button className='px-3 py-1 inline-flex text-md leading-2 font-semibold rounded-full bg-green-300 hover:bg-green-500 duration-300' onClick={() => approveLeaveRequest(leaveRequest.doctorId, leaveRequest._id)}>Approve</button>
                            <button className='px-3 py-1 inline-flex text-md leading-2 font-semibold rounded-full bg-red-300 hover:bg-red-500 duration-300' onClick={() => declineLeaveRequest(leaveRequest.doctorId, leaveRequest._id)}>Decline</button>
                          </div>
                        ) : (
                          <div className='flex mx-auto justify-center'>
                            <FaTrash className='cursor-pointer text-xl text-red-700 hover:text-red-800' onClick={() => deleteLeaveRequest(leaveRequest.doctorId, leaveRequest._id)} />
                          </div>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <Pagination totalPages={totalPages} currentPage={currentPage} setCurrentPage={setCurrentPage} />
            </>
          )}
      </div>
    </div>
  );
};

export default LeaveManagementTable;
