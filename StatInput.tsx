import React, { ReactNode } from 'react';

interface StatInputProps {
  label: string;
  value: number | null; // Allow value to be null
  onChange: (value: number | null) => void; // onChange should accept null
  icon?: ReactNode;
  min?: number;
  max?: number;
  allowExceedMax?: boolean;
}

const StatInput: React.FC<StatInputProps> = ({
  label,
  value,
  onChange,
  icon,
  min = 0,
  max = 1000,
  allowExceedMax = false
}) => {
  const effectiveMax = allowExceedMax ? 1000 : max;
  const numValue = value === null ? '' : value; // Display empty string when value is null

  return (
    <div className="flex flex-col">
      <label className="flex items-center gap-2 text-sm font-medium text-gray-300 mb-1">
        {icon && <span>{icon}</span>}
        {label}
      </label>
      <div className="flex items-center">
        <button
          type="button"
          className="px-2 py-1 bg-gray-700 text-white rounded-l border border-gray-600 
                     hover:bg-gray-600 transition-colors"
          onClick={() => {
             if (value !== null) {
               onChange(Math.max(min, value - 1));
             } else {
               onChange(min); // If null, start from min when decreasing
             }
          }}
          disabled={value !== null && value <= min} // Disable if value is not null and <= min
        >
          -
        </button>
        <input
          type="number"
          value={numValue} // Use numValue for display
          onChange={(e) => {
            const stringValue = e.target.value;
            if (stringValue === '') {
              onChange(null); // Set to null if input is empty
            } else {
              const parsedValue = parseInt(stringValue);
              if (!isNaN(parsedValue)) {
                 // Apply min/max constraints only if value is not null
                onChange(effectiveMax !== undefined ? Math.min(effectiveMax, Math.max(min, parsedValue)) : parsedValue);
              }
              // If parsedValue is NaN, do nothing (invalid input)
            }
          }}
          className="w-20 text-center py-1 bg-gray-700 text-white border-y border-gray-600 
                     focus:outline-none focus:ring-0"
          min={min}
          max={effectiveMax}
        />
        <button
          type="button"
          className="px-2 py-1 bg-gray-700 text-white rounded-r border border-gray-600 
                     hover:bg-gray-600 transition-colors"
          onClick={() => {
             if (value !== null) {
                onChange(effectiveMax !== undefined ? Math.min(effectiveMax, value + 1) : value + 1);
             } else {
                onChange(min + 1); // If null, start from min+1 when increasing
             }
          }}
          disabled={effectiveMax !== undefined && value !== null && value >= effectiveMax} // Disable if value is not null and >= effectiveMax
        >
          +
        </button>
      </div>
    </div>
  );
};

export default StatInput;