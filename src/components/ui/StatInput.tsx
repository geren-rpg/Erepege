import React, { ReactNode } from 'react';

interface StatInputProps {
  label: string;
  value: number;
  onChange: (value: number) => void;
  icon?: ReactNode;
  min?: number;
  max?: number;
}

const StatInput: React.FC<StatInputProps> = ({ 
  label, 
  value, 
  onChange, 
  icon, 
  min = 0, 
  max 
}) => {
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
          onClick={() => onChange(Math.max(min, value - 1))}
          disabled={value <= min}
        >
          -
        </button>
        <input
          type="number"
          value={value}
          onChange={(e) => {
            const newValue = parseInt(e.target.value) || min;
            onChange(max !== undefined ? Math.min(max, newValue) : newValue);
          }}
          className="w-16 text-center py-1 bg-gray-700 text-white border-y border-gray-600 
                     focus:outline-none focus:ring-0"
          min={min}
          max={max}
        />
        <button
          type="button"
          className="px-2 py-1 bg-gray-700 text-white rounded-r border border-gray-600 
                     hover:bg-gray-600 transition-colors"
          onClick={() => onChange(max !== undefined ? Math.min(max, value + 1) : value + 1)}
          disabled={max !== undefined && value >= max}
        >
          +
        </button>
      </div>
    </div>
  );
};

export default StatInput;