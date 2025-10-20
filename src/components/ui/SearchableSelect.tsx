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
}: SearchableSelectProps) {
  const selectedOption = options.find((opt) => opt.value === value) || null;

  // Custom styles to match the light theme and Input component
  const customStyles: StylesConfig<Option, false> = {
    control: (provided, state) => ({
      ...provided,
      backgroundColor: 'rgb(249 250 251)', // bg-gray-50
      borderColor: error
        ? 'rgb(252 165 165)' // red-300
        : state.isFocused
          ? 'rgb(59 130 246)' // blue-500
          : 'rgb(229 231 235)', // border-gray-200
      borderWidth: '2px',
      borderRadius: '0.75rem',
      padding: '0.375rem 0.5rem',
      minHeight: '3rem',
      boxShadow: state.isFocused ? '0 0 0 4px rgba(59, 130, 246, 0.2)' : 'none',
      transition: 'all 0.2s',
      '&:hover': {
        borderColor: error ? 'rgb(252 165 165)' : 'rgb(209 213 219)', // gray-300
      },
    }),
    valueContainer: (provided) => ({
      ...provided,
      padding: '0',
    }),
    input: (provided) => ({
      ...provided,
      color: 'rgb(17 24 39)', // gray-900
      margin: '0',
      padding: '0',
    }),
    placeholder: (provided) => ({
      ...provided,
      color: 'rgb(156 163 175)', // gray-400
    }),
    singleValue: (provided) => ({
      ...provided,
      color: 'rgb(17 24 39)', // gray-900
    }),
    menu: (provided) => ({
      ...provided,
      backgroundColor: 'rgb(255 255 255)', // white - solid background
      borderRadius: '0.75rem',
      border: '2px solid rgb(229 231 235)', // border-gray-200
      marginTop: '0.5rem',
      boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -2px rgb(0 0 0 / 0.05)',
      zIndex: 9999,
    }),
    menuList: (provided) => ({
      ...provided,
      padding: '0.5rem',
      maxHeight: '300px',
    }),
    option: (provided, state) => ({
      ...provided,
      backgroundColor: state.isSelected
        ? 'rgb(59 130 246)' // blue-500
        : state.isFocused
          ? 'rgb(239 246 255)' // blue-50
          : 'transparent',
      color: state.isSelected ? 'rgb(255 255 255)' : 'rgb(17 24 39)', // white : gray-900
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
      color: state.isFocused ? 'rgb(59 130 246)' : 'rgb(156 163 175)', // blue-500 : gray-400
      '&:hover': {
        color: 'rgb(59 130 246)',
      },
      padding: '0 0.5rem',
    }),
    clearIndicator: (provided) => ({
      ...provided,
      color: 'rgb(156 163 175)', // gray-400
      '&:hover': {
        color: 'rgb(239 68 68)', // red-500
      },
      padding: '0 0.5rem',
    }),
  };

  return (
    <div className="space-y-2">
      <label htmlFor={id} className="block text-sm font-semibold text-gray-700 mb-2">
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
