import React, { createContext, useReducer, useContext, ReactNode, useCallback, useEffect } from 'react';
import { Character, createDefaultCharacter } from '../types/character';
import { ActionType, CharacterAction } from '../types/actions';
import { characterReducer } from '../reducers/characterReducer';
import { historyReducer, HistoryState } from '../reducers/historyReducer';

interface CharacterContextProps {
  characters: Character[];
  selectedCharacter: Character | null;
  history: CharacterAction[];
  undoStack: CharacterAction[];
  redoStack: CharacterAction[];
  createCharacter: (name: string, initialStats?: Partial<Character['initialStats']>) => void;
  selectCharacter: (id: string) => void;
  updateCharacter: (character: Character) => void;
  deleteCharacter: (id: string) => void;
  applyDamage: (amount: number, trueDamage: boolean, repetitions: number) => void;
  advanceTurn: () => void;
  modifyHp: (operation: "set" | "increase" | "decrease", amount: number, isPercentage: boolean, exceedMax?: boolean) => void;
  modifyArmor: (operation: "set" | "increase" | "decrease", amount: number, isPercentage: boolean, exceedMax?: boolean) => void;
  modifyMana: (operation: "set" | "increase" | "decrease", amount: number, isPercentage: boolean, exceedMax?: boolean) => void;
  resetCharacter: () => void;
  updateInitialStats: (newStats: Partial<Character['initialStats']>) => void;
  undo: () => void;
  redo: () => void;
  canUndo: boolean;
  canRedo: boolean;
}

interface CharacterState {
  characters: Character[];
  selectedCharacterId: string | null;
}

const STORAGE_KEY = 'rpg-character-manager';

const loadFromStorage = (): CharacterState => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      const parsed = JSON.parse(stored);
      return {
        ...parsed,
        characters: parsed.characters.map((char: any) => ({
          ...char,
          createdAt: new Date(char.createdAt),
          updatedAt: new Date(char.updatedAt)
        }))
      };
    }
  } catch (error) {
    console.error('Error loading from storage:', error);
  }
  return {
    characters: [],
    selectedCharacterId: null
  };
};

const initialCharacterState: CharacterState = loadFromStorage();

const initialHistoryState: HistoryState = {
  history: [],
  undoStack: [],
  redoStack: []
};

const CharacterContext = createContext<CharacterContextProps | undefined>(undefined);

