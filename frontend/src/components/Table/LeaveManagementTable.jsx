import React, { useState, useEffect } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { format, compareDesc, startOfMonth, endOfMonth, isWithinInterval } from 'date-fns';
import { it } from 'date-fns/locale';
import { FaLongArrowAltUp, FaLongArrowAltDown, FaTrash } from "react-icons/fa";
import { useManageLeaveRequests } from '../../hooks/doctors/useManageLeaveRequests';
import Spinner from '../Utils/Spinner';
import Pagination from '../Utils/Pagination';
import DeleteConfirmationModal from '../Modal/DeleteConfirmationModal';

const LeaveManagementTable = ({ title, data, isAdmin }) => {
  const { approveLeaveRequest, declineLeaveRequest, deleteLeaveRequest, isLoading } = useManageLeaveRequests();

  const [isModalOpen, setIsModalOpen] = useState(false);
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

  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
      setIsModalOpen(false);
  };

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

  const formatDate = (dateString, typology) => {
    const date = new Date(dateString);
      
    if (typology === 'vacation') {
      return format(date, 'dd/MM/yyyy', { locale: it });
    } else {
      const formattedDate = format(date, 'dd/MM/yyyy', { locale: it });
      const formattedTime = format(date, 'HH:mm', { locale: it });
      return `${formattedDate} ${formattedTime}`;
    }
  };

  const handleFilter = () => {
    const filteredData = title !== 'Pending Requests'
      ? data.filter((leaveRequest) => {
          const leaveStartDate = new Date(leaveRequest.startDate);
          const leaveEndDate = new Date(leaveRequest.endDate);
    
          return isWithinInterval(leaveStartDate, { start: startDate, end: endDate }) ||
                isWithinInterval(leaveEndDate, { start: startDate, end: endDate }) ||
                isWithinInterval(startDate, { start: leaveStartDate, end: leaveEndDate });
        })
      : data;
    
    setFilteredData(sortLeaveRequests(filteredData));
  };

  const handleApproveLeaveRequest = async (doctorId, requestId) => {
    try {
      await approveLeaveRequest(doctorId, requestId);

      setFilteredData((prevData) => prevData.filter((request) => request._id !== requestId));
    } catch (error) {
      console.error("Error approving leave request:", error);
    }
  };

  const handleDeclineLeaveRequest = async (doctorId, requestId) => {
    try {
      await declineLeaveRequest(doctorId, requestId);

      setFilteredData((prevData) => prevData.filter((request) => request._id !== requestId));
    } catch (error) {
      console.error("Error declining leave request:", error);
    }
  };

  const handleDeleteLeaveRequest = async (doctorId, requestId) => {
    try {
      await deleteLeaveRequest(doctorId, requestId);

      setFilteredData((prevData) => prevData.filter((request) => request._id !== requestId));
      handleCloseModal()
    } catch (error) {
      console.error("Error deleting leave request:", error);
    }
  };

  useEffect(() => {
    handleFilter();
  }, [data, startDate, endDate, sortColumn, sortOrder, currentPage]);

  return (
    <div className="flex flex-col">
      <div className="mt-1 py-4 max-w-full align-middle inline-block px-2 lg:px-4 items-center justify-center mx-auto ">
        {isLoading && (
          <div className="flex items-center justify-center mx-auto py-10">
            <Spinner />
          </div>
        )}
        <>
          {showDatePicker && (
              <div className="flex gap-1 my-4 justify-center px-8">
                <DatePicker
                  selected={startDate}
                  onChange={(date) => setStartDate(date)}
                  selectsStart
                  startDate={startDate}
                  endDate={endDate}
                  dateFormat="dd/MM/yyyy"
                  className="p-2 border border-gray-300 rounded bg-white text-gray-900 placeholder-gray-500 outline-none focus:ring-2 focus:ring-secondary"
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
                  className="p-2 border border-gray-300 rounded bg-white text-gray-900 placeholder-gray-500 outline-none focus:ring-2 focus:ring-secondary"
                  placeholderText="End Date"
                />
              </div>
            )}
            <p className="text-center text-gray-700 mt-2 text-lg md:text-xl font-semibold">
              {filteredData.length === 0
                ? title === 'Pending Requests'
                  ? 'There are no Pending Requests'
                  : 'There are no requests for the selected period'
                : null}
            </p>
          </>
          {filteredData.length > 0 && (
            <>
              <div className="shadow border-b sm:rounded-lg overflow-x-auto">
                <table className="divide-y divide-gray-200">
                  <thead className="bg-secondary text-white">
                    <tr className='text-center text-lg'>
                      <th className="px-5 py-3 border-r font-medium">
                        Doctor
                      </th>
                      <th className="px-5 py-3 border-r font-medium">
                        Type
                      </th>
                      <th className="cursor-pointer font-medium px-5 py-3 border-r" onClick={() => toggleSortOrder('createdAt')}>
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
                      <th className="cursor-pointer font-medium px-5 py-3 border-r" onClick={() => toggleSortOrder('startDate')}>
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
                      <th className="px-5 py-3 border-r font-medium">
                        To
                      </th>
                      <th className="px-5 py-3 border-r font-medium">
                        Status
                      </th>
                      <th className="px-5 py-3 border-r font-medium">
                        Action
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {currentItems.map((leaveRequest) => (
                      <tr key={leaveRequest._id} className="items-center text-center">
                        <td className="px-5 py-4 whitespace-nowrap border-r">
                          <div className="flex items-center">
                            <div className="font-medium text-gray-900">
                              {leaveRequest.firstName} {leaveRequest.lastName}
                            </div>
                          </div>
                        </td>
                        <td className="px-5 py-4 whitespace-nowrap border-r">
                          <span className={`px-3 py-1 inline-flex text-md leading-2 font-semibold capitalize rounded-full ${leaveRequest.typology.toLowerCase() === 'vacation' ? 'bg-purple-200 text-purple-800' : 'bg-blue-200 text-blue-900'}`}>
                            {leaveRequest.typology}
                          </span>
                        </td>
                        <td className="px-5 py-4 whitespace-nowrap border-r">
                          <div className="text-gray-500">{formatDate(leaveRequest.createdAt)}</div>
                        </td>
                        <td className="px-5 py-4 whitespace-nowrap text-gray-900 border-r">
                          {formatDate(leaveRequest.startDate, leaveRequest.typology.toLowerCase())}
                        </td>
                        <td className="px-5 py-4 whitespace-nowrap text-gray-900 border-r">
                          {formatDate(leaveRequest.endDate, leaveRequest.typology.toLowerCase())}
                        </td>
                        <td className="px-5 py-4 whitespace-nowrap border-r">
                        <span className={`px-3 py-1 inline-flex text-md leading-2 font-semibold rounded-full ${leaveRequest.isApproved === null ? "bg-yellow-200 text-orange-700" : leaveRequest.isApproved ? "bg-green-200 text-green-900" : "bg-red-200 text-red-800" }`}>
                          {leaveRequest.isApproved === null ? "Pending" : leaveRequest.isApproved ? "Approved" : "Declined"}
                        </span>
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap border-r">
                          {isAdmin ? (
                            <div className='flex gap-2'>
                              <button className='px-3 py-1 inline-flex text-md leading-2 font-semibold rounded-full bg-green-200 text-green-900 hover:bg-green-400 duration-300' onClick={() => handleApproveLeaveRequest(leaveRequest.doctorId, leaveRequest._id)}>Approve</button>
                              <button className='px-3 py-1 inline-flex text-md leading-2 font-semibold rounded-full bg-red-200 text-red-800 hover:bg-red-400 duration-300' onClick={() => handleDeclineLeaveRequest(leaveRequest.doctorId, leaveRequest._id)}>Decline</button>
                            </div>
                          ) : (
                            <div className='flex mx-auto justify-center'>
                              <FaTrash
                                onClick={handleOpenModal}
                                className='cursor-pointer text-xl text-red-700 hover:text-red-800'
                              />
                              {isModalOpen && (
                                <DeleteConfirmationModal onDelete={() => handleDeleteLeaveRequest(leaveRequest.doctorId, leaveRequest._id)} onClose={handleCloseModal} passwordConfirmation={false}/>
                              )}
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
