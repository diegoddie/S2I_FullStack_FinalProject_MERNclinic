import React, { useState, useEffect } from 'react';
import { format } from 'date-fns';

const Clock = () => {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const intervalID = setInterval(() => {
      setTime(new Date());
    }, 1000);

    return () => clearInterval(intervalID);
  }, []);

  const formatDate = (date) => {
    return format(date, "EEEE dd MMMM yyyy");
  };

  return (
    <div className="text-2xl font-bold text-center text-[#367588] w-fit justify-center mx-auto">
      <div>{format(time, "HH:mm:ss")}</div>
      <div>{formatDate(time)}</div>
    </div>
  );
};

export default Clock;
