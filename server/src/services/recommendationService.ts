import { prisma } from '../index';

export class RecommendationService {
  /**
   * Обчислює косинусну подібність між вектором користувача та вектором курсу
   */
  private static cosineSimilarity(userVector: Record<number, number>, courseVector: Record<number, number>): number {
    let dotProduct = 0;
    let normU = 0;
    let normC = 0;

    // Оскільки ми маємо справу з розрідженими векторами, обчислюємо лише по наявних ключах
    const allKeys = new Set([...Object.keys(userVector), ...Object.keys(courseVector)]);

    for (const key of allKeys) {
      const k = Number(key);
      const u = userVector[k] || 0;
      const c = courseVector[k] || 0;

      dotProduct += u * c;
      normU += u * u;
      normC += c * c;
    }

    if (normU === 0 || normC === 0) return 0;
    return dotProduct / (Math.sqrt(normU) * Math.sqrt(normC));
  }

  /**
   * Будує вектор компетентностей користувача (id -> level)
   */
  private static async getUserVector(userId: number): Promise<Record<number, number>> {
    const userComps = await prisma.userCompetency.findMany({ where: { userId } });
    const vector: Record<number, number> = {};
    for (const uc of userComps) {
      vector[uc.competencyId] = uc.level;
    }
    return vector;
  }

  /**
   * Будує вектори компетентностей для всіх курсів
   */
  private static async getCourseVectors(): Promise<Record<number, Record<number, number>>> {
    const courses = await prisma.course.findMany({
      include: { courseCompetencies: true }
    });
    
    const vectors: Record<number, Record<number, number>> = {};
    for (const course of courses) {
      vectors[course.id] = {};
      for (const cc of course.courseCompetencies) {
        vectors[course.id][cc.competencyId] = cc.weight;
      }
    }
    return vectors;
  }

  /**
   * Контентна складова
   */
  private static async getContentBasedScores(userId: number): Promise<Record<number, number>> {
    const userVector = await this.getUserVector(userId);
    const courseVectors = await this.getCourseVectors();
    const scores: Record<number, number> = {};

    for (const [courseIdStr, cVector] of Object.entries(courseVectors)) {
      const courseId = Number(courseIdStr);
      // Якщо у користувача немає жодних компетентностей взагалі, cosineSimilarity поверне 0.
      scores[courseId] = this.cosineSimilarity(userVector, cVector);
    }
    return scores;
  }

  /**
   * Колаборативна складова (Item-based)
   * Для простоти: середній бал курсу серед інших схожих користувачів
   * або просто середній рейтинг курсу, нормалізований до [0, 1]
   */
  private static async getCollaborativeScores(): Promise<Record<number, number>> {
    const ratings = await prisma.rating.groupBy({
      by: ['courseId'],
      _avg: { score: true },
      _count: { score: true }
    });

    const scores: Record<number, number> = {};
    for (const r of ratings) {
      if (r._count.score > 0 && r._avg.score != null) {
        // Нормалізація рейтингу від 1-5 до 0-1
        scores[r.courseId] = (r._avg.score - 1) / 4;
      } else {
        scores[r.courseId] = 0;
      }
    }
    return scores;
  }

  /**
   * Генерація фінальних гібридних рекомендацій
   */
  public static async getRecommendations(userId: number, alpha: number = 0.7) {
    const contentScores = await this.getContentBasedScores(userId);
    const collabScores = await this.getCollaborativeScores();

    const allCourses = await prisma.course.findMany();
    
    const recommendations = allCourses.map((course: any) => {
      const cScore = contentScores[course.id] || 0;
      const colScore = collabScores[course.id] || 0;
      
      const totalScore = (alpha * cScore) + ((1 - alpha) * colScore);

      return {
        course,
        contentScore: cScore,
        collaborativeScore: colScore,
        totalScore
      };
    });

    // Сортування за спаданням загальної оцінки
    recommendations.sort((a: any, b: any) => b.totalScore - a.totalScore);

    return recommendations;
  }
}
