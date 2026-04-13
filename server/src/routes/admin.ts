import { Router, Request, Response } from 'express';
import { prisma } from '../index';
import { authenticateToken, requireAdmin } from '../middleware/authMiddleware';

const router = Router();

router.use(authenticateToken);
router.use(requireAdmin);

// Competencies
router.get('/competencies', async (req: Request, res: Response) => {
  const competencies = await prisma.competency.findMany();
  res.json(competencies);
});

router.post('/competencies', async (req: Request, res: Response) => {
  const { name } = req.body;
  const competency = await prisma.competency.create({ data: { name } });
  res.status(201).json(competency);
});

// Courses
router.get('/courses', async (req: Request, res: Response) => {
  const courses = await prisma.course.findMany({
    include: { courseCompetencies: { include: { competency: true } } }
  });
  res.json(courses);
});

router.post('/courses', async (req: Request, res: Response) => {
  const { title, description, difficulty, competencies } = req.body;
  // competencies: Array<{ id: number, weight: number }>
  const course = await prisma.course.create({
    data: {
      title,
      description,
      difficulty,
      courseCompetencies: {
        create: competencies?.map((c: any) => ({
          competencyId: c.id,
          weight: c.weight,
        })) || []
      }
    }
  });
  res.status(201).json(course);
});

// Questions & Answers
router.post('/questions', async (req: Request, res: Response) => {
  const { text, competencyId, answers } = req.body;
  // answers: Array<{ text: string, isCorrect: boolean }>
  const question = await prisma.question.create({
    data: {
      text,
      competencyId,
      answers: {
        create: answers
      }
    },
    include: { answers: true }
  });
  res.status(201).json(question);
});

router.get('/questions', async (req: Request, res: Response) => {
  const questions = await prisma.question.findMany({ include: { answers: true } });
  res.json(questions);
});

export default router;
