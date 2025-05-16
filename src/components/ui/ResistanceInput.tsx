import React from 'react';

interface ResistanceInputProps {
  label: string;
  value: number;
  onChange: (value: number) => void;
  color?: string;
}

const ResistanceInput: React.FC<ResistanceInputProps> = ({ 
  label, 
  value, 
  onChange,
  color = "text-white" 
}) => {
  return (
    <div className="flex flex-col">
      <label className={`text-sm font-medium mb-1 ${color}`}>
        Resistência a {label}
      </label>
      <input
        type="number"
        value={value}
        onChange={(e) => onChange(Math.max(0, Math.min(200, Number(e.target.value))))}
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