import React from 'react';

interface ResistanceInputProps {
  label: string;
  value: number | null; // Allow value to be null
  onChange: (value: number | null) => void; // onChange should accept null
  color?: string;
}

const ResistanceInput: React.FC<ResistanceInputProps> = ({
  label,
  value,
  onChange,
  color = "text-white"
}) => {
  const numValue = value === null ? '' : value; // Display empty string when value is null

  return (
    <div className="flex flex-col">
      <label className={`text-sm font-medium mb-1 ${color}`}>
        Resistência a {label}
      </label>
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
               onChange(Math.max(0, Math.min(200, parsedValue)));
             }
             // If parsedValue is NaN, do nothing (invalid input) TODO: Maybe clear input if NaN?
          }
        }}
        className="w-full px-3 py-2 bg-gray-700 text-white rounded border border-gray-600
                  focus:outline-none focus:ring-2 focus:ring-yellow-500"
        min="0"
        max="200"
        placeholder="100"
      />
      <span className="text-xs text-gray-400 mt-1">
        Valor máximo: 200
      </span>
    </div>
  );
};

export default ResistanceInput;