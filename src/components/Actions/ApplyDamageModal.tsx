import React, { useState } from 'react';
import { useCharacters } from '../../contexts/CharacterContext';
import { X } from 'lucide-react';

interface ApplyDamageModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const ApplyDamageModal: React.FC<ApplyDamageModalProps> = ({ isOpen, onClose }) => {
  const { applyDamage } = useCharacters();
  const [damageAmount, setDamageAmount] = useState(10);
  const [trueDamage, setTrueDamage] = useState(false);
  const [repetitions, setRepetitions] = useState(1);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    applyDamage(damageAmount, trueDamage, repetitions);
    onClose();
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-70 animate-fadeIn">
      <div className="bg-gray-800 text-white p-6 rounded-lg shadow-2xl w-full max-w-md relative animate-scaleIn">
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-400 hover:text-white"
        >
          <X size={20} />
        </button>
        
        <h2 className="text-2xl font-bold mb-4 text-red-500">Aplicar Dano</h2>
        
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="damageAmount" className="block text-sm font-medium text-gray-300 mb-1">
              Quantidade de Dano
            </label>
            <input
              type="number"
              id="damageAmount"
              value={damageAmount}
              onChange={(e) => setDamageAmount(Math.max(1, parseInt(e.target.value) || 1))}
              className="w-full px-3 py-2 bg-gray-700 text-white rounded border border-gray-600 
                        focus:outline-none focus:ring-2 focus:ring-red-500"
              min="1"
              required
            />
          </div>
          
          <div className="mb-4">
            <label htmlFor="repetitions" className="block text-sm font-medium text-gray-300 mb-1">
              Número de Golpes
            </label>
            <input
              type="number"
              id="repetitions"
              value={repetitions}
              onChange={(e) => setRepetitions(Math.max(1, parseInt(e.target.value) || 1))}
              className="w-full px-3 py-2 bg-gray-700 text-white rounded border border-gray-600 
                        focus:outline-none focus:ring-2 focus:ring-red-500"
              min="1"
              required
            />
          </div>
          
          <div className="mb-6">
            <label className="flex items-center space-x-2 cursor-pointer">
              <input
                type="checkbox"
                checked={trueDamage}
                onChange={(e) => setTrueDamage(e.target.checked)}
                className="w-4 h-4 text-red-600 border-gray-300 rounded focus:ring-red-500"
              />
              <span className="text-gray-300">Dano Verdadeiro (ignora armadura)</span>
            </label>
          </div>
          
          <div className="flex justify-end space-x-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
            >
              Aplicar Dano
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ApplyDamageModal;