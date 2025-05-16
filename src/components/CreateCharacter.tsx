import React, { useState } from 'react';
import { useCharacters } from '../contexts/CharacterContext';
import { CharacterStats, DEFAULT_STATS, DEFAULT_RESISTANCES, CharacterResistances } from '../types/character';
import { Shield, Zap, Heart, Droplets } from 'lucide-react';
import StatInput from './ui/StatInput';
import ResistanceInput from './ui/ResistanceInput';

const CreateCharacter: React.FC = () => {
  const { createCharacter } = useCharacters();
  const [name, setName] = useState('');
  const [stats, setStats] = useState<CharacterStats>({...DEFAULT_STATS});
  const [resistances, setResistances] = useState<CharacterResistances>({...DEFAULT_RESISTANCES});
  const [showAdvanced, setShowAdvanced] = useState(false);

  const handleCreateCharacter = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name) return;
    
    createCharacter(name, stats);
    setName('');
    setStats({...DEFAULT_STATS});
    setResistances({...DEFAULT_RESISTANCES});
  };

  const updateStat = (key: keyof CharacterStats, value: number) => {
    setStats(prev => {
      const newStats = { ...prev, [key]: value };
      
      if (key === 'maxHp') {
        newStats.hp = value;
      }
      if (key === 'maxArmor') {
        newStats.armor = value;
      }
      if (key === 'maxMana') {
        newStats.mana = value;
      }
      
      return newStats;
    });
  };

  const updateResistance = (key: keyof CharacterResistances, value: number) => {
    setResistances(prev => ({ ...prev, [key]: value }));
  };

  return (
    <div className="bg-gray-800 text-white p-6 rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold mb-4 text-yellow-400">Criar Novo Personagem</h2>
      
      <form onSubmit={handleCreateCharacter}>
        <div className="mb-4">
          <label htmlFor="name" className="block text-sm font-medium text-gray-300 mb-1">
            Nome do Personagem
          </label>
          <input
            type="text"
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full px-3 py-2 bg-gray-700 text-white rounded border border-gray-600 
                      focus:outline-none focus:ring-2 focus:ring-yellow-500"
            placeholder="Digite o nome do personagem"
            required
          />
        </div>
        
        <div className="mb-6">
          <h3 className="text-xl font-semibold mb-3 text-yellow-400">Status Base</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <StatInput 
              label="Vida Máxima" 
              value={stats.maxHp} 
              onChange={(value) => updateStat('maxHp', value)}
              icon={<Heart className="w-5 h-5 text-red-500" />}
              min={1}
              max={1000}
            />
            
            <StatInput 
              label="Armadura Máxima" 
              value={stats.maxArmor} 
              onChange={(value) => updateStat('maxArmor', value)}
              icon={<Shield className="w-5 h-5 text-blue-500" />}
              min={0}
              max={1000}
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
              max={1000}
            />
          </div>
        </div>
        
        <div className="mb-6">
          <button
            type="button"
            className="text-yellow-400 underline mb-2"
            onClick={() => setShowAdvanced(!showAdvanced)}
          >
            {showAdvanced ? 'Ocultar' : 'Mostrar'} Resistências
          </button>
          
          {showAdvanced && (
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
            type="submit"
            className="px-6 py-3 bg-yellow-600 text-white rounded-lg shadow-md 
                       hover:bg-yellow-700 transition-colors duration-200"
            disabled={!name}
          >
            Criar Personagem
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreateCharacter;