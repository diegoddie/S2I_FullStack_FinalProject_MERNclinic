import React, { useState } from 'react';
import { format, parseISO } from 'date-fns';
import { it, enUS } from 'date-fns/locale';
import Pagination from '../Utils/Pagination';
import BookVisitButton from '../Button/BookVisitButton';

const VisitTimeSlot = ({ data, doctor }) => {
    const [currentPage, setCurrentPage] = useState(1);

    const itemsPerPage = 16;
    const totalPages = Math.ceil(data.length / itemsPerPage);
    const currentItems = data.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);
    
    const getAbbreviatedDay = (date) => {
        return format(date, 'EEE', { locale: enUS });
    };
      
    const getFormattedDateTime = (date) => {
        console.log(date)
        const formattedDate = format(date, "dd/MM/yyyy", { locale: enUS });
        const formattedTime = format(date, "HH:mm");
        console.log(formattedTime)
        return { formattedDate, formattedTime };
    };

    return (
        <>
            <ul className='flex flex-wrap gap-8 justify-center'>
                {currentItems.map((timeSlot, index) => {
                    console.log(timeSlot)
                    const dateObj = new Date(timeSlot);
                    console.log(dateObj)
                    const dayOfWeek = getAbbreviatedDay(dateObj);
                    const { formattedDate, formattedTime } = getFormattedDateTime(dateObj);
                    
                    return (
                        <li key={index} className='gap-5 items-center bg-white py-5 px-4 w-[250px]'>
                            <div className='flex flex-col md:flex-row justify-center md:mb-3'>
                                <p className='text-xl leading-6 text-gray-500 font-semibold mx-auto mb-2 md:mb-0 uppercase'>
                                    {dayOfWeek}
                                </p>
                                <p className='text-xl leading-6 text-gray-500 font-semibold mx-auto mb-2 md:mb-0'>
                                    {formattedDate}
                                </p>
                            </div>
                            <div className='flex flex-col  '>
                                <p className='text-2xl leading-6 text-gray-700 font-semibold mx-auto mb-3'>
                                    {formattedTime}
                                </p>
                                <BookVisitButton formattedDate={formattedDate} formattedTime={formattedTime} doctor={doctor} visitDate={timeSlot} />
                            </div>
                        </li>
                    );
                })}  
            </ul>
            <Pagination totalPages={totalPages} currentPage={currentPage} setCurrentPage={setCurrentPage} />
        </>
    );
};

export default VisitTimeSlot;
