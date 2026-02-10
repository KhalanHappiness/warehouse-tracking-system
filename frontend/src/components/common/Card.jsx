import React from 'react';

const Card = ({ 
  children, 
  className = '',
  hover = false,
  padding = true,
  ...props 
}) => {
  return (
    <div
      className={`
        bg-navy-light border border-navy rounded-lg
        ${hover ? 'hover:border-primary transition-all duration-200 cursor-pointer' : ''}
        ${padding ? 'p-6' : ''}
        ${className}
      `}
      {...props}
    >
      {children}
    </div>
  );
};

export default Card;
