import { Character } from '../types/character';
import { ActionType } from '../types/actions';

export interface CharacterState {
  characters: Character[];
  selectedCharacterId: string | null;
}

type CharacterAction = 
  | { type: ActionType.CREATE_CHARACTER; payload: { character: Character } }
  | { type: 'SELECT_CHARACTER'; payload: { id: string } }
  | { type: ActionType.UPDATE_CHARACTER; payload: { character: Character } }
  | { type: ActionType.DELETE_CHARACTER; payload: { id: string } }
  | { type: ActionType.APPLY_DAMAGE; payload: { 
      damageAmount: number; 
      trueDamage: boolean; 
      repetitions: number;
      action: any;
    } 
  }
  | { type: ActionType.ADVANCE_TURN; payload: { action: any } }
  | { type: ActionType.MODIFY_HP; payload: { 
      operation: "set" | "increase" | "decrease"; 
      amount: number; 
      isPercentage: boolean;
      exceedMax: boolean;
      action: any;
    } 
  }
  | { type: ActionType.MODIFY_ARMOR; payload: { 
      operation: "set" | "increase" | "decrease"; 
      amount: number; 
      isPercentage: boolean;
      exceedMax: boolean;
      action: any;
    } 
  }
  | { type: ActionType.MODIFY_MANA; payload: { 
      operation: "set" | "increase" | "decrease"; 
      amount: number; 
      isPercentage: boolean;
      exceedMax: boolean;
      action: any;
    } 
  }
  | { type: ActionType.RESET_CHARACTER; payload: { action: any } }
  | { type: ActionType.UPDATE_INITIAL_STATS; payload: { 
      newStats: Partial<Character['initialStats']>;
      character: Character;
      action: any;
    } 
  }
  | { type: 'RESTORE_CHARACTER'; payload: { character: Character } };

const calculateNewValue = (
  operation: "set" | "increase" | "decrease",
  currentValue: number,
  amount: number,
  maxValue: number,
  isPercentage: boolean,
  exceedMax: boolean
): number => {
  let newValue = currentValue;
  
  if (isPercentage) {
    const percentageAmount = maxValue * (amount / 100);
    
    switch (operation) {
      case "set":
        newValue = percentageAmount;
        break;
      case "increase":
        newValue = currentValue + percentageAmount;
        break;
      case "decrease":
        newValue = currentValue - percentageAmount;
        break;
    }
  } else {
    switch (operation) {
      case "set":
        newValue = amount;
        break;
      case "increase":
        newValue = currentValue + amount;
        break;
      case "decrease":
        newValue = currentValue - amount;
        break;
    }
  }
  
  return exceedMax ? Math.max(0, newValue) : Math.min(maxValue, Math.max(0, newValue));
};

