import React from 'react';
import { useCharacters } from '../contexts/CharacterContext';
import { Character } from '../types/character';
import StatBar from './ui/StatBar';
import { Trash2, RefreshCw, Shield, Heart, Zap } from 'lucide-react';

interface CharacterCardProps {
  character: Character;
}

const CharacterCard: React.FC<CharacterCardProps> = ({ character }) => {
  const { selectCharacter, deleteCharacter, resetCharacter, selectedCharacter } = useCharacters();
  
  const isSelected = selectedCharacter?.id === character.id;
  
  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (confirm(`Tem certeza que deseja deletar ${character.name}?`)) {
      deleteCharacter(character.id);
    }
  };
  
  const handleReset = (e: React.MouseEvent) => {
    e.stopPropagation();
    resetCharacter();
  };
  
  const hpPercentage = (character.currentStats.hp / character.currentStats.maxHp) * 100;
  const armorPercentage = character.currentStats.maxArmor > 0 
    ? (character.currentStats.armor / character.currentStats.maxArmor) * 100
    : 0;
  const manaPercentage = character.currentStats.maxMana > 0 
    ? (character.currentStats.mana / character.currentStats.maxMana) * 100
    : 0;
  
  return (
    <div 
      className={`bg-gray-800 p-4 rounded-lg shadow-lg cursor-pointer transition-all
                  ${isSelected ? 'ring-2 ring-yellow-500 transform scale-[1.02]' : 'hover:bg-gray-700'}`}
      onClick={() => selectCharacter(character.id)}
    >
      <div className="flex justify-between items-start mb-3">
        <h3 className="text-xl font-bold text-white">{character.name}</h3>
        <div className="flex space-x-2">
          <button
            onClick={handleReset}
            className="p-1 bg-gray-700 text-gray-300 rounded hover:bg-gray-600 hover:text-white transition-colors"
            title="Resetar status"
          >
            <RefreshCw size={16} />
          </button>
          <button
            onClick={handleDelete}
            className="p-1 bg-gray-700 text-red-400 rounded hover:bg-red-600 hover:text-white transition-colors"
            title="Deletar personagem"
          >
            <Trash2 size={16} />
          </button>
        </div>
      </div>
      
      <div className="space-y-3">
        <StatBar 
          label="Vida" 
          current={character.currentStats.hp} 
          max={character.currentStats.maxHp} 
          percentage={hpPercentage}
          icon={<Heart size={14} className="text-red-500" />}
          color="bg-red-600"
        />
        
        <StatBar 
          label="Armadura" 
          current={character.currentStats.armor} 
          max={character.currentStats.maxArmor} 
          percentage={armorPercentage}
          icon={<Shield size={14} className="text-blue-400" />}
          color="bg-blue-600"
        />
        
        <StatBar 
          label="Mana" 
          current={character.currentStats.mana} 
          max={character.currentStats.maxMana} 
          percentage={manaPercentage}
          icon={<Zap size={14} className="text-purple-400" />}
          color="bg-purple-600"
        />
      </div>
      
      <div className="mt-3 text-sm text-gray-300">
        <div className="flex justify-between">
          <span>Regeneração de Mana:</span>
          <span className="font-medium text-white">{character.currentStats.manaRegeneration}%</span>
        </div>
      </div>
    </div>
  );
};

export default CharacterCard;