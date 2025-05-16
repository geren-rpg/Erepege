import React from 'react';
import { useCharacters } from '../contexts/CharacterContext';
import CharacterCard from './CharacterCard';
import { Plus } from 'lucide-react';

const CharacterList: React.FC = () => {
  const { characters, selectedCharacter } = useCharacters();

  if (characters.length === 0) {
    return (
      <div className="bg-gray-800 text-white p-6 rounded-lg shadow-lg text-center">
        <h2 className="text-xl font-semibold mb-4">Nenhum Personagem</h2>
        <p className="text-gray-400 mb-4">Crie seu primeiro personagem para começar</p>
        <div className="flex justify-center">
          <button
            className="flex items-center gap-2 px-4 py-2 bg-yellow-600 text-white rounded-lg 
                      hover:bg-yellow-700 transition-colors duration-200"
            onClick={() => document.getElementById('create-character-section')?.scrollIntoView({ behavior: 'smooth' })}
          >
            <Plus size={18} />
            Criar Personagem
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-800 text-white p-6 rounded-lg shadow-lg">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold text-yellow-400">Seus Personagens</h2>
        <button
          className="flex items-center gap-2 px-3 py-1 bg-yellow-600 text-white rounded-lg 
                    hover:bg-yellow-700 transition-colors duration-200 text-sm"
          onClick={() => document.getElementById('create-character-section')?.scrollIntoView({ behavior: 'smooth' })}
        >
          <Plus size={16} />
          Novo
        </button>
      </div>
      
      <div className="grid grid-cols-1 gap-4">
        {characters.map(character => (
          <CharacterCard key={character.id} character={character} />
        ))}
      </div>
    </div>
  );
};

export default CharacterList;