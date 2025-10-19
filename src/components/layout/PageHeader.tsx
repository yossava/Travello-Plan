import React from 'react';

interface PageHeaderProps {
  title: string;
  description?: string;
  action?: React.ReactNode;
}

export default function PageHeader({
  title,
  description,
  action,
}: PageHeaderProps) {
  return (
    <div className="mb-8">
      <div className="sm:flex sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white bg-gradient-to-r from-white via-purple-200 to-white bg-clip-text">
            {title}
          </h1>
          {description && (
            <p className="mt-2 text-base text-gray-300">{description}</p>
          )}
        </div>
        {action && <div className="mt-4 sm:mt-0">{action}</div>}
      </div>
    </div>
  );
}
