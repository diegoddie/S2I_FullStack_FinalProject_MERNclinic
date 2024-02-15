import React, { useEffect, useState } from 'react'
import { compareDesc, format } from 'date-fns';
import { it } from 'date-fns/locale';
import Spinner from '../Utils/Spinner';
import { CiSearch } from 'react-icons/ci';
import { FaLongArrowAltDown, FaLongArrowAltUp, FaCashRegister } from 'react-icons/fa';
import RegisterPaymentModal from '../Modal/RegisterPaymentModal';
import Pagination from '../Utils/Pagination';

const RegisterPaymentsTable = ({ data }) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [sortColumn, setSortColumn] = useState('date');
    const [sortOrder, setSortOrder] = useState('desc');
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

    const handleUpdateFilteredData = (updatedVisitId) => {
        setFilteredData((prevFilteredData) => prevFilteredData.filter(visit => visit._id !== updatedVisitId));
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
            const { user, doctor } = visit;
            const patientFullName = user ? `${user.firstName} ${user.lastName}`.toLowerCase() : 'N/A';
            const doctorFullName = doctor ? `${doctor.firstName} ${doctor.lastName}`.toLowerCase() : 'N/A';
                
            return (patientFullName.includes(patientNameFilter.toLowerCase()) && doctorFullName.includes(doctorNameFilter.toLowerCase()));
        })
        setFilteredData(sortVisitsDate(filteredVisits));
    }

    useEffect(() => {
        handleFilter();
    }, [data, patientNameFilter, doctorNameFilter, sortColumn, sortOrder, currentPage]);

    return (
        <div className="flex flex-col">
            <div className="mt-2 py-5 max-w-full xl:max-w-full lg:max-w-[740px] md:max-w-[490px] align-middle inline-block px-2 lg:px-4 items-center justify-center mx-auto">
                <div className="flex flex-col md:flex-row gap-2 md:gap-4 mb-4 justify-center px-2 mx-auto items-center">
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
                </div>
                {filteredData.length === 0 ? (
                    <p className="text-center text-gray-700 mt-3 text-lg md:text-xl font-semibold">
                        No payments to register
                    </p>
                ) : (
                    <>
                        <div className="shadow border-b rounded-lg overflow-x-auto justify-center items-center mx-auto">
                            <table className="divide-y divide-gray-200">
                                <thead className="bg-secondary text-white">
                                    <tr className='text-center text-lg'>
                                        <th className="px-7 py-3 font-medium border-r">
                                            Visit ID
                                        </th>
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
                                            Action
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="bg-gray-50 divide-y divide-gray-200">
                                    {currentItems.map((visit) => (
                                        <tr key={visit._id} className="items-center text-center">
                                            <td className="px-5 py-4 whitespace-nowrap border-r">
                                                <div className="text-gray-900">{visit._id}</div>
                                            </td>
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
                                            <td className="px-5 py-4 border-r">
                                                <div className='flex mx-auto justify-center'>
                                                    <FaCashRegister
                                                        onClick={handleOpenModal}
                                                        className='cursor-pointer text-xl text-green-600 hover:text-green-800'
                                                    />
                                                    {isModalOpen && (
                                                        <RegisterPaymentModal onClose={handleCloseModal} id={visit._id} updateFilteredData={handleUpdateFilteredData}/>
                                                    )}
                                                </div>
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
    )
}

export default RegisterPaymentsTable