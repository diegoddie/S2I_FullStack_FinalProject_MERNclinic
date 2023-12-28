import React from 'react';

const Stats = () => {
  const statistics = [
    { value: '+220', label: 'Happy Patients' },
    { value: '+15', label: 'Professional Doctors' },
    { value: '$2M', label: 'Investment in Medical Technology' },
    { value: '+5', label: 'Years of Healthcare Excellence' },
  ];

  return (
    <section className='bg-white py-2 text-secondary mt-10 mx-10 md:w-full md:mx-0'>
      <div className='container mx-auto '>
        <div className='py-8 flex flex-col xl:flex-row gap-y-6 justify-between '>
          {statistics.map((statistic, index) => (
            <div
              key={index}
              className={`flex-1 ${
                index < statistics.length - 1 ? 'xl:border-r' : ''
              } flex flex-col items-center`}
            >
              <div className='text-4xl xl:text-5xl font-semibold xl:mb-2'>{statistic.value}</div>
              <div className='font-semibold'>{statistic.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Stats;
