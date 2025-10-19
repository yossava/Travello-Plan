import React from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
}

export default function Card({ children, className = '' }: CardProps) {
  return (
    <div
      className={`bg-white/10 backdrop-blur-xl border border-white/20 overflow-hidden shadow-2xl rounded-2xl transition-all duration-300 hover:shadow-purple-500/20 hover:border-white/30 ${className}`}
    >
      {children}
    </div>
  );
}

export function CardHeader({ children, className = '' }: CardProps) {
  return <div className={`px-4 py-5 sm:px-6 ${className}`}>{children}</div>;
}

export function CardBody({ children, className = '' }: CardProps) {
  return <div className={`px-4 py-5 sm:p-6 ${className}`}>{children}</div>;
}

export function CardFooter({ children, className = '' }: CardProps) {
  return (
    <div className={`px-4 py-4 sm:px-6 bg-gray-50 ${className}`}>
      {children}
    </div>
  );
}
