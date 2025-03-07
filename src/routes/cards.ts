import { Router } from 'express';
import { ScryfallService } from '../services/scryfall';
import { toSimpleCard } from '../types/card';

const router = Router();
const scryfall = ScryfallService.getInstance();

//{HOSTNAME/card

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

export default router; 