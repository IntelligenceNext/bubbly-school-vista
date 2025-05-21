
import React from 'react';
import Layout from './Layout';

interface PageTemplateProps {
  title: string;
  subtitle?: string;
  children?: React.ReactNode;
}

const PageTemplate: React.FC<PageTemplateProps> = ({ title, subtitle, children }) => {
  return (
    <Layout>
      <div className="p-6">
        <div className="mb-6">
          <h1 className="text-2xl font-bold">{title}</h1>
          {subtitle && <p className="text-gray-500">{subtitle}</p>}
        </div>
        
        {children ? (
          children
        ) : (
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
            <p>This page is under development. Content will be available soon.</p>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default PageTemplate;