export const CharacterProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [characterState, dispatchCharacter] = useReducer(characterReducer, initialCharacterState);
  const [historyState, dispatchHistory] = useReducer(historyReducer, initialHistoryState);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(characterState));
  }, [characterState]);

  const selectedCharacter = characterState.selectedCharacterId 
    ? characterState.characters.find(c => c.id === characterState.selectedCharacterId) || null
    : null;

  const executeAction = useCallback((type: ActionType, payload: any) => {
    const action: Partial<CharacterAction> = {
      id: crypto.randomUUID(),
      type,
      timestamp: new Date(),
      characterId: selectedCharacter?.id || '',
      previousState: selectedCharacter || undefined,
      details: payload
    };
    
    dispatchCharacter({ type, payload: { ...payload, action } });
    
    const updatedCharacter = characterState.characters.find(c => c.id === action.characterId);
    if (updatedCharacter) {
      const fullAction: CharacterAction = {
        ...action as CharacterAction,
        currentState: updatedCharacter
      };
      dispatchHistory({ type: 'ADD_ACTION', payload: fullAction });
    }
  }, [characterState.characters, selectedCharacter]);

  const createCharacter = useCallback((name: string, initialStats?: Partial<Character['initialStats']>) => {
    const newCharacter = createDefaultCharacter(name);
    if (initialStats) {
      newCharacter.initialStats = { ...newCharacter.initialStats, ...initialStats };
      newCharacter.currentStats = { ...newCharacter.currentStats, ...initialStats };
    }
    dispatchCharacter({ 
      type: ActionType.CREATE_CHARACTER, 
      payload: { character: newCharacter } 
    });
    dispatchHistory({ 
      type: 'ADD_ACTION', 
      payload: {
        id: crypto.randomUUID(),
        type: ActionType.CREATE_CHARACTER,
        timestamp: new Date(),
        characterId: newCharacter.id,
        currentState: newCharacter,
        details: { name }
      }
    });
  }, []);

  const selectCharacter = useCallback((id: string) => {
    dispatchCharacter({ type: 'SELECT_CHARACTER', payload: { id } });
  }, []);

  const updateCharacter = useCallback((character: Character) => {
    executeAction(ActionType.UPDATE_CHARACTER, { character, changes: character });
  }, [executeAction]);

  const deleteCharacter = useCallback((id: string) => {
    const character = characterState.characters.find(c => c.id === id);
    if (character) {
      executeAction(ActionType.DELETE_CHARACTER, { id, name: character.name });
    }
  }, [characterState.characters, executeAction]);

  const applyDamage = useCallback((damageAmount: number, trueDamage: boolean, repetitions: number) => {
    if (!selectedCharacter) return;
    
    executeAction(ActionType.APPLY_DAMAGE, { 
      damageAmount, 
      trueDamage, 
      repetitions 
    });
  }, [executeAction, selectedCharacter]);

  const advanceTurn = useCallback(() => {
    if (!selectedCharacter) return;
    
    executeAction(ActionType.ADVANCE_TURN, {});
  }, [executeAction, selectedCharacter]);

  const modifyHp = useCallback((operation: "set" | "increase" | "decrease", amount: number, isPercentage: boolean, exceedMax: boolean = false) => {
    if (!selectedCharacter) return;
    
    executeAction(ActionType.MODIFY_HP, { 
      operation, 
      amount, 
      isPercentage,
      exceedMax,
      oldValue: selectedCharacter.currentStats.hp 
    });
  }, [executeAction, selectedCharacter]);

  const modifyArmor = useCallback((operation: "set" | "increase" | "decrease", amount: number, isPercentage: boolean, exceedMax: boolean = false) => {
    if (!selectedCharacter) return;
    
    executeAction(ActionType.MODIFY_ARMOR, { 
      operation, 
      amount, 
      isPercentage,
      exceedMax,
      oldValue: selectedCharacter.currentStats.armor 
    });
  }, [executeAction, selectedCharacter]);

  const modifyMana = useCallback((operation: "set" | "increase" | "decrease", amount: number, isPercentage: boolean, exceedMax: boolean = false) => {
    if (!selectedCharacter) return;
    
    executeAction(ActionType.MODIFY_MANA, { 
      operation, 
      amount, 
      isPercentage,
      exceedMax,
      oldValue: selectedCharacter.currentStats.mana 
    });
  }, [executeAction, selectedCharacter]);

  const resetCharacter = useCallback(() => {
    if (!selectedCharacter) return;
    
    executeAction(ActionType.RESET_CHARACTER, {
      changedStats: { ...selectedCharacter.currentStats }
    });
  }, [executeAction, selectedCharacter]);

  const updateInitialStats = useCallback((newStats: Partial<Character['initialStats']>) => {
    if (!selectedCharacter) return;
    
    const updatedCharacter: Character = {
      ...selectedCharacter,
      initialStats: { ...selectedCharacter.initialStats, ...newStats },
      currentStats: {
        ...selectedCharacter.currentStats,
        maxHp: newStats.maxHp || selectedCharacter.currentStats.maxHp,
        maxArmor: newStats.maxArmor || selectedCharacter.currentStats.maxArmor,
        maxMana: newStats.maxMana || selectedCharacter.currentStats.maxMana,
        manaRegeneration: newStats.manaRegeneration !== undefined ? newStats.manaRegeneration : selectedCharacter.currentStats.manaRegeneration
      },
      updatedAt: new Date()
    };
    
    executeAction(ActionType.UPDATE_INITIAL_STATS, {
      oldStats: selectedCharacter.initialStats,
      newStats: updatedCharacter.initialStats,
      character: updatedCharacter
    });
  }, [executeAction, selectedCharacter]);

  const undo = useCallback(() => {
    if (historyState.undoStack.length === 0) return;
    
    const lastAction = historyState.undoStack[historyState.undoStack.length - 1];
    if (lastAction.previousState) {
      dispatchCharacter({ 
        type: 'RESTORE_CHARACTER', 
        payload: { character: lastAction.previousState } 
      });
      dispatchHistory({ type: 'UNDO' });
    }
  }, [historyState.undoStack]);

  const redo = useCallback(() => {
    if (historyState.redoStack.length === 0) return;
    
    const nextAction = historyState.redoStack[historyState.redoStack.length - 1];
    if (nextAction.currentState) {
      dispatchCharacter({ 
        type: 'RESTORE_CHARACTER', 
        payload: { character: nextAction.currentState } 
      });
      dispatchHistory({ type: 'REDO' });
    }
  }, [historyState.redoStack]);

  const value = {
    characters: characterState.characters,
    selectedCharacter,
    history: historyState.history,
    undoStack: historyState.undoStack,
    redoStack: historyState.redoStack,
    createCharacter,
    selectCharacter,
    updateCharacter,
    deleteCharacter,
    applyDamage,
    advanceTurn,
    modifyHp,
    modifyArmor,
    modifyMana,
    resetCharacter,
    updateInitialStats,
    undo,
    redo,
    canUndo: historyState.undoStack.length > 0,
    canRedo: historyState.redoStack.length > 0,
  };

  return (
    <CharacterContext.Provider value={value}>
      {children}
    </CharacterContext.Provider>
  );
};

export const useCharacters = () => {
  const context = useContext(CharacterContext);
  if (context === undefined) {
    throw new Error('useCharacters must be used within a CharacterProvider');
  }
  return context;
};