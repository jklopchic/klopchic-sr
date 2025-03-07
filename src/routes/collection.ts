import { Router, RequestHandler } from 'express';
import { PrismaClient } from '@prisma/client';
import { ScryfallService } from '../services/scryfall';
import { UserService } from '../services/user';
import { toSimpleCard } from '../types/card';
import { CardService } from '../services/cards';

const router = Router();
const prisma = new PrismaClient();
const scryfall = ScryfallService.getInstance();
const userService = UserService.getInstance();
const cardService = CardService.getInstance();

/* /collection/add */       
const addCardToCollection: RequestHandler = async (req, res) => {
  if (!req.oidc.isAuthenticated()) {
    res.status(401).json({ error: 'Not authenticated' });
    return;
  }

  try {
    const { cardName, quantity = 1 } = req.body;
    
    // Get or create user
    const user = await userService.getOrCreateUser(
      req.oidc.user?.sub!,
      req.oidc.user?.email!,
      req.oidc.user?.name
    );

    const card = await cardService.fetchAndUpdateCard(cardName);
    
    if (card) {
      // Try to update existing card quantity or create new entry
      await prisma.userCard.upsert({
        where: {
          userId_cardId: {
            userId: user.id,
            cardId: card.id
          }
        },
        update: {
          quantity: {
            increment: quantity
          }
        },
        create: {
          userId: user.id,
          cardId: card.id,
          quantity
        }
      });

      res.json({ message: 'Card added to collection', card });
    } else {
      res.status(404).json({ error: 'Card not found' });
    }
  } catch (error) {
    console.error('Error adding card to collection:', error);
    res.status(500).json({ error: 'Failed to add card to collection' });
  }
};

/* /collection/ */       
const getCollection: RequestHandler = async (req, res) => {
    if (!req.oidc.isAuthenticated()) {
      res.status(401).json({ error: 'Not authenticated' });
      return;
    }
  
    try {      
      // Get or create user
      const user = await userService.getOrCreateUser(
        req.oidc.user?.sub!,
        req.oidc.user?.email!,
        req.oidc.user?.name
      );
  
      // Add card to user's collection
      const userCards = await prisma.userCard.findMany({
        where: {
          userId: user.id,
        }
      });

      //TODO: this his horiffically slow once there are a lot of cards in the collection
      const cards = await prisma.card.findMany({
        where: {
          id: { in: userCards.map((userCard: { cardId: number }) => userCard.cardId) }
        }
      });

      const collection = userCards.map((userCard: { cardId: number, quantity: number }) => {
        const card = cards.find((card: { id: number }) => card.id === userCard.cardId);
        return {
          card: card ? toSimpleCard(card) : null,
          quantity: userCard.quantity
        };
      });
  
      res.json({ message: 'Collection List', collection });
    } catch (error) {
      console.error('Error getting collection:', error);
      res.status(500).json({ error: 'Failed to get collection' });
    }
  };

router.post('/add', addCardToCollection);
router.get('/', getCollection);

export default router; 