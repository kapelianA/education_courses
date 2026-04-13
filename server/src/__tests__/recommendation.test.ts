import { RecommendationService } from '../services/recommendationService';
import { prisma } from '../index';

// Мокаємо ТІЛЬКИ призму для реального виконання коду сервісу
jest.mock('../index', () => ({
  prisma: {
    userCompetency: { 
      findMany: jest.fn().mockResolvedValue([
        { competencyId: 1, level: 0.5 }
      ]) 
    },
    course: { 
      findMany: jest.fn().mockResolvedValue([
        { 
          id: 1, 
          title: 'Курс для тесту', 
          courseCompetencies: [{ competencyId: 1, weight: 1.0 }] 
        }
      ]) 
    },
    rating: { 
      groupBy: jest.fn().mockResolvedValue([
        { courseId: 1, _avg: { score: 5 }, _count: { score: 1 } }
      ]) 
    }
  }
}));

describe('RecommendationService Coverage Tests', () => {
  
  test('full recommendation cycle coverage', async () => {
    // Проходимо по основній логіці (Content-based + Collaborative)
    const results = await RecommendationService.getRecommendations(1, 0.5);
    
    expect(results).toBeDefined();
    expect(results.length).toBeGreaterThan(0);
    expect(results[0].totalScore).toBeDefined();
  });

  test('edge case coverage', async () => {
    // Мокаємо всі виклики findMany як пусті для цього тесту
    (prisma.course.findMany as jest.Mock).mockResolvedValue([]);
    
    const results = await RecommendationService.getRecommendations(999);
    
    // Очікуємо 0 результатів, бо курсів "немає"
    expect(results).toHaveLength(0);
  });
});
