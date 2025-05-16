import React, { ReactNode } from 'react';

interface StatBarProps {
  label: string;
  current: number;
  max: number;
  percentage: number;
  icon?: ReactNode;
  color?: string;
}

const StatBar: React.FC<StatBarProps> = ({ 
  label, 
  current, 
  max, 
  percentage, 
  icon,
  color = "bg-blue-600" 
}) => {
  // Ensure percentage is between 0 and 100
  const clampedPercentage = Math.max(0, Math.min(100, percentage));
  
  return (
    <div className="w-full">
      <div className="flex justify-between items-center mb-1">
        <div className="flex items-center gap-1 text-sm font-medium text-gray-300">
          {icon}
          <span>{label}</span>
        </div>
        <span className="text-sm text-gray-300">
          {current}/{max}
        </span>
      </div>
      <div className="relative h-3 bg-gray-700 rounded overflow-hidden">
        <div 
          className={`absolute top-0 left-0 h-full ${color} transition-all duration-300 ease-out`}
          style={{ width: `${clampedPercentage}%` }}
        />
      </div>
    </div>
  );
};

export default StatBar;