import React, { useState } from 'react';

const Alert = ({ type, message }) => {
  const [visible, setVisible] = useState(true);

  return (
    <>
      {visible && (
        <div
          className='border border-red-400 text-red-700 bg-red-100 text-lg font-semibold rounded p-4 my-2 items-center justify-between mx-auto flex'
        >
          <span className=''>{message}</span>
          <button
            className="text-3xl cursor-pointer"
            onClick={() => {
              setVisible(false);
            }}
          >
            &times;
          </button>
        </div>
      )}
    </>
  );
};

export default Alert;
