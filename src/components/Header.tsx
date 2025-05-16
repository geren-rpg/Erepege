import React from 'react';
import { SwordIcon } from 'lucide-react';

const Header: React.FC = () => {
  return (
    <header className="bg-gray-900 text-white p-4 shadow-md">
      <div className="container mx-auto flex items-center justify-center">
        <SwordIcon className="mr-2 text-yellow-500" size={24} />
        <h1 className="text-2xl font-bold">RPG Character Manager</h1>
      </div>
    </header>
  );
};

export default Header;