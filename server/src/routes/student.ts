import { Router, Request, Response } from 'express';
import { prisma } from '../index';
import { authenticateToken, AuthRequest } from '../middleware/authMiddleware';

const router = Router();

router.use(authenticateToken);

// Get diagnostic test questions
router.get('/tests', async (req: AuthRequest, res: Response) => {
  // Return a simplified version of questions without `isCorrect` info
  const questions = await prisma.question.findMany({
    include: { answers: { select: { id: true, text: true, questionId: true } } }
  });
  res.json(questions);
});

// Submit test results
router.post('/tests/submit', async (req: AuthRequest, res: Response): Promise<any> => {
  const userId = req.user?.id;
  if (!userId) return res.status(401).json({ error: 'Unauthorized' });

  const { answers } = req.body; // Array of { questionId, answerId }

  // 1. Get all correct answers for the submitted questions
  const questionIds = answers.map((a: any) => a.questionId);
  const questions = await prisma.question.findMany({
    where: { id: { in: questionIds } },
    include: { answers: true }
  });

  // 2. Map competencies to correct count & total count
  const competencyStats: Record<number, { correct: number; total: number }> = {};
  
  for (const q of questions) {
    if (!competencyStats[q.competencyId]) {
      competencyStats[q.competencyId] = { correct: 0, total: 0 };
    }
    competencyStats[q.competencyId].total += 1;

    const submittedAnswer = answers.find((a: any) => a.questionId === q.id);
    const correctAnswer = q.answers.find((a: any) => a.isCorrect);

    if (submittedAnswer && correctAnswer && submittedAnswer.answerId === correctAnswer.id) {
      competencyStats[q.competencyId].correct += 1;
    }
  }

  // 3. Update UserCompetency levels (0 to 1)
  const results = [];
  for (const [competencyId, stat] of Object.entries(competencyStats)) {
    const level = stat.total > 0 ? stat.correct / stat.total : 0;
    
    const userCompetency = await prisma.userCompetency.upsert({
      where: { userId_competencyId: { userId, competencyId: Number(competencyId) } },
      update: { level },
      create: { userId, competencyId: Number(competencyId), level }
    });
    results.push(userCompetency);
  }

  res.json({ message: 'Test submitted', results });
});

// Rate a course
router.post('/courses/:id/rate', async (req: AuthRequest, res: Response): Promise<any> => {
  const userId = req.user?.id;
  const courseId = parseInt(req.params.id as string);
  const { score } = req.body;

  if (!userId) return res.status(401).json({ error: 'Unauthorized' });
  if (score < 1 || score > 5) return res.status(400).json({ error: 'Score must be between 1 and 5' });

  const rating = await prisma.rating.upsert({
    where: { userId_courseId: { userId, courseId } },
    update: { score },
    create: { userId, courseId, score }
  });

  res.json(rating);
});

export default router;
