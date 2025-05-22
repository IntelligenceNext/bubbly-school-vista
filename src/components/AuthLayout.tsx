
import React from 'react';
import { Link } from 'react-router-dom';

interface AuthLayoutProps {
  children: React.ReactNode;
  title: string;
  description: string;
  footer?: React.ReactNode;
}

const AuthLayout: React.FC<AuthLayoutProps> = ({ 
  children, 
  title, 
  description,
  footer
}) => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-primary">School Management</h1>
          <p className="text-muted-foreground mt-2">Administration Portal</p>
        </div>
        <div className="bg-white rounded-lg shadow-md p-8 border border-gray-200">
          <div className="text-center mb-6">
            <h2 className="text-2xl font-semibold">{title}</h2>
            <p className="text-muted-foreground mt-1">{description}</p>
          </div>
          {children}
        </div>
        {footer && (
          <div className="mt-6 text-center">
            {footer}
          </div>
        )}
      </div>
    </div>
  );
};

export default AuthLayout;
