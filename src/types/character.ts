export interface Character {
  id: string;
  name: string;
  initialStats: CharacterStats;
  currentStats: CharacterStats;
  resistances: CharacterResistances;
  createdAt: Date;
  updatedAt: Date;
}

export interface CharacterStats {
  hp: number;
  maxHp: number;
  armor: number;
  maxArmor: number;
  manaRegeneration: number;
  mana: number;
  maxMana: number;
}

export interface CharacterResistances {
  freezing: number;
  shock: number;
  bleeding: number;
  flames: number;
  poison: number;
  stunning: number;
  blindness: number;
}

export const DEFAULT_RESISTANCES: CharacterResistances = {
  freezing: 100,
  shock: 100,
  bleeding: 100,
  flames: 100,
  poison: 100,
  stunning: 100,
  blindness: 100,
};

export const DEFAULT_STATS: CharacterStats = {
  hp: 80,
  maxHp: 80,
  armor: 20,
  maxArmor: 20,
  manaRegeneration: 30,
  mana: 100,
  maxMana: 100,
};

export const createDefaultCharacter = (name: string = "Novo Personagem"): Character => ({
  id: crypto.randomUUID(),
  name,
  initialStats: { ...DEFAULT_STATS },
  currentStats: { ...DEFAULT_STATS },
  resistances: { ...DEFAULT_RESISTANCES },
  createdAt: new Date(),
  updatedAt: new Date(),
});