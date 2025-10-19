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

  // Custom styles to match the dark theme and Input component
  const customStyles: StylesConfig<Option, false> = {
    control: (provided, state) => ({
      ...provided,
      backgroundColor: 'rgba(255, 255, 255, 0.05)', // bg-white/5
      backdropFilter: 'blur(8px)', // backdrop-blur-sm
      borderColor: error
        ? 'rgb(248 113 113)' // red-400
        : state.isFocused
          ? 'rgb(168 85 247)' // purple-500
          : 'rgba(255, 255, 255, 0.2)', // border-white/20
      borderWidth: '2px',
      borderRadius: '0.75rem',
      padding: '0.375rem 0.5rem',
      minHeight: '3rem',
      boxShadow: state.isFocused ? '0 0 0 4px rgba(168, 85, 247, 0.5)' : 'none',
      transition: 'all 0.2s',
      '&:hover': {
        borderColor: error ? 'rgb(248 113 113)' : 'rgba(255, 255, 255, 0.3)',
      },
    }),
    valueContainer: (provided) => ({
      ...provided,
      padding: '0',
    }),
    input: (provided) => ({
      ...provided,
      color: 'rgb(255 255 255)',
      margin: '0',
      padding: '0',
    }),
    placeholder: (provided) => ({
      ...provided,
      color: 'rgb(148 163 184)', // slate-400
    }),
    singleValue: (provided) => ({
      ...provided,
      color: 'rgb(255 255 255)',
    }),
    menu: (provided) => ({
      ...provided,
      backgroundColor: 'rgba(255, 255, 255, 0.05)', // bg-white/5
      backdropFilter: 'blur(8px)', // backdrop-blur-sm
      borderRadius: '0.75rem',
      border: '2px solid rgba(255, 255, 255, 0.2)', // border-white/20
      marginTop: '0.5rem',
      boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.3)',
    }),
    menuList: (provided) => ({
      ...provided,
      padding: '0.5rem',
      maxHeight: '300px',
    }),
    option: (provided, state) => ({
      ...provided,
      backgroundColor: state.isSelected
        ? 'rgb(168 85 247)' // purple-500
        : state.isFocused
          ? 'rgba(255, 255, 255, 0.1)' // white/10 for hover
          : 'transparent',
      color: 'rgb(255 255 255)',
      padding: '0.75rem 1rem',
      borderRadius: '0.5rem',
      cursor: 'pointer',
      '&:active': {
        backgroundColor: 'rgb(147 51 234)', // purple-600
      },
    }),
    indicatorSeparator: () => ({
      display: 'none',
    }),
    dropdownIndicator: (provided, state) => ({
      ...provided,
      color: state.isFocused ? 'rgb(168 85 247)' : 'rgb(148 163 184)',
      '&:hover': {
        color: 'rgb(168 85 247)',
      },
      padding: '0 0.5rem',
    }),
    clearIndicator: (provided) => ({
      ...provided,
      color: 'rgb(148 163 184)',
      '&:hover': {
        color: 'rgb(239 68 68)', // red-500
      },
      padding: '0 0.5rem',
    }),
  };

  return (
    <div className="space-y-2">
      <label htmlFor={id} className="block text-sm font-semibold text-white mb-2">
        {label}
        {required && <span className="text-red-400 ml-1">*</span>}
      </label>
      <Select
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
      {error && <p className="text-sm text-red-400">{error}</p>}
    </div>
  );
}
