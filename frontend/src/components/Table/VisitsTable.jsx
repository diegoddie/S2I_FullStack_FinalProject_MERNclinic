import { compareDesc, format, isWithinInterval, startOfMonth, subDays, subMonths } from 'date-fns';
import { it } from 'date-fns/locale';
import { CiSearch } from "react-icons/ci";
import React, { useState, useEffect } from 'react'
import DatePicker from 'react-datepicker';
import { FaLongArrowAltDown, FaLongArrowAltUp, FaTrash } from 'react-icons/fa';
import { FaFilePdf } from "react-icons/fa6";
import Pagination from '../Utils/Pagination';
import Spinner from '../Utils/Spinner';
import { useManageVisits } from '../../hooks/visits/useManageVisits';
import DeleteConfirmationModal from '../Modal/DeleteConfirmationModal';
import errorHandler from '../../hooks/utils/errorHandler';

const VisitsTable = ({ title, isDoctor, isAdmin, data }) => {
    const { deleteVisit, isLoading } = useManageVisits();

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [sortColumn, setSortColumn] = useState('date');
    const [sortOrder, setSortOrder] = useState('desc');
    const [startDate, setStartDate] = useState(() => {
        return title === 'Next Visits' ? new Date() : startOfMonth(subMonths(new Date(), 1));
    });
    const [endDate, setEndDate] = useState(() => {
        return title === 'Next Visits' ? startDate : subDays(new Date(), 1);
    });
    const [currentPage, setCurrentPage] = useState(1);
    const [patientNameFilter, setPatientNameFilter] = useState('');
    const [doctorNameFilter, setDoctorNameFilter] = useState('');
    const [filteredData, setFilteredData] = useState([]);

    const itemsPerPage = 10; 
    const totalPages = Math.ceil(filteredData.length / itemsPerPage);
    const currentItems = filteredData?.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

    const handleOpenModal = () => {
        setIsModalOpen(true);
    };
  
    const handleCloseModal = () => {
        setIsModalOpen(false);
    };

    const handleDownloadPdf = (pdfUrl) => {
        window.open(pdfUrl, '_blank');
    };

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
        
        filteredVisits = filteredVisits.filter((visit) => {
            const visitDate = new Date(visit.date);
            return isWithinInterval(visitDate, { start: startDate, end: endDate });
        });
            
        filteredVisits = filteredVisits.filter((visit) => {
            const { user, doctor } = visit;
            const patientFullName = user ? `${user.firstName} ${user.lastName}`.toLowerCase() : 'N/A';
            const doctorFullName = doctor ? `${doctor.firstName} ${doctor.lastName}`.toLowerCase() : 'N/A';
            
            if (isAdmin) {
                return (
                    patientFullName.includes(patientNameFilter.toLowerCase()) &&
                    doctorFullName.includes(doctorNameFilter.toLowerCase())
                );
            } else if (isDoctor) {
                return (
                    patientFullName.includes(patientNameFilter.toLowerCase())
                );
            } else {
                return (
                    doctorFullName.includes(doctorNameFilter.toLowerCase())
                );
            }
        });
        
        setFilteredData(sortVisitsDate(filteredVisits));
    };

    const handleDeleteVisit = async (visitId) => {
        try{
            await deleteVisit(visitId)
            setFilteredData((prevFilteredData) => prevFilteredData.filter(visit => visit._id !== visitId));
        } catch(error){
            console.log(error)
            errorHandler(error)
        }
    };

    const handleStartDateChange = (date) => {
        date.setHours(0, 0, 0, 0);
        setStartDate(date);

        if (endDate.getTime() === startDate.getTime()) {
            handleEndDateChange(new Date(date));
        }
    };

    const handleEndDateChange = (date) => {
        date.setHours(23, 59, 59, 999);
        setEndDate(date);
    };
    
    useEffect(() => {
        handleFilter();
    }, [data, startDate, endDate, patientNameFilter, doctorNameFilter, sortColumn, sortOrder, currentPage]);

    return (
        <div className="flex flex-col">
            <div className="mt-2 py-5 max-w-full align-middle inline-block px-2 lg:px-4 items-center justify-center mx-auto ">
                {isLoading && (
                    <div className="flex items-center justify-center mx-auto py-10">
                        <Spinner />
                    </div>
                )}
                {!isLoading && (
                    <>
                        <div className="flex flex-col md:flex-row gap-4 mt-1 mb-4 justify-center mx-8">
                            {isAdmin && (
                                <>
                                    <div className="flex flex-row p-2 border border-gray-300 rounded bg-gray-50">
                                        <div className="flex items-center pointer-events-none mr-1">
                                            <CiSearch className="text-gray-800 font-bold text-md" />
                                        </div>
                                        <input
                                            type="text"
                                            placeholder="Search Patient"
                                            value={patientNameFilter}
                                            onChange={(e) => setPatientNameFilter(e.target.value)}
                                            className="bg-transparent outline-none"
                                        />
                                    </div>
                                    <div className="flex flex-row p-2 border border-gray-300 rounded bg-gray-50">
                                        <div className="flex items-center pointer-events-none mr-1">
                                            <CiSearch className="text-gray-800 font-bold text-md" />
                                        </div>
                                        <input
                                            type="text"
                                            placeholder="Search Doctor"
                                            value={doctorNameFilter}
                                            onChange={(e) => setDoctorNameFilter(e.target.value)}
                                            className="bg-transparent outline-none"
                                        />
                                    </div>       
                                </>
                            )}
                            {isDoctor && (
                                <div className="flex flex-row p-2 border border-gray-300 rounded bg-gray-50 mx-10 md:mx-0">
                                    <div className="flex items-center pointer-events-none mr-1">
                                        <CiSearch className="text-gray-800 font-bold text-md" />
                                    </div>
                                    <input
                                        type="text"
                                        placeholder="Search Patient"
                                        value={patientNameFilter}
                                        onChange={(e) => setPatientNameFilter(e.target.value)}
                                        className="bg-transparent outline-none"
                                    />
                                </div>
                            )}
                            {!isAdmin && !isDoctor && (
                                <div className="flex flex-row p-2 border border-gray-300 rounded bg-gray-50 ">
                                    <div className="flex items-center pointer-events-none mr-1">
                                        <CiSearch className="text-gray-800 font-bold text-md" />
                                    </div>
                                    <input
                                        type="text"
                                        placeholder="Search Doctor"
                                        value={doctorNameFilter}
                                        onChange={(e) => setDoctorNameFilter(e.target.value)}
                                        className="bg-transparent outline-none"
                                    />
                                </div>
                            )}
                            <div className='flex flex-row gap-1 justify-center px-2 md:px-0'>
                                <DatePicker
                                    selected={startDate}
                                    onChange={handleStartDateChange}
                                    selectsStart
                                    startDate={startDate}
                                    endDate={endDate}
                                    dateFormat="dd/MM/yyyy"
                                    className="p-2 border border-gray-300 rounded bg-white text-gray-900 placeholder-gray-500 outline-none focus:ring-2 focus:ring-secondary"
                                    placeholderText="Start Date"
                                />
                                <DatePicker
                                    selected={endDate}
                                    onChange={handleEndDateChange}
                                    selectsEnd
                                    startDate={startDate}
                                    endDate={endDate}
                                    minDate={startDate}
                                    dateFormat="dd/MM/yyyy"
                                    className="p-2 border border-gray-300 rounded bg-white text-gray-900 placeholder-gray-500 outline-none focus:ring-2 focus:ring-secondary"
                                    
                                />
                            </div>
                        </div>
                        {filteredData.length === 0 ? (
                            <p className="text-center text-gray-700 mt-3 text-lg md:text-xl font-semibold">
                                No visits found
                            </p>
                        ) : (
                            <>
                                <div className="shadow border-b sm:rounded-lg overflow-x-auto md:w-fit justify-center items-center mx-auto">
                                    <table className="divide-y divide-gray-200">
                                        <thead className="bg-secondary text-white">
                                            <tr className='text-center text-lg'>
                                                <th className="cursor-pointer px-7 py-3 font-medium border-r" onClick={() => toggleSortOrder('date')}>
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
                                                <th className="px-7 py-3 font-medium border-r">
                                                    Patient
                                                </th>
                                                <th className="px-7 py-3 font-medium border-r">
                                                    Doctor
                                                </th>
                                                <th className="px-7 py-3 font-medium border-r">
                                                    Specialization
                                                </th>
                                                <th className="px-7 py-3 font-medium border-r">
                                                    Action
                                                </th>
                                            </tr>
                                        </thead>
                                        <tbody className="bg-gray-50 divide-y divide-gray-200">
                                            {currentItems.map((visit) => (
                                                <tr key={visit._id} className="items-center text-center">
                                                    <td className="px-5 py-4 whitespace-nowrap border-r">
                                                        <div className="text-gray-900 font-medium">{formatDate(visit.date)}</div>
                                                    </td>
                                                    <td className="px-5 py-4 whitespace-nowrap border-r">
                                                        <div className="flex items-center">
                                                            <div className="font-medium text-gray-900 mx-auto">
                                                                {visit.user ? `${visit.user.firstName} ${visit.user.lastName}` : 'N/A'}
                                                            </div>
                                                        </div>
                                                    </td>
                                                    <td className="px-5 py-4 whitespace-nowrap border-r">
                                                        <div className="flex items-center">
                                                            <div className="font-medium text-gray-900 mx-auto">
                                                                {visit.doctor ? `${visit.doctor.firstName} ${visit.doctor.lastName}` : 'N/A'}
                                                            </div>
                                                        </div>
                                                    </td>
                                                    <td className="px-5 py-4 whitespace-nowrap border-r">
                                                        <div className="text-gray-900">{visit.doctor ? `${visit.doctor.specialization}` : 'N/A'}</div>
                                                    </td>
                                                    <td className="px-5 py-4 border-r">
                                                        {title === 'Next Visits' && (
                                                            <div className='flex mx-auto justify-center'>
                                                                <FaTrash
                                                                    onClick={handleOpenModal}
                                                                    className='cursor-pointer text-xl text-red-700 hover:text-red-800'
                                                                />
                                                                {isModalOpen && (
                                                                    <DeleteConfirmationModal onDelete={() => handleDeleteVisit(visit._id)} onClose={handleCloseModal} passwordConfirmation={false}/>
                                                                )}
                                                            </div>
                                                        )}
                                                        {title === 'Past Visits' && visit.invoice.invoiceFile !== '' && (
                                                            <div className='flex mx-auto justify-center'>
                                                                <FaFilePdf
                                                                    onClick={() => handleDownloadPdf(visit.invoice.invoiceFile)}
                                                                    className='cursor-pointer text-xl text-orange-500 hover:text-orange-700'
                                                                />
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
                )}
            </div>
        </div>
    )
}

export default VisitsTable