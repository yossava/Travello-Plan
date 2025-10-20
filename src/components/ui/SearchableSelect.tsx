import Select, { StylesConfig } from 'react-select';

interface Option {
  value: string;
  label: string;
}

interface SearchableSelectProps {
  id: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  options: Option[];
  error?: string;
  required?: boolean;
  placeholder?: string;
  dark?: boolean;
}

export default function SearchableSelect({
  id,
  label,
  value,
  onChange,
  options,
  error,
  required = false,
  placeholder = 'Select...',
  dark = false,
}: SearchableSelectProps) {
  const selectedOption = options.find((opt) => opt.value === value) || null;

  // Custom styles to match the theme
  const customStyles: StylesConfig<Option, false> = {
    control: (provided, state) => ({
      ...provided,
      backgroundColor: dark ? 'rgba(255, 255, 255, 0.1)' : 'rgb(249 250 251)', // bg-white/10 or bg-gray-50
      borderColor: error
        ? 'rgb(252 165 165)' // red-300
        : state.isFocused
          ? 'rgb(59 130 246)' // blue-500
          : dark ? 'rgba(255, 255, 255, 0.2)' : 'rgb(229 231 235)', // border-white/20 or border-gray-200
      borderWidth: dark ? '1px' : '2px',
      borderRadius: '0.75rem',
      padding: '0.375rem 0.5rem',
      minHeight: '3rem',
      boxShadow: state.isFocused ? '0 0 0 2px rgba(59, 130, 246, 0.5)' : 'none',
      transition: 'all 0.2s',
      backdropFilter: dark ? 'blur(8px)' : 'none',
      '&:hover': {
        borderColor: error ? 'rgb(252 165 165)' : dark ? 'rgba(255, 255, 255, 0.3)' : 'rgb(209 213 219)', // gray-300
      },
    }),
    valueContainer: (provided) => ({
      ...provided,
      padding: '0',
    }),
    input: (provided) => ({
      ...provided,
      color: dark ? 'rgb(255 255 255)' : 'rgb(17 24 39)', // white or gray-900
      margin: '0',
      padding: '0',
    }),
    placeholder: (provided) => ({
      ...provided,
      color: dark ? 'rgb(209 213 219)' : 'rgb(156 163 175)', // gray-300 or gray-400
    }),
    singleValue: (provided) => ({
      ...provided,
      color: dark ? 'rgb(255 255 255)' : 'rgb(17 24 39)', // white or gray-900
    }),
    menu: (provided) => ({
      ...provided,
      backgroundColor: dark ? 'rgb(31 41 55)' : 'rgb(255 255 255)', // gray-800 or white
      borderRadius: '0.75rem',
      border: dark ? '1px solid rgba(255, 255, 255, 0.2)' : '2px solid rgb(229 231 235)',
      marginTop: '0.5rem',
      boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -2px rgb(0 0 0 / 0.05)',
      zIndex: 9999,
    }),
    menuList: (provided) => ({
      ...provided,
      padding: '0.5rem',
      maxHeight: '300px',
      // Hide scrollbar
      scrollbarWidth: 'none', // Firefox
      msOverflowStyle: 'none', // IE and Edge
      '&::-webkit-scrollbar': {
        display: 'none', // Chrome, Safari, Opera
      },
    }),
    option: (provided, state) => ({
      ...provided,
      backgroundColor: state.isSelected
        ? 'rgb(59 130 246)' // blue-500
        : state.isFocused
          ? dark ? 'rgba(59, 130, 246, 0.2)' : 'rgb(239 246 255)' // blue-500/20 : blue-50
          : 'transparent',
      color: state.isSelected ? 'rgb(255 255 255)' : dark ? 'rgb(255 255 255)' : 'rgb(17 24 39)', // white
      padding: '0.75rem 1rem',
      borderRadius: '0.5rem',
      cursor: 'pointer',
      '&:active': {
        backgroundColor: 'rgb(37 99 235)', // blue-600
      },
    }),
    indicatorSeparator: () => ({
      display: 'none',
    }),
    dropdownIndicator: (provided, state) => ({
      ...provided,
      color: state.isFocused ? 'rgb(59 130 246)' : dark ? 'rgb(209 213 219)' : 'rgb(156 163 175)', // blue-500 : gray-300/gray-400
      '&:hover': {
        color: 'rgb(59 130 246)',
      },
      padding: '0 0.5rem',
    }),
    clearIndicator: (provided) => ({
      ...provided,
      color: dark ? 'rgb(209 213 219)' : 'rgb(156 163 175)', // gray-300 or gray-400
      '&:hover': {
        color: 'rgb(239 68 68)', // red-500
      },
      padding: '0 0.5rem',
    }),
  };

  return (
    <div className="space-y-2">
      <label htmlFor={id} className={`block text-sm font-medium mb-2 ${dark ? 'text-gray-300' : 'text-gray-700 font-semibold'}`}>
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>
      <Select
        instanceId={id}
        inputId={id}
        value={selectedOption}
        onChange={(option) => onChange(option?.value || '')}
        options={options}
        styles={customStyles}
        placeholder={placeholder}
        isClearable
        isSearchable
        className="react-select-container"
        classNamePrefix="react-select"
      />
      {error && <p className="text-sm text-red-600">{error}</p>}
    </div>
  );
}
