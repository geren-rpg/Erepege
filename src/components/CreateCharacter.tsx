import React, { useState } from 'react';
import { useCharacters } from '../contexts/CharacterContext';
import { CharacterStats, DEFAULT_STATS, DEFAULT_RESISTANCES, CharacterResistances } from '../types/character';
import { Shield, Zap, Heart, Droplets } from 'lucide-react';
import StatInput from './ui/StatInput';
import ResistanceInput from './ui/ResistanceInput';

// Define tipos temporários para os estados que permitem null para os números
type DraftCharacterStats = {
  [K in keyof CharacterStats]: number | null;
};

// Adicionado tipo que permite null para as resistências no estado de criação
type DraftCharacterResistances = {
  [K in keyof CharacterResistances]: number | null;
};


const CreateCharacter: React.FC = () => {
  const { createCharacter } = useCharacters();
  const [name, setName] = useState('');
  // Inicializa o estado de stats com os valores padrão, permitindo null
  const [stats, setStats] = useState<DraftCharacterStats>({...DEFAULT_STATS});
  // Inicializa o estado de resistances com os valores padrão, permitindo null
  const [resistances, setResistances] = useState<DraftCharacterResistances>({...DEFAULT_RESISTANCES});
  const [showAdvanced, setShowAdvanced] = useState(false);

  const handleCreateCharacter = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name) return;

    // Cria um objeto CharacterStats final, usando valores padrão para null
    const finalStats: CharacterStats = {
      hp: stats.hp ?? DEFAULT_STATS.hp,
      maxHp: stats.maxHp ?? DEFAULT_STATS.maxHp,
      armor: stats.armor ?? DEFAULT_STATS.armor,
      maxArmor: stats.maxArmor ?? DEFAULT_STATS.maxArmor,
      manaRegeneration: stats.manaRegeneration ?? DEFAULT_STATS.manaRegeneration,
      mana: stats.mana ?? DEFAULT_STATS.mana,
      maxMana: stats.maxMana ?? DEFAULT_STATS.maxMana,
    };

     // Cria um objeto CharacterResistances final, usando valores padrão para null
     const finalResistances: CharacterResistances = {
        freezing: resistances.freezing ?? DEFAULT_RESISTANCES.freezing,
        shock: resistances.shock ?? DEFAULT_RESISTANCES.shock,
        bleeding: resistances.bleeding ?? DEFAULT_RESISTANCES.bleeding,
        flames: resistances.flames ?? DEFAULT_RESISTANCES.flames,
        poison: resistances.poison ?? DEFAULT_RESISTANCES.poison,
        stunning: resistances.stunning ?? DEFAULT_RESISTANCES.stunning,
        blindness: resistances.blindness ?? DEFAULT_RESISTANCES.blindness,
     };


    // Passa os stats e resistances finais para createCharacter
    createCharacter(name, finalStats, finalResistances);

    // Reseta o formulário para os valores padrão (não null)
    setName('');
    setStats({...DEFAULT_STATS});
    setResistances({...DEFAULT_RESISTANCES});
  };

  // updateStat aceita number | null
  const updateStat = (key: keyof CharacterStats, value: number | null) => {
    setStats(prev => {
      const newStats = { ...prev, [key]: value };

      // Lógica para manter a consistência entre max e valor atual, lidando com null
      if (key === 'maxHp') {
        if (newStats.maxHp !== null && (newStats.hp === null || newStats.hp > newStats.maxHp)) {
           newStats.hp = newStats.maxHp;
        } else if (newStats.maxHp === null) {
           newStats.hp = null;
        }
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

  // updateResistance agora aceita number | null
  const updateResistance = (key: keyof CharacterResistances, value: number | null) => {
    setResistances(prev => ({ ...prev, [key]: value }));
  };

  return (...
);
};

export default CreateCharacter;