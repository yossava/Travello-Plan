import React from 'react';

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  options: Array<{ value: string; label: string }>;
}

export default function Select({
  label,
  error,
  options,
  className = '',
  ...props
}: SelectProps) {
  return (
    <div className="w-full">
      {label && (
        <label
          htmlFor={props.id}
          className="block text-sm font-semibold text-white mb-2"
        >
          {label}
        </label>
      )}
      <select
        className={`block w-full px-4 py-3 border-2 rounded-xl bg-white/5 backdrop-blur-sm text-white shadow-sm focus:outline-none focus:ring-4 transition-all duration-200 ${
          error
            ? 'border-red-400 focus:ring-red-500/50 focus:border-red-500'
            : 'border-white/20 focus:ring-purple-500/50 focus:border-purple-500 hover:border-white/30'
        } ${className}`}
        {...props}
      >
        <option value="">Select...</option>
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      {error && (
        <p className="mt-2 text-sm text-red-400 flex items-center">
          <svg
            className="w-4 h-4 mr-1"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path
              fillRule="evenodd"
              d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
              clipRule="evenodd"
            />
          </svg>
          {error}
        </p>
      )}
    </div>
  );
}
