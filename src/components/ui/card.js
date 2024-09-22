import React from 'react';

export const Card = ({ children, className, ...props }) => {
  return (
    <div className={`bg-white rounded-lg shadow-md ${className}`} {...props}>
      {children}
    </div>
  );
};

export const CardHeader = ({ children }) => <div className="p-4 border-b">{children}</div>;
export const CardTitle = ({ children }) => <h3 className="text-lg font-semibold">{children}</h3>;
export const CardContent = ({ children }) => <div className="p-4">{children}</div>;
export const CardFooter = ({ children }) => <div className="p-4 border-t">{children}</div>;
export const CardDescription = ({ children }) => <p className="text-sm text-gray-600">{children}</p>;