import React, { useState } from 'react';

const CustomWorkShifts = ({ workingDays, customWorkShifts, handleCustomWorkShiftChange }) => {
  const sortedCustomWorkShifts = [...customWorkShifts].sort((a, b) => {
    return workingDays.indexOf(a.dayOfWeek) - workingDays.indexOf(b.dayOfWeek);
  });

  return (
    <div className='flex flex-col justify-center mx-auto items-center py-4'>
      <label className='text-xl leading-[20px] text-[#168aad] font-semibold mb-2'>
        Select Work Days
      </label>
      <div className='flex items-center space-x-4 mt-2'>
        {workingDays.map((day) => (
          <div key={day} className='flex items-center text-xl leading-[10px] text-[#168aad]'>
            <input
              type='checkbox'
              name={`workDay-${day}`}
              checked={customWorkShifts.some((shift) => shift.dayOfWeek === day)}
              onChange={(e) => {
                handleCustomWorkShiftChange(day, '', '');
              }}
              className='mr-2'
            />
            {day}
          </div>
        ))}
      </div>
      <div className='flex flex-col items-center space-y-4 mt-8'>
        {sortedCustomWorkShifts.map((shift) => (
          <div key={shift.dayOfWeek} className='flex items-center justify-center'>
            <span className='mr-2 font-semibold text-lg leading-[20px] text-[#168aad]'>
              {shift.dayOfWeek}:
            </span>
            <input
              type='time'
              placeholder='Start Time'
              value={shift.startTime || ''}
              onChange={(e) => handleCustomWorkShiftChange(shift.dayOfWeek, e.target.value, shift.endTime)}
              className='font-semibold text-lg px-4 py-2 text-gray-700 bg-gray-100 border-2 border-gray-400 rounded-md focus:border-blue-500 focus:outline-none focus:ring mr-2'
            />
            <input
              type='time'
              placeholder='End Time'
              value={shift.endTime || ''}
              onChange={(e) => handleCustomWorkShiftChange(shift.dayOfWeek, shift.startTime, e.target.value)}
              className='font-semibold text-lg px-4 py-2 text-gray-700 bg-gray-100 border-2 border-gray-400 rounded-md focus:border-blue-500 focus:outline-none focus:ring'
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default CustomWorkShifts;
