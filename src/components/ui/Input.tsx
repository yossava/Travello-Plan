import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  fullWidth?: boolean;
}

export default function Input({
  label,
  error,
  helperText,
  leftIcon,
  rightIcon,
  fullWidth = true,
  className = '',
  ...props
}: InputProps) {
  return (
    <div className={fullWidth ? 'w-full' : ''}>
      {label && (
        <label
          htmlFor={props.id}
          className="block text-sm font-semibold text-white mb-2"
        >
          {label}
        </label>
      )}
      <div className="relative">
        {leftIcon && (
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-purple-400">
            {leftIcon}
          </div>
        )}
        <input
          className={`
            block w-full rounded-xl border-2 px-4 py-3
            bg-white/5 backdrop-blur-sm text-white placeholder-gray-400
            ${leftIcon ? 'pl-10' : ''}
            ${rightIcon ? 'pr-10' : ''}
            ${
              error
                ? 'border-red-400 focus:ring-red-500/50 focus:border-red-500'
                : 'border-white/20 focus:ring-4 focus:ring-purple-500/50 focus:border-purple-500'
            }
            transition-all duration-200 shadow-sm hover:border-white/30
            disabled:opacity-50 disabled:cursor-not-allowed disabled:bg-white/5
            ${className}
          `}
          {...props}
        />
        {rightIcon && (
          <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none text-purple-400">
            {rightIcon}
          </div>
        )}
      </div>
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
      {helperText && !error && (
        <p className="mt-2 text-sm text-gray-400">{helperText}</p>
      )}
    </div>
  );
}
