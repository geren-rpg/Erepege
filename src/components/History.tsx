import React from 'react';
import { useCharacters } from '../contexts/CharacterContext';
// Importar todas as interfaces de detalhes de ação
import { ActionType, CharacterAction, CreateCharacterDetails, DeleteCharacterDetails, ApplyDamageDetails, AdvanceTurnDetails, ModifyStatDetails, ResetCharacterDetails, UpdateInitialStatsDetails, UpdateResistancesDetails } from '../types/actions';
import { Clock, AlertTriangle, Info, Shield } from 'lucide-react'; // Importar Shield para o ícone de resistência

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
        // Usar asserção de tipo para acessar propriedades com segurança
        const createDetails = details as CreateCharacterDetails;
        return `Personagem "${createDetails.name}" foi criado`;
        
      case ActionType.UPDATE_CHARACTER:
        // Detalhes genéricos, manter descrição simples
        return `Detalhes do personagem foram atualizados`;
        
      case ActionType.DELETE_CHARACTER:
        const deleteDetails = details as DeleteCharacterDetails;
        return `Personagem "${deleteDetails.name}" foi deletado`;
        
      case ActionType.APPLY_DAMAGE: {
        const damageDetails = details as ApplyDamageDetails;
        // Acessar propriedades tipadas
        return `Aplicou ${damageDetails.totalDamage} de dano (${damageDetails.repetitions}×${damageDetails.damageAmount}) 
                ${damageDetails.trueDamage ? '(dano verdadeiro)' : ''}. 
                Armadura: ${damageDetails.finalArmor}, Vida: ${damageDetails.finalHp}`;
      }
        
      case ActionType.ADVANCE_TURN:
        const advanceDetails = details as AdvanceTurnDetails;
        return `Avançou turno, regenerou ${advanceDetails.manaRegained} de mana`;
        
      case ActionType.MODIFY_HP:
      case ActionType.MODIFY_ARMOR:
      case ActionType.MODIFY_MANA: {
        const modifyDetails = details as ModifyStatDetails;
        const operation = modifyDetails.operation === 'set' ? 'Definiu' :
                         modifyDetails.operation === 'increase' ? 'Aumentou' : 'Diminuiu';
        const statName = modifyDetails.statType === 'hp' ? 'Vida' :
                         modifyDetails.statType === 'armor' ? 'Armadura' : 'Mana';
         // Acessar propriedades tipadas
        return `${operation} ${statName} em ${modifyDetails.amount}${modifyDetails.isPercentage ? '%' : ''} 
                (${modifyDetails.oldValue} → ${modifyDetails.newValue})`;
      }
        
      case ActionType.RESET_CHARACTER:
        return `Status do personagem foram resetados para os valores iniciais`;
        
      case ActionType.UPDATE_INITIAL_STATS:
         // Detalhes incluem oldStats e newStats, poderia mostrar mudanças específicas se desejado
        return `Status iniciais foram atualizados`;
        
      case ActionType.UPDATE_RESISTANCES: { // Novo case para UPDATE_RESISTANCES
          const resistanceDetails = details as UpdateResistancesDetails;
          const changes: string[] = [];
          // Iterar sobre as resistências para encontrar as mudanças
          for (const key in resistanceDetails.newResistances) {
            const type = key as keyof UpdateResistancesDetails['newResistances'];
            if (resistanceDetails.newResistances[type] !== resistanceDetails.oldResistances[type]) {
               changes.push(`${type}: ${resistanceDetails.oldResistances[type]} → ${resistanceDetails.newResistances[type]}`);
            }
          }
           if (changes.length > 0) {
             return `Resistências atualizadas: ${changes.join(', ')}`;
           } else {
             return `Resistências foram atualizadas (sem mudanças)`;
           }
      }


      default:
        // Logar ações desconhecidas para depuração futura
        console.warn("Unknown action type in history:", type, details);
        return `Ação desconhecida (Tipo: ${type})`;
    }
  };
  
  const getActionIcon = (action: CharacterAction) => {
    const { type } = action;
    
    switch (type) {
      case ActionType.APPLY_DAMAGE:
        return <AlertTriangle size={16} className="text-red-500" />;
      case ActionType.ADVANCE_TURN:\
        return <Clock size={16} className="text-blue-400" />;
      case ActionType.UPDATE_RESISTANCES: // Ícone para atualização de resistências
         return <Shield size={16} className="text-green-400" />;
      default:\
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