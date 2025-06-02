import React, { useState, useEffect } from 'react';
import { useCharacters } from '../contexts/CharacterContext';
import { Character, CharacterStats, CharacterResistances } from '../types/character';
import { Shield, Zap, Heart, Droplets } from 'lucide-react';
import StatInput from './ui/StatInput';
import ResistanceInput from './ui/ResistanceInput';

// Define um tipo para o estado de edição que permite null para os números
type EditableCharacterStats = {
  [K in keyof CharacterStats]: number | null;
};

// Define um tipo para o estado de edição de resistências que permite null para os números
// (Será usado na solicitação 2)
type EditableCharacterResistances = {
  [K in keyof CharacterResistances]: number | null;
};


const EditCharacter: React.FC = () => {
  const { selectedCharacter, updateInitialStats, updateResistances } = useCharacters(); // Added updateResistances for step 2
  // Use o novo tipo que permite null para o estado local
  const [stats, setStats] = useState<EditableCharacterStats | null>(null);
  // Use o novo tipo que permite null para o estado local de resistências (para step 2)
  const [resistances, setResistances] = useState<EditableCharacterResistances | null>(null);
  const [showResistances, setShowResistances] = useState(false);

  useEffect(() => {
    if (selectedCharacter) {
      // Ao carregar, mapeia os valores numéricos para number | null (serão sempre number inicialmente)
      const editableStats: EditableCharacterStats = { ...selectedCharacter.initialStats };
       const editableResistances: EditableCharacterResistances = { ...selectedCharacter.resistances }; // For step 2
      setStats(editableStats);
      setResistances(editableResistances); // For step 2
    } else {
      setStats(null);
      setResistances(null); // For step 2
    }
  }, [selectedCharacter]);

  if (!selectedCharacter || !stats || !resistances) { // Keep resistances check for now, will adjust in step 2
    return (
      <div className="bg-gray-800 text-white p-6 rounded-lg shadow-lg text-center">
        <p className="text-gray-400">Selecione um personagem para editar</p>
      </div>
    );
  }

  // updateStat agora aceita number | null
  const updateStat = (key: keyof CharacterStats, value: number | null) => {
    setStats(prev => {
      if (!prev) return null;

      const newStats = { ...prev, [key]: value };

      // Lógica para manter a consistência entre max e valor atual, lidando com null
      if (key === 'maxHp') {
        if (newStats.maxHp !== null && (newStats.hp === null || newStats.hp > newStats.maxHp)) {
           newStats.hp = newStats.maxHp; // Se maxHp é um número e hp é null ou maior que o novo maxHp, iguala hp a maxHp
        } else if (newStats.maxHp === null) {
           newStats.hp = null; // Se maxHp se torna null, defina hp como null
        }
         // Se newStats.hp já é um número válido <= newStats.maxHp, não faz nada
      }
       if (key === 'maxArmor') {
        if (newStats.maxArmor !== null && (newStats.armor === null || newStats.armor > newStats.maxArmor)) {
           newStats.armor = newStats.maxArmor;
        } else if (newStats.maxArmor === null) {
           newStats.armor = null;
        }
      }
       if (key === 'maxMana') {
        if (newStats.maxMana !== null && (newStats.mana === null || newStats.mana > newStats.maxMana)) {
           newStats.mana = newStats.maxMana;
        } else if (newStats.maxMana === null) {
           newStats.mana = null;
        }
      }


      return newStats;
    });
  };

  // updateResistance agora aceita number | null (implementação completa na solicitação 2)
  const updateResistance = (key: keyof CharacterResistances, value: number | null) => {
    setResistances(prev => {
      if (!prev) return null;
      return { ...prev, [key]: value };
    });
  };


  const handleSave = () => {
    if (!stats || !resistances) return;

    // Converte EditableCharacterStats para CharacterStats, usando valores originais para nulls
    const finalStats: CharacterStats = {
      hp: stats.hp ?? selectedCharacter.initialStats.hp,
      maxHp: stats.maxHp ?? selectedCharacter.initialStats.maxHp,
      armor: stats.armor ?? selectedCharacter.initialStats.armor,
      maxArmor: stats.maxArmor ?? selectedCharacter.initialStats.maxArmor,
      manaRegeneration: stats.manaRegeneration ?? selectedCharacter.initialStats.manaRegeneration,
      mana: stats.mana ?? selectedCharacter.initialStats.mana,
      maxMana: stats.maxMana ?? selectedCharacter.initialStats.maxMana,
    };

     // Converte EditableCharacterResistances para CharacterResistances, usando valores originais para nulls (para step 2)
     const finalResistances: CharacterResistances = {
        freezing: resistances.freezing ?? selectedCharacter.resistances.freezing,
        shock: resistances.shock ?? selectedCharacter.resistances.shock,
        bleeding: resistances.bleeding ?? selectedCharacter.resistances.bleeding,
        flames: resistances.flames ?? selectedCharacter.resistances.flames,
        poison: resistances.poison ?? selectedCharacter.resistances.poison,
        stunning: resistances.stunning ?? selectedCharacter.resistances.stunning,
        blindness: resistances.blindness ?? selectedCharacter.resistances.blindness,
     };


    updateInitialStats(selectedCharacter.id, finalStats);
     updateResistances(selectedCharacter.id, finalResistances); // For step 2
  };

  return (
    <div className="bg-gray-800 text-white p-6 rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold mb-4 text-yellow-400">Editar {selectedCharacter.name}</h2>

      <div className="mb-6">
        <h3 className="text-xl font-semibold mb-3 text-yellow-400">Status Base</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <StatInput
            label="Vida Máxima"
            value={stats.maxHp} // Passa valor que pode ser null
            onChange={(value) => updateStat('maxHp', value)} // Recebe number | null
            icon={<Heart className="w-5 h-5 text-red-500" />}
            min={1}
          />

          <StatInput
            label="Armadura Máxima"
            value={stats.maxArmor} // Passa valor que pode ser null
            onChange={(value) => updateStat('maxArmor', value)} // Recebe number | null
            icon={<Shield className="w-5 h-5 text-blue-500" />}
            min={0}
          />

          <StatInput
            label="Regeneração de Mana"
            value={stats.manaRegeneration} // Passa valor que pode ser null
            onChange={(value) => updateStat('manaRegeneration', value)} // Recebe number | null
            icon={<Droplets className="w-5 h-5 text-blue-400" />}
            min={0}
            max={100}
          />

          <StatInput
            label="Mana Máxima"
            value={stats.maxMana} // Passa valor que pode ser null
            onChange={(value) => updateStat('maxMana', value)} // Recebe number | null
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
              {/* Resistance Inputs - using ResistanceInput which now accepts number | null */}
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