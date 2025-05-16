import { CharacterAction } from '../types/actions';

export interface HistoryState {
  history: CharacterAction[];
  undoStack: CharacterAction[];
  redoStack: CharacterAction[];
}

type HistoryAction = 
  | { type: 'ADD_ACTION'; payload: CharacterAction }
  | { type: 'UNDO' }
  | { type: 'REDO' };

export const historyReducer = (state: HistoryState, action: HistoryAction): HistoryState => {
  switch (action.type) {
    case 'ADD_ACTION':
      return {
        history: [...state.history, action.payload],
        undoStack: [...state.undoStack, action.payload],
        redoStack: [] // Clear redo stack when a new action is performed
      };
      
    case 'UNDO':
      if (state.undoStack.length === 0) return state;
      
      const lastAction = state.undoStack[state.undoStack.length - 1];
      
      return {
        ...state,
        undoStack: state.undoStack.slice(0, -1),
        redoStack: [...state.redoStack, lastAction]
      };
      
    case 'REDO':
      if (state.redoStack.length === 0) return state;
      
      const nextAction = state.redoStack[state.redoStack.length - 1];
      
      return {
        ...state,
        undoStack: [...state.undoStack, nextAction],
        redoStack: state.redoStack.slice(0, -1)
      };
      
    default:
      return state;
  }
};