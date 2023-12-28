import React from 'react';
import { Link } from 'react-router-dom';

const Button = ({ label, color, hoverColor, to }) => {
  return (
    <Link to={to} className={`bg-${color} py-2 px-4 transition-all duration-300 rounded-xl hover:bg-${hoverColor}`}>
      {label}
    </Link>
  );
};

export default Button;
