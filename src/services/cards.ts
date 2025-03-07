import axios from 'axios';
import { ScryfallCard } from '../types/scryfall';
import { Card } from '../types/card';
import { ScryfallService } from './scryfall';
import { PrismaClient } from '@prisma/client';

const scryfall = ScryfallService.getInstance();
const prisma = new PrismaClient();

export class CardService {
    private static instance: CardService;

    private constructor() {}

    public static getInstance(): CardService {
      if (!CardService.instance) {
        CardService.instance = new CardService();
      }
      return CardService.instance;
    }

    async fetchAndUpdateCard(name: string): Promise<Card | null> {
        // Get card from Scryfall
        try {
            const scryfallCard = await scryfall.getCardByName(name);

            const card = await prisma.card.upsert({
                where: { oracleId: scryfallCard.oracle_id },
                update: {
                    oracleId: scryfallCard.oracle_id,
                    name: scryfallCard.name,
                    oracleText: scryfallCard.oracle_text,
                    typeLine: scryfallCard.type_line,
                    manaCost: scryfallCard.mana_cost,
                    cmc: scryfallCard.cmc,
                    colors: scryfallCard.colors,
                    colorIdentity: scryfallCard.color_identity,
                    keywords: scryfallCard.keywords,
                    power: scryfallCard.power,
                    toughness: scryfallCard.toughness,
                    imageUrl: scryfallCard.image_uris?.normal,
                    artist: scryfallCard.artist,
                    set: scryfallCard.set,
                    setNumber: scryfallCard.collector_number,
                    rarity: scryfallCard.rarity
                },
                create: {
                    oracleId: scryfallCard.oracle_id,
                    name: scryfallCard.name,
                    oracleText: scryfallCard.oracle_text,
                    typeLine: scryfallCard.type_line,
                    manaCost: scryfallCard.mana_cost,
                    cmc: scryfallCard.cmc,
                    colors: scryfallCard.colors,
                    colorIdentity: scryfallCard.color_identity,
                    keywords: scryfallCard.keywords,
                    power: scryfallCard.power,
                    toughness: scryfallCard.toughness,
                    imageUrl: scryfallCard.image_uris?.normal,
                    artist: scryfallCard.artist,
                    set: scryfallCard.set,
                    setNumber: scryfallCard.collector_number,
                    rarity: scryfallCard.rarity
                }
                });

            return card
        } catch (error) {
            //fail gracefully, if a card is not found for some reason
            //TODO: implement retries, logging, etc
            return null
        }
    }    
}