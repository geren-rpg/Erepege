import React, { useState } from 'react';
import { useCharacters } from '../../contexts/CharacterContext';
import ApplyDamageModal from './ApplyDamageModal';
import ModifyStatModal from './ModifyStatModal';
import { 
  Sword, 
  SkipForward, 
  Heart, 
  Shield, 
  RotateCcw, 
  Undo2, 
  Redo2,
  Zap
} from 'lucide-react';

const CharacterActions: React.FC = () => {
  const { 
    selectedCharacter, 
    advanceTurn, 
    undo, 
    redo, 
    canUndo, 
    canRedo 
  } = useCharacters();
  
  const [isDamageModalOpen, setIsDamageModalOpen] = useState(false);
  const [isHpModalOpen, setIsHpModalOpen] = useState(false);
  const [isArmorModalOpen, setIsArmorModalOpen] = useState(false);
  const [isManaModalOpen, setIsManaModalOpen] = useState(false);
  
  if (!selectedCharacter) {
    return (
      <div className="bg-gray-800 text-white p-6 rounded-lg shadow-lg text-center">
        <p className="text-gray-400">Selecione um personagem para realizar ações</p>
      </div>
    );
  }
  
  return (
    <div className="bg-gray-800 text-white p-6 rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold mb-4 text-yellow-400">Ações</h2>
      
      <div className="grid grid-cols-3 md:grid-cols-4 gap-3">
        <button
          onClick={() => setIsDamageModalOpen(true)}
          className="flex flex-col items-center justify-center p-3 bg-red-900/50 hover:bg-red-800 
                     text-white rounded-lg transition-colors text-center gap-1 text-sm"
        >
          <Sword size={20} className="text-red-400" />
          <span>Dano</span>
        </button>
        
        <button
          onClick={advanceTurn}
          className="flex flex-col items-center justify-center p-3 bg-purple-900/50 hover:bg-purple-800 
                     text-white rounded-lg transition-colors text-center gap-1 text-sm"
        >
          <SkipForward size={20} className="text-purple-400" />
          <span>Próximo</span>
        </button>
        
        <button
          onClick={() => setIsHpModalOpen(true)}
          className="flex flex-col items-center justify-center p-3 bg-green-900/50 hover:bg-green-800 
                     text-white rounded-lg transition-colors text-center gap-1 text-sm"
        >
          <Heart size={20} className="text-green-400" />
          <span>Vida</span>
        </button>
        
        <button
          onClick={() => setIsArmorModalOpen(true)}
          className="flex flex-col items-center justify-center p-3 bg-blue-900/50 hover:bg-blue-800 
                     text-white rounded-lg transition-colors text-center gap-1 text-sm"
        >
          <Shield size={20} className="text-blue-400" />
          <span>Armadura</span>
        </button>

        <button
          onClick={() => setIsManaModalOpen(true)}
          className="flex flex-col items-center justify-center p-3 bg-indigo-900/50 hover:bg-indigo-800 
                     text-white rounded-lg transition-colors text-center gap-1 text-sm"
        >
          <Zap size={20} className="text-indigo-400" />
          <span>Mana</span>
        </button>
        
        <div className="flex items-center justify-center gap-2">
          <button
            onClick={undo}
            disabled={!canUndo}
            className={`p-2 rounded-lg flex items-center justify-center
                       ${canUndo 
                         ? 'bg-gray-700 hover:bg-gray-600 text-gray-300 hover:text-white' 
                         : 'bg-gray-800 text-gray-600 cursor-not-allowed'}`}
            title="Desfazer (Ctrl+Z)"
          >
            <Undo2 size={20} />
          </button>
          
          <button
            onClick={redo}
            disabled={!canRedo}
            className={`p-2 rounded-lg flex items-center justify-center
                       ${canRedo 
                         ? 'bg-gray-700 hover:bg-gray-600 text-gray-300 hover:text-white' 
                         : 'bg-gray-800 text-gray-600 cursor-not-allowed'}`}
            title="Refazer (Ctrl+Y)"
          >
            <Redo2 size={20} />
          </button>
        </div>
      </div>
      
      <ApplyDamageModal 
        isOpen={isDamageModalOpen} 
        onClose={() => setIsDamageModalOpen(false)} 
      />
      
      <ModifyStatModal 
        isOpen={isHpModalOpen} 
        onClose={() => setIsHpModalOpen(false)}
        statType="hp"
        title="Modificar Vida"
        allowExceedMax
      />
      
      <ModifyStatModal 
        isOpen={isArmorModalOpen} 
        onClose={() => setIsArmorModalOpen(false)}
        statType="armor"
        title="Modificar Armadura"
        allowExceedMax
      />

      <ModifyStatModal 
        isOpen={isManaModalOpen} 
        onClose={() => setIsManaModalOpen(false)}
        statType="mana"
        title="Modificar Mana"
        allowExceedMax
      />
    </div>
  );
};

export default CharacterActions;