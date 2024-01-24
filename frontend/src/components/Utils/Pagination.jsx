import ReactPaginate from 'react-paginate'
import { BsChevronLeft, BsChevronRight } from 'react-icons/bs'
import React from 'react'

// Pagination.jsx

const Pagination = ({ setCurrentPage, currentPage, totalPages }) => {
    const handlePageClick = ({ selected }) => {
        setCurrentPage(selected + 1);
    };

    const showNextButton = currentPage !== totalPages - 1
    const showPrevButton = currentPage !== 0

    return (
        <div>
            {totalPages > 1 && (
                <ReactPaginate
                    breakLabel={<span className='mr-4'>..</span>}
                    nextLabel={
                        showNextButton ? (<span className='w-10 h-10 flex items-center justify-center rounded-md'>
                        <BsChevronRight />
                    </span>) : null
                    }
                    onPageChange={handlePageClick}
                    pageCount={totalPages}
                    previousLabel={
                        showPrevButton ? (<span className='w-10 h-10 flex items-center justify-center rounded-md mr-4'>
                        <BsChevronLeft />
                    </span>) : null
                    }
                    containerClassName='flex items-center justify-center mt-8 mb-4'
                    pageClassName='block border border-solid border-pink hover:bg-pink-100 w-10 h-10 flex items-center justify-center rounded-md mr-4'
                    activeClassName='bg-red-200'
                />
            )}
        </div>
    );
};

export default Pagination;
