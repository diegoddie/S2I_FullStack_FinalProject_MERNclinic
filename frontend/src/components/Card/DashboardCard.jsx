import React from 'react';

const DashboardCard = ({ icon, title, content, iconBg, hoverBg }) => {
  return (
    <div className={`bg-white w-full md:w-fit rounded-xl border border-gray-400 p-5 mb-4 flex items-center ${hoverBg} duration-150`}>
        <div className={`rounded-full h-20 w-20 md:h-24 md:w-24 flex items-center justify-center text-4xl md:text-5xl text-white bg-${iconBg}`}>
            {icon}
        </div>
        <div className='pl-5'>
            <span className='text-xl text-gray-500'>{title}</span>
            <div className='flex items-center mt-1'>
                <h3 className="text-4xl md:text-6xl font-bold">{content}</h3>
            </div>
        </div>
    </div>
  );
};

export default DashboardCard;
