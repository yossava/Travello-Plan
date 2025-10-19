import React from 'react';

interface CheckboxProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
}

export default function Checkbox({ label, className = '', ...props }: CheckboxProps) {
  return (
    <div className="flex items-center">
      <input
        type="checkbox"
        className={`h-4 w-4 text-purple-500 focus:ring-purple-500 focus:ring-offset-2 focus:ring-offset-slate-800 border-white/20 bg-white/5 rounded ${className}`}
        {...props}
      />
      {label && (
        <label htmlFor={props.id} className="ml-2 block text-sm text-white">
          {label}
        </label>
      )}
    </div>
  );
}