export const characterReducer = (state: CharacterState, action: CharacterAction): CharacterState => {
  switch (action.type) {
    case ActionType.CREATE_CHARACTER:
      return {
        ...state,
        characters: [...state.characters, action.payload.character],
        selectedCharacterId: action.payload.character.id
      };

    case 'SELECT_CHARACTER':
      return {
        ...state,
        selectedCharacterId: action.payload.id
      };

    case ActionType.UPDATE_CHARACTER:
      return {
        ...state,
        characters: state.characters.map(char => 
          char.id === action.payload.character.id 
            ? action.payload.character 
            : char
        )
      };

    case ActionType.DELETE_CHARACTER: {
      const newCharacters = state.characters.filter(char => char.id !== action.payload.id);
      const newSelectedId = state.selectedCharacterId === action.payload.id
        ? (newCharacters.length > 0 ? newCharacters[0].id : null)
        : state.selectedCharacterId;
        
      return {
        ...state,
        characters: newCharacters,
        selectedCharacterId: newSelectedId
      };
    }

    case ActionType.APPLY_DAMAGE: {
      if (!state.selectedCharacterId) return state;
      
      const character = state.characters.find(c => c.id === state.selectedCharacterId);
      if (!character) return state;
      
      const { damageAmount, trueDamage, repetitions } = action.payload;
      
      let remainingArmor = character.currentStats.armor;
      let remainingHp = character.currentStats.hp;
      let totalDamage = 0;
      
      for (let i = 0; i < repetitions; i++) {
        if (trueDamage) {
          remainingHp = Math.max(0, remainingHp - damageAmount);
          totalDamage += damageAmount;
        } else {
          if (remainingArmor > 0) {
            if (damageAmount <= remainingArmor) {
              remainingArmor -= damageAmount;
              totalDamage += damageAmount;
            } else {
              const remainingDamage = damageAmount - remainingArmor;
              totalDamage += damageAmount;
              remainingArmor = 0;
              remainingHp = Math.max(0, remainingHp - remainingDamage);
            }
          } else {
            remainingHp = Math.max(0, remainingHp - damageAmount);
            totalDamage += damageAmount;
          }
        }
      }
      
      if (action.payload.action) {
        action.payload.action.details = {
          ...action.payload.action.details,
          finalArmor: remainingArmor,
          finalHp: remainingHp,
          totalDamage
        };
      }
      
      const updatedCharacter: Character = {
        ...character,
        currentStats: {
          ...character.currentStats,
          armor: remainingArmor,
          hp: remainingHp
        },
        updatedAt: new Date()
      };
      
      return {
        ...state,
        characters: state.characters.map(c => 
          c.id === updatedCharacter.id ? updatedCharacter : c
        )
      };
    }

    case ActionType.ADVANCE_TURN: {
      if (!state.selectedCharacterId) return state;
      
      const character = state.characters.find(c => c.id === state.selectedCharacterId);
      if (!character) return state;
      
      const manaRegenerationPercent = character.currentStats.manaRegeneration;
      const currentMana = character.currentStats.mana;
      const maxMana = character.currentStats.maxMana;
      
      const manaToRegenerate = Math.floor(maxMana * (manaRegenerationPercent / 100));
      const newMana = Math.min(maxMana, currentMana + manaToRegenerate);
      
      if (action.payload.action) {
        action.payload.action.details = {
          manaRegained: newMana - currentMana
        };
      }
      
      const updatedCharacter: Character = {
        ...character,
        currentStats: {
          ...character.currentStats,
          mana: newMana
        },
        updatedAt: new Date()
      };
      
      return {
        ...state,
        characters: state.characters.map(c => 
          c.id === updatedCharacter.id ? updatedCharacter : c
        )
      };
    }

    case ActionType.MODIFY_HP:
    case ActionType.MODIFY_ARMOR:
    case ActionType.MODIFY_MANA: {
      if (!state.selectedCharacterId) return state;
      
      const character = state.characters.find(c => c.id === state.selectedCharacterId);
      if (!character) return state;
      
      const { operation, amount, isPercentage, exceedMax } = action.payload;
      
      const statType = action.type === ActionType.MODIFY_HP ? 'hp' :
                      action.type === ActionType.MODIFY_ARMOR ? 'armor' : 'mana';
      
      const currentValue = character.currentStats[statType];
      const maxValue = character.currentStats[`max${statType.charAt(0).toUpperCase() + statType.slice(1)}`];
      
      const newValue = calculateNewValue(
        operation,
        currentValue,
        amount,
        maxValue,
        isPercentage,
        exceedMax
      );
      
      if (action.payload.action) {
        action.payload.action.details = {
          ...action.payload.action.details,
          statType,
          newValue
        };
      }
      
      const updatedCharacter: Character = {
        ...character,
        currentStats: {
          ...character.currentStats,
          [statType]: newValue
        },
        updatedAt: new Date()
      };
      
      return {
        ...state,
        characters: state.characters.map(c => 
          c.id === updatedCharacter.id ? updatedCharacter : c
        )
      };
    }

    case ActionType.RESET_CHARACTER: {
      if (!state.selectedCharacterId) return state;
      
      const character = state.characters.find(c => c.id === state.selectedCharacterId);
      if (!character) return state;
      
      const updatedCharacter: Character = {
        ...character,
        currentStats: { 
          ...character.initialStats,
          hp: character.initialStats.maxHp,
          armor: character.initialStats.maxArmor,
          mana: character.initialStats.maxMana
        },
        updatedAt: new Date()
      };
      
      return {
        ...state,
        characters: state.characters.map(c => 
          c.id === updatedCharacter.id ? updatedCharacter : c
        )
      };
    }

    case ActionType.UPDATE_INITIAL_STATS: {
      if (!state.selectedCharacterId) return state;
      
      return {
        ...state,
        characters: state.characters.map(char => 
          char.id === state.selectedCharacterId 
            ? action.payload.character
            : char
        )
      };
    }

    case 'RESTORE_CHARACTER':
      return {
        ...state,
        characters: state.characters.map(char => 
          char.id === action.payload.character.id 
            ? action.payload.character 
            : char
        ),
        selectedCharacterId: action.payload.character.id
      };

    default:
      return state;
  }
};