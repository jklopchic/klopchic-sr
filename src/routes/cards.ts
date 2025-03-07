import { Router, RequestHandler } from 'express';
import { ScryfallService } from '../services/scryfall';
import { toSimpleCard } from '../types/card';
import { CardService } from '../services/cards';

const router = Router();
const scryfall = ScryfallService.getInstance();
const cardService = CardService.getInstance();

//{HOSTNAME}/card

const getCard: RequestHandler = async (req, res) => {
  try {
    const card = await scryfall.getCardByNameAsCard(req.params.name);
    res.json(card);
  } catch (error) {
    res.status(404).json({ error: 'Card not found' });
  }
};

const getSimpleCard: RequestHandler = async (req, res) => {
  try {
    const card = toSimpleCard(await scryfall.getCardByNameAsCard(req.params.name));
    res.json(card);
  } catch (error) {
    res.status(404).json({ error: 'Card not found' });
  }
};

const getAllCards: RequestHandler = async (req, res) => {
  try {
    res.json(await scryfall.getAllCardNames())
  } catch (error) {
    res.status(404).json({ error: 'Failed to fetch all cards' });
  }
}

const syncCards: RequestHandler = async (req, res) => {
  try {
    const { start, count = 1 } = req.body;
    const next = start + count

    const cardNames = await scryfall.getAllCardNames();

    console.log(cardNames.length)

    const cardNamesToFetch = cardNames.slice(start, next);

    console.log(cardNamesToFetch.length)

    let fetched = 0;
    for (const cardName of cardNamesToFetch) {
      const card = await cardService.fetchAndUpdateCard(cardName);
      if (card) fetched++;
    }

    // this async version is mean to scryfall unless we implement a semaphore, which I don't want to do just for this
    // const fetched = await Promise.all(cardNamesToFetch.map(async (cardName: string) => {
    //   const card = await cardService.fetchAndUpdateCard(cardName);
    //   return card ? 1 : 0;
    // })).then(results => results.reduce<number>((sum, current) => sum + current, 0));
    
    res.json({ count: count, fetched: fetched, next: next });
  } catch (error) {
    res.status(500).json({ error: 'Something went wrong during the sync' });
  }
};

router.get('/all', getAllCards)
router.post('/sync', syncCards);
router.get('/:name', getCard);
router.get('/simple/:name', getSimpleCard);



export default router; 