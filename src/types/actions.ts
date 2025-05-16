import { Character, CharacterStats } from "./character";

export enum ActionType {
  CREATE_CHARACTER = "CREATE_CHARACTER",
  UPDATE_CHARACTER = "UPDATE_CHARACTER",
  DELETE_CHARACTER = "DELETE_CHARACTER",
  APPLY_DAMAGE = "APPLY_DAMAGE",
  ADVANCE_TURN = "ADVANCE_TURN",
  MODIFY_HP = "MODIFY_HP",
  MODIFY_ARMOR = "MODIFY_ARMOR",
  MODIFY_MANA = "MODIFY_MANA",
  RESET_CHARACTER = "RESET_CHARACTER",
  UPDATE_INITIAL_STATS = "UPDATE_INITIAL_STATS",
}

export interface CharacterAction {
  id: string;
  type: ActionType;
  timestamp: Date;
  characterId: string;
  previousState?: Character;
  currentState: Character;
  details: ActionDetails;
}

export type ActionDetails =
  | CreateCharacterDetails
  | UpdateCharacterDetails
  | DeleteCharacterDetails
  | ApplyDamageDetails
  | AdvanceTurnDetails
  | ModifyStatDetails
  | ResetCharacterDetails
  | UpdateInitialStatsDetails;

export interface CreateCharacterDetails {
  name: string;
}

export interface UpdateCharacterDetails {
  changes: Partial<Character>;
}

export interface DeleteCharacterDetails {
  name: string;
}

export interface ApplyDamageDetails {
  damageAmount: number;
  trueDamage: boolean;
  repetitions: number;
  finalArmor: number;
  finalHp: number;
  totalDamage: number;
}

export interface AdvanceTurnDetails {
  manaRegained: number;
}

export interface ModifyStatDetails {
  statType: "hp" | "armor" | "mana";
  operation: "set" | "increase" | "decrease";
  amount: number;
  isPercentage: boolean;
  exceedMax: boolean;
  oldValue: number;
  newValue: number;
}

export interface ResetCharacterDetails {
  changedStats: Partial<CharacterStats>;
}

export interface UpdateInitialStatsDetails {
  oldStats: CharacterStats;
  newStats: CharacterStats;
}