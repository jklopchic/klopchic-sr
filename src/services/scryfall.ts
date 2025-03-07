import axios from 'axios';
import { ScryfallCard } from '../types/scryfall';
import { Card } from '../types/card';

const BASE_URL = 'https://api.scryfall.com';
const USER_AGENT = 'klopchic-sr/1.0';

const scryfallClient = axios.create({
  baseURL: BASE_URL,
  headers: {
    'User-Agent': USER_AGENT,
    'Accept': 'application/json'
  }
});

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

function toCard(scryfallCard: ScryfallCard): Card {
  return {
    id: 0,
    oracleId: scryfallCard.oracle_id,
    name: scryfallCard.name,
    oracleText: scryfallCard.oracle_text,
    typeLine: scryfallCard.type_line,
    manaCost: scryfallCard.mana_cost ?? null,
    cmc: scryfallCard.cmc,
    colors: scryfallCard.colors,
    colorIdentity: scryfallCard.color_identity,
    keywords: scryfallCard.keywords,
    power: scryfallCard.power ?? null,
    toughness: scryfallCard.toughness ?? null,
    imageUrl: scryfallCard.image_uris?.normal ?? null,
    artist: scryfallCard.artist,
    set: scryfallCard.set,
    setNumber: scryfallCard.collector_number,
    rarity: scryfallCard.rarity,
    createdAt: new Date(),
    updatedAt: new Date()
  };
}

export class ScryfallService {
  private static instance: ScryfallService;
  private lastRequestTime: number = 0;

  private constructor() {}

  public static getInstance(): ScryfallService {
    if (!ScryfallService.instance) {
      ScryfallService.instance = new ScryfallService();
    }
    return ScryfallService.instance;
  }

  private async ensureRateLimit() {
    const now = Date.now();
    const timeSinceLastRequest = now - this.lastRequestTime;
    if (timeSinceLastRequest < 100) { // Ensure at least 100ms between requests
      await delay(100 - timeSinceLastRequest);
    }
    this.lastRequestTime = Date.now();
  }

  async getCardByName(name: string): Promise<ScryfallCard> {
    await this.ensureRateLimit();
    const response = await scryfallClient.get<ScryfallCard>(`/cards/named`, {
      params: { exact: name }
    });
    return response.data;
  }

  async getCardByNameAsCard(name: string): Promise<Card> {
    const scryfallCard = await this.getCardByName(name);
    return toCard(scryfallCard);
  }

  async getCardById(id: string): Promise<ScryfallCard> {
    await this.ensureRateLimit();
    const response = await scryfallClient.get<ScryfallCard>(`/cards/${id}`);
    return response.data;
  }

  async searchCards(query: string): Promise<{ data: ScryfallCard[] }> {
    await this.ensureRateLimit();
    const response = await scryfallClient.get<{ data: ScryfallCard[] }>('/cards/search', {
      params: { q: query }
    });
    return response.data;
  }
}