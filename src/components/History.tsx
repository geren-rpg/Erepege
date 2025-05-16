import React from 'react';
import { useCharacters } from '../contexts/CharacterContext';
import { ActionType, CharacterAction } from '../types/actions';
import { Clock, AlertTriangle, Info } from 'lucide-react';

const History: React.FC = () => {
  const { history, selectedCharacter } = useCharacters();
  
  const characterHistory = selectedCharacter 
    ? history.filter(action => action.characterId === selectedCharacter.id)
    : [];
  
  if (!selectedCharacter) {
    return (
      <div className="bg-gray-800 text-white p-6 rounded-lg shadow-lg text-center">
        <p className="text-gray-400">Selecione um personagem para ver o histórico</p>
      </div>
    );
  }
  
  const getActionDescription = (action: CharacterAction): string => {
    const { type, details } = action;
    
    switch (type) {
      case ActionType.CREATE_CHARACTER:
        return `Personagem "${(details as any).name}" foi criado`;
        
      case ActionType.UPDATE_CHARACTER:
        return `Detalhes do personagem foram atualizados`;
        
      case ActionType.DELETE_CHARACTER:
        return `Personagem "${(details as any).name}" foi deletado`;
        
      case ActionType.APPLY_DAMAGE: {
        const damageDetails = details as any;
        return `Aplicou ${damageDetails.totalDamage} de dano (${damageDetails.repetitions}×${damageDetails.damageAmount}) 
                ${damageDetails.trueDamage ? '(dano verdadeiro)' : ''}. 
                Armadura: ${damageDetails.finalArmor}, Vida: ${damageDetails.finalHp}`;
      }
        
      case ActionType.ADVANCE_TURN:
        return `Avançou turno, regenerou ${(details as any).manaRegained} de mana`;
        
      case ActionType.MODIFY_HP: {
        const hpDetails = details as any;
        const operation = hpDetails.operation === 'set' ? 'Definiu' :
                         hpDetails.operation === 'increase' ? 'Aumentou' : 'Diminuiu';
        return `${operation} Vida em ${hpDetails.amount}${hpDetails.isPercentage ? '%' : ''} 
                (${hpDetails.oldValue} → ${hpDetails.newValue})`;
      }
        
      case ActionType.MODIFY_ARMOR: {
        const armorDetails = details as any;
        const operation = armorDetails.operation === 'set' ? 'Definiu' :
                         armorDetails.operation === 'increase' ? 'Aumentou' : 'Diminuiu';
        return `${operation} Armadura em ${armorDetails.amount}${armorDetails.isPercentage ? '%' : ''} 
                (${armorDetails.oldValue} → ${armorDetails.newValue})`;
      }

      case ActionType.MODIFY_MANA: {
        const manaDetails = details as any;
        const operation = manaDetails.operation === 'set' ? 'Definiu' :
                         manaDetails.operation === 'increase' ? 'Aumentou' : 'Diminuiu';
        return `${operation} Mana em ${manaDetails.amount}${manaDetails.isPercentage ? '%' : ''} 
                (${manaDetails.oldValue} → ${manaDetails.newValue})`;
      }
        
      case ActionType.RESET_CHARACTER:
        return `Status do personagem foram resetados para os valores iniciais`;
        
      case ActionType.UPDATE_INITIAL_STATS:
        return `Status iniciais foram atualizados`;
        
      default:
        return 'Ação desconhecida';
    }
  };
  
  const getActionIcon = (action: CharacterAction) => {
    const { type } = action;
    
    switch (type) {
      case ActionType.APPLY_DAMAGE:
        return <AlertTriangle size={16} className="text-red-500" />;
      case ActionType.ADVANCE_TURN:
        return <Clock size={16} className="text-blue-400" />;
      default:
        return <Info size={16} className="text-gray-400" />;
    }
  };
  
  const formatTimestamp = (date: Date): string => {
    return new Date(date).toLocaleString('pt-BR', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false
    });
  };
  
  if (characterHistory.length === 0) {
    return (
      <div className="bg-gray-800 text-white p-6 rounded-lg shadow-lg">
        <h2 className="text-2xl font-bold mb-4 text-yellow-400">Histórico</h2>
        <p className="text-gray-400 text-center py-4">Nenhum registro disponível</p>
      </div>
    );
  }
  
  return (
    <div className="bg-gray-800 text-white p-6 rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold mb-4 text-yellow-400">Histórico</h2>
      
      <div className="overflow-y-auto max-h-96 pr-2 scrollbar">
        <table className="w-full text-sm">
          <thead className="text-xs uppercase text-gray-400 border-b border-gray-700">
            <tr>
              <th className="pb-2 text-left">Hora</th>
              <th className="pb-2 text-left">Ação</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-700">
            {characterHistory.slice().reverse().map((action) => (
              <tr key={action.id} className="hover:bg-gray-700/50">
                <td className="py-2 text-gray-300 whitespace-nowrap">
                  {formatTimestamp(action.timestamp)}
                </td>
                <td className="py-2 flex items-start">
                  <span className="mr-2 mt-1">{getActionIcon(action)}</span>
                  <span>{getActionDescription(action)}</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default History;