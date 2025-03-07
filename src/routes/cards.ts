import { Router } from 'express';
import { ScryfallService } from '../services/scryfall';
import { toSimpleCard } from '../types/card';
import { PrismaClient } from '@prisma/client';

const router = Router();
const scryfall = ScryfallService.getInstance();
const prisma = new PrismaClient();

//{HOSTNAME}/card

/* /card/:name */
router.get('/:name', async (req, res) => {
  try {
    const card = await scryfall.getCardByNameAsCard(req.params.name);
    res.json(card);
  } catch (error) {
    res.status(404).json({ error: 'Card not found' });
  }
});

/* /card/simple/:name */
router.get('/simple/:name', async (req, res) => {
  try {
    const card = toSimpleCard(await scryfall.getCardByNameAsCard(req.params.name));
    res.json(card);
  } catch (error) {
    res.status(404).json({ error: 'Card not found' });
  }
});

/* /card/sync */
router.get('/simple/:name', async (req, res) => {
  try {
    //get all of the card names from Scryfall
    const cardNames = ["Swamp", "Island", "Forest"]

    //for each card name, pull the card info and add to the database
    cardNames.forEach((cardName: string) => {
      console.log(cardName)

    })


    
  } catch (error) {
    res.status(404).json({ error: 'Card not found' });
  }
});

export default router; 