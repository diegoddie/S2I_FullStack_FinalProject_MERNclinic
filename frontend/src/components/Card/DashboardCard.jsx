import React from 'react';

const DashboardCard = ({ icon, title, content, cardBg, hoverBg }) => {
  return (
    <div className={`w-full md:w-fit rounded-xl border border-gray-400 p-3 mb-4 flex items-center ${hoverBg} duration-150 ${cardBg}`}>
        <div className='rounded-full h-20 w-20 md:h-24 md:w-24 flex items-center justify-center text-4xl md:text-5xl text-white'>
            {icon}
        </div>
        <div className='pl-2'>
            <span className='text-lg text-gray-800 font-semibold'>{title}</span>
            <div className='flex items-center mt-1'>
                <h3 className="text-4xl md:text-5xl font-bold">{content}</h3>
            </div>
        </div>
    </div>
  );
};

export default DashboardCard;
