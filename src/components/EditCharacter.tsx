import React, { useState, useEffect } from 'react';
import { useCharacters } from '../contexts/CharacterContext';
import { Character, CharacterStats, CharacterResistances } from '../types/character';
import { Shield, Zap, Heart, Droplets } from 'lucide-react';
import StatInput from './ui/StatInput';
import ResistanceInput from './ui/ResistanceInput';

const EditCharacter: React.FC = () => {
  const { selectedCharacter, updateInitialStats } = useCharacters();
  const [stats, setStats] = useState<CharacterStats | null>(null);
  const [resistances, setResistances] = useState<CharacterResistances | null>(null);
  const [showResistances, setShowResistances] = useState(false);
  
  useEffect(() => {
    if (selectedCharacter) {
      setStats({ ...selectedCharacter.initialStats });
      setResistances({ ...selectedCharacter.resistances });
    } else {
      setStats(null);
      setResistances(null);
    }
  }, [selectedCharacter]);
  
  if (!selectedCharacter || !stats || !resistances) {
    return (
      <div className="bg-gray-800 text-white p-6 rounded-lg shadow-lg text-center">
        <p className="text-gray-400">Selecione um personagem para editar</p>
      </div>
    );
  }
  
  const updateStat = (key: keyof CharacterStats, value: number) => {
    setStats(prev => {
      if (!prev) return null;
      
      const newStats = { ...prev, [key]: value };
      
      if (key === 'maxHp') {
        newStats.hp = Math.min(newStats.hp, value);
      }
      if (key === 'maxArmor') {
        newStats.armor = Math.min(newStats.armor, value);
      }
      if (key === 'maxMana') {
        newStats.mana = Math.min(newStats.mana, value);
      }
      
      return newStats;
    });
  };
  
  const updateResistance = (key: keyof CharacterResistances, value: number) => {
    setResistances(prev => {
      if (!prev) return null;
      return { ...prev, [key]: value };
    });
  };
  
  const handleSave = () => {
    if (!stats) return;
    updateInitialStats(stats);
  };
  
  return (
    <div className="bg-gray-800 text-white p-6 rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold mb-4 text-yellow-400">Editar {selectedCharacter.name}</h2>
      
      <div className="mb-6">
        <h3 className="text-xl font-semibold mb-3 text-yellow-400">Status Base</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <StatInput 
            label="Vida Máxima" 
            value={stats.maxHp} 
            onChange={(value) => updateStat('maxHp', value)}
            icon={<Heart className="w-5 h-5 text-red-500" />}
            min={1}
          />
          
          <StatInput 
            label="Armadura Máxima" 
            value={stats.maxArmor} 
            onChange={(value) => updateStat('maxArmor', value)}
            icon={<Shield className="w-5 h-5 text-blue-500" />}
            min={0}
          />
          
          <StatInput 
            label="Regeneração de Mana" 
            value={stats.manaRegeneration} 
            onChange={(value) => updateStat('manaRegeneration', value)}
            icon={<Droplets className="w-5 h-5 text-blue-400" />}
            min={0}
            max={100}
          />
          
          <StatInput 
            label="Mana Máxima" 
            value={stats.maxMana} 
            onChange={(value) => updateStat('maxMana', value)}
            icon={<Zap className="w-5 h-5 text-blue-400" />}
            min={0}
          />
        </div>
      </div>
      
      <div className="mb-6">
        <button
          type="button"
          className="text-yellow-400 underline mb-2"
          onClick={() => setShowResistances(!showResistances)}
        >
          {showResistances ? 'Ocultar' : 'Mostrar'} Resistências
        </button>
        
        {showResistances && (
          <div>
            <h3 className="text-xl font-semibold mb-3 text-yellow-400">Resistências</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <ResistanceInput 
                label="Congelamento" 
                value={resistances.freezing} 
                onChange={(value) => updateResistance('freezing', value)}
                color="text-blue-300"
              />
              <ResistanceInput 
                label="Choque" 
                value={resistances.shock} 
                onChange={(value) => updateResistance('shock', value)}
                color="text-yellow-300"
              />
              <ResistanceInput 
                label="Sangramento" 
                value={resistances.bleeding} 
                onChange={(value) => updateResistance('bleeding', value)}
                color="text-red-500"
              />
              <ResistanceInput 
                label="Chamas" 
                value={resistances.flames} 
                onChange={(value) => updateResistance('flames', value)}
                color="text-orange-500"
              />
              <ResistanceInput 
                label="Veneno" 
                value={resistances.poison} 
                onChange={(value) => updateResistance('poison', value)}
                color="text-green-500"
              />
              <ResistanceInput 
                label="Atordoamento" 
                value={resistances.stunning} 
                onChange={(value) => updateResistance('stunning', value)}
                color="text-purple-500"
              />
              <ResistanceInput 
                label="Cegueira" 
                value={resistances.blindness} 
                onChange={(value) => updateResistance('blindness', value)}
                color="text-gray-400"
              />
            </div>
          </div>
        )}
      </div>
      
      <div className="flex justify-end">
        <button
          onClick={handleSave}
          className="px-6 py-3 bg-yellow-600 text-white rounded-lg shadow-md 
                     hover:bg-yellow-700 transition-colors duration-200"
        >
          Salvar Alterações
        </button>
      </div>
    </div>
  );
};

export default EditCharacter;