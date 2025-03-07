export interface SimpleCard {
  oracleId: string;
  name: string;
  manaCost: string;
  typeLine: string;
  oracleText: string;
}

export interface Card {
  id: number;
  oracleId: string;
  name: string;
  oracleText: string;
  typeLine: string;
  manaCost?: string;
  cmc: number;
  colors: string[];
  colorIdentity: string[];
  keywords: string[];
  power?: string;
  toughness?: string;
  imageUrl?: string;
  artist: string;
  set: string;
  setNumber: string;
  rarity: string;
  createdAt: Date;
  updatedAt: Date;
}

export function toSimpleCard(card: Card | { 
  oracleId: string;
  name: string;
  typeLine: string;
  oracleText: string;
  manaCost: string | null;
}): SimpleCard {
  return {
    oracleId: card.oracleId,
    name: card.name,
    manaCost: card.manaCost ?? '',
    typeLine: card.typeLine,
    oracleText: card.oracleText
  };
} 