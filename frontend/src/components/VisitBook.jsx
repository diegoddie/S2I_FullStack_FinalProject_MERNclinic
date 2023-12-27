import React from 'react';
import { format, addMinutes, addDays } from 'date-fns';
import itLocale from 'date-fns/locale/it';
import VisitTimeSlot from './VisitTimeSlot';

const VisitBook = () => {
  const today = new Date();

  const timeSlots = [];
for (let i = 0; i < 7; i++) {
  const currentDate = addDays(today, i);
  for (let j = 9 * 60; j < 17 * 60; j++) { // Incrementa a intervalli di 1 minuto
    const timeSlotDate = addMinutes(currentDate, j);
    const formattedDate = format(timeSlotDate, 'dd/MM/yyyy', { locale: itLocale });
    const formattedTime = format(timeSlotDate, 'H:mm', { locale: itLocale });

    timeSlots.push({
      day: formattedDate,
      timeSlot: formattedTime,
    });

    if (timeSlots.length >= 7) {
      break;
    }
  }
}

  return (
    <div className=''>
      <div>
        <h3 className='text-2xl leading-[30px] text-gray-800 font-semibold flex items-center gap-2 mx-auto justify-center'>
          Available Time Slots:
        </h3>
      </div>
      <div className='gap-5 flex flex-wrap mt-5 mx-auto justify-center items-center'>
        {timeSlots.map((slot, index) => (
          <VisitTimeSlot key={index} day={slot.day} timeSlot={slot.timeSlot} />
        ))}
      </div>
    </div>
  );
};

export default VisitBook;
