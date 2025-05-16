import React, { useState } from 'react';
import { useCharacters } from '../../contexts/CharacterContext';
import { X } from 'lucide-react';

interface ModifyStatModalProps {
  isOpen: boolean;
  onClose: () => void;
  statType: "hp" | "armor" | "mana";
  title: string;
  allowExceedMax?: boolean;
}

const ModifyStatModal: React.FC<ModifyStatModalProps> = ({ 
  isOpen, 
  onClose, 
  statType, 
  title,
  allowExceedMax = false
}) => {
  const { modifyHp, modifyArmor, modifyMana, selectedCharacter } = useCharacters();
  const [amount, setAmount] = useState(10);
  const [operation, setOperation] = useState<"set" | "increase" | "decrease">("increase");
  const [isPercentage, setIsPercentage] = useState(false);
  const [exceedMax, setExceedMax] = useState(false);

  if (!isOpen || !selectedCharacter) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (statType === "hp") {
      modifyHp(operation, amount, isPercentage, exceedMax);
    } else if (statType === "armor") {
      modifyArmor(operation, amount, isPercentage, exceedMax);
    } else {
      modifyMana(operation, amount, isPercentage, exceedMax);
    }
    
    onClose();
  };

  const getOperationLabel = (op: typeof operation) => {
    switch (op) {
      case "set": return "Definir como";
      case "increase": return "Aumentar em";
      case "decrease": return "Diminuir em";
    }
  };

  const maxValue = statType === "hp" 
    ? selectedCharacter.currentStats.maxHp 
    : statType === "armor"
    ? selectedCharacter.currentStats.maxArmor
    : selectedCharacter.currentStats.maxMana;

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-70 animate-fadeIn">
      <div className="bg-gray-800 text-white p-6 rounded-lg shadow-2xl w-full max-w-md relative animate-scaleIn">
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-400 hover:text-white"
        >
          <X size={20} />
        </button>
        
        <h2 className="text-2xl font-bold mb-4 text-blue-500">{title}</h2>
        
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="operation" className="block text-sm font-medium text-gray-300 mb-1">
              Operação
            </label>
            <select
              id="operation"
              value={operation}
              onChange={(e) => setOperation(e.target.value as typeof operation)}
              className="w-full px-3 py-2 bg-gray-700 text-white rounded border border-gray-600 
                        focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="set">Definir valor específico</option>
              <option value="increase">Aumentar valor</option>
              <option value="decrease">Diminuir valor</option>
            </select>
          </div>
          
          <div className="mb-4">
            <label htmlFor="amount" className="block text-sm font-medium text-gray-300 mb-1">
              {getOperationLabel(operation)}
            </label>
            <div className="flex items-center">
              <input
                type="number"
                id="amount"
                value={amount}
                onChange={(e) => setAmount(Math.max(0, parseInt(e.target.value) || 0))}
                className="flex-1 px-3 py-2 bg-gray-700 text-white rounded-l border border-gray-600 
                          focus:outline-none focus:ring-2 focus:ring-blue-500"
                min={0}
                max={isPercentage ? 100 : undefined}
                required
              />
              <button
                type="button"
                onClick={() => setIsPercentage(!isPercentage)}
                className={`px-3 py-2 rounded-r border border-gray-600 font-medium
                            ${isPercentage 
                              ? 'bg-blue-600 text-white' 
                              : 'bg-gray-700 text-gray-300 hover:bg-gray-600'}`}
              >
                {isPercentage ? '%' : 'val'}
              </button>
            </div>
            <p className="text-xs text-gray-400 mt-1">
              {isPercentage 
                ? `${amount}% do máximo de ${statType.toUpperCase()} (${Math.round(maxValue * (amount / 100))})`
                : `Valor absoluto: ${amount}`}
            </p>
          </div>

          {allowExceedMax && (
            <div className="mb-4">
              <label className="flex items-center space-x-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={exceedMax}
                  onChange={(e) => setExceedMax(e.target.checked)}
                  className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                />
                <span className="text-gray-300">Permitir ultrapassar o limite máximo</span>
              </label>
            </div>
          )}
          
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
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Aplicar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ModifyStatModal;