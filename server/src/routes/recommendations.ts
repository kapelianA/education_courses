import { Router, Response } from 'express';
import { authenticateToken, AuthRequest } from '../middleware/authMiddleware';
import { RecommendationService } from '../services/recommendationService';

const router = Router();

router.use(authenticateToken);

router.get('/', async (req: AuthRequest, res: Response): Promise<any> => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const { alpha } = req.query;
    const alphaValue = alpha ? parseFloat(alpha as string) : 0.7;

    const recommendations = await RecommendationService.getRecommendations(userId, alphaValue);
    
    res.json(recommendations);
  } catch (error) {
    console.error('Error generating recommendations:', error);
    res.status(500).json({ error: 'Internal server error while generating recommendations' });
  }
});

export default router;
