import { compareDesc, endOfMonth, format, isWithinInterval, startOfMonth } from 'date-fns';
import { it } from 'date-fns/locale';
import React, { useState, useEffect } from 'react'
import DatePicker from 'react-datepicker';
import { FaLongArrowAltDown, FaLongArrowAltUp, FaTrash } from 'react-icons/fa';
import Pagination from './Pagination';
import Spinner from './Spinner';
import { useManageVisits } from '../../hooks/visits/useManageVisits';

const VisitsTable = ({ title, isDoctor, data }) => {
    const { deleteVisit, isLoading } = useManageVisits();

    const [sortColumn, setSortColumn] = useState('date');
    const [sortOrder, setSortOrder] = useState('desc');
    const [startDate, setStartDate] = useState(() => {
        return title === 'Next Visits' ? new Date() : startOfMonth(new Date());
    });
    const [endDate, setEndDate] = useState(() => {
        return title === 'Next Visits' ? new Date() : endOfMonth(new Date());
    });
    const [currentPage, setCurrentPage] = useState(1);
    const [filteredData, setFilteredData] = useState([]);

    const itemsPerPage = 10; 
    const totalPages = Math.ceil(filteredData.length / itemsPerPage);
    const currentItems = filteredData?.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

    const toggleSortOrder = (column) => {
        setSortColumn(column);
        setSortOrder((prevSortOrder) => (column === sortColumn ? (prevSortOrder === 'asc' ? 'desc' : 'asc') : 'desc'));
    };

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        
        const formattedDate = format(date, 'dd/MM/yyyy', { locale: it });
        const formattedTime = format(date, 'HH:mm', { locale: it });
        return `${formattedDate} ${formattedTime}`;
    };

    const sortVisitsDate = (visits) =>
        visits.sort((a, b) => {
            if (sortColumn === 'date') {
                return sortOrder === 'asc'
                ? compareDesc(new Date(a[sortColumn]), new Date(b[sortColumn]))
                : compareDesc(new Date(b[sortColumn]), new Date(a[sortColumn]));
            }
        return 0;
        });
    
    const handleFilter = () => {
        let filteredVisits = data ?? [];

        if (title === 'Next Visits') {
            const currentDate = new Date();
            filteredVisits = filteredVisits.filter((visit) => new Date(visit.date) > currentDate);
        }

        if (isDoctor || title === 'Past Visits') {
            filteredVisits = filteredVisits.filter((visit) => {
                const visitDate = new Date(visit.date);
                return isWithinInterval(visitDate, { start: startDate, end: endDate });
            });
        }
    
        setFilteredData(sortVisitsDate(filteredVisits));
    };

    const handleDeleteVisit = async (visitId) => {
        try{
            await deleteVisit(visitId)
            setFilteredData((prevFilteredData) => prevFilteredData.filter(visit => visit._id !== visitId));
        } catch(error){
            console.log(error)
        }
    };
    
    useEffect(() => {
        handleFilter();
    }, [data, startDate, endDate, sortColumn, sortOrder, currentPage]);

    return (
        <div className="flex flex-col">
            <div className="py-5 align-middle inline-block px-2 lg:px-4 items-center justify-center mx-auto">
                {isLoading && (
                    <div className="flex items-center justify-center mx-auto py-10">
                        <Spinner />
                    </div>
                )}
                <>
                    {isDoctor || title === 'Past Visits' ? (
                        <div className="flex gap-4 mt-1 mb-4 justify-center">
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
                    ) : null}
                    {filteredData.length === 0 ? (
                        <p className="text-center text-gray-700 mt-3 text-lg md:text-xl font-semibold">
                            {isDoctor
                                ? "No visits for the requested period."
                                : title === "Next Visits"
                                ? "You have no scheduled visits."
                                : "No visits for the requested period." 
                            }
                        </p>
                    ) : (
                        <>
                            <div className="shadow overflow-x-auto border-b sm:rounded-lg">
                                <table className="divide-y divide-gray-200">
                                    <thead className="bg-gray-50">
                                        <tr>
                                            <th className="cursor-pointer px-7 py-3 text-center font-medium text-gray-500 uppercase border-r" onClick={() => toggleSortOrder('date')}>
                                                <div className='flex gap-2 justify-center'>
                                                    <span>Date</span>
                                                    <span className='items-center flex text-md'>
                                                        {sortOrder === 'asc' && sortColumn === 'date' ? (
                                                            <FaLongArrowAltUp className=''/>
                                                        ) : (
                                                            <FaLongArrowAltDown />
                                                        )}
                                                    </span>
                                                </div>
                                            </th>
                                            <th className="px-7 py-3 text-center font-medium text-gray-500 uppercase border-r">
                                                Patient
                                            </th>
                                            <th className="px-7 py-3 text-center font-medium text-gray-500 uppercase border-r">
                                                Doctor
                                            </th>
                                            <th className="px-7 py-3 text-center font-medium text-gray-500 uppercase border-r">
                                                Specialization
                                            </th>
                                            <th className="px-7 py-3 text-center font-medium text-gray-500 uppercase border-r">
                                                Action
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody className="bg-white divide-y divide-gray-200">
                                        {currentItems.map((visit) => (
                                            <tr key={visit._id} className="items-center text-center">
                                                <td className="px-5 py-4 whitespace-nowrap border-r">
                                                    <div className="text-sm text-gray-900 font-medium">{formatDate(visit.date)}</div>
                                                </td>
                                                <td className="px-5 py-4 whitespace-nowrap border-r">
                                                    <div className="flex items-center">
                                                        <div className="text-sm font-medium text-gray-900">
                                                            {visit.user.firstName} {visit.user.lastName}
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-5 py-4 whitespace-nowrap border-r">
                                                    <div className="flex items-center">
                                                        <div className="text-sm font-medium text-gray-900">
                                                            {visit.doctor.firstName} {visit.doctor.lastName}
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-5 py-4 whitespace-nowrap border-r">
                                                    <div className="text-sm text-gray-900">{visit.doctor.specialization}</div>
                                                </td>

                                                <td className="px-5 py-4 whitespace-nowrap border-r">
                                                    {title === 'Next Visits' && (
                                                        <div className='flex mx-auto justify-center'>
                                                            <FaTrash className='cursor-pointer text-xl text-red-700 hover:text-red-800' onClick={() => handleDeleteVisit(visit._id)} />
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
                </>
            </div>
        </div>
    )
}

export default VisitsTable