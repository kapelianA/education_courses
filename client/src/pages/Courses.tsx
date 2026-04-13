import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../api';
import { BookOpen, Star, Sparkles } from 'lucide-react';

const Courses = () => {
  const { user } = useAuth();
  const [courses, setCourses] = useState<any[]>([]);
  const [recommendations, setRecommendations] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        if (user) {
          const recRes = await api.get('/recommendations?alpha=0.7');
          setRecommendations(recRes.data);
        } else {
          // If not logged in, fetch from public admin equivalent or just mock
          const courseRes = await api.get('/admin/courses');
          setCourses(courseRes.data);
        }
      } catch (error) {
        console.error("Failed to fetch courses", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCourses();
  }, [user]);

  if (loading) return <div className="container mt-8 text-center">Завантаження каталогів...</div>;

  return (
    <div className="container" style={{ marginTop: '2rem' }}>
      
      {user && recommendations.length > 0 && (
        <div style={{ marginBottom: '4rem' }}>
          <div className="flex items-center gap-2" style={{ marginBottom: '1.5rem' }}>
            <Sparkles size={28} color="var(--primary)" />
            <h2 style={{ margin: 0 }}>Рекомендовано для вас</h2>
          </div>
          
          <div className="flex flex-col gap-4">
            {recommendations.slice(0, 3).map((rec: any) => (
              <div key={rec.course.id} className="card flex items-center justify-between">
                <div>
                  <h3 style={{ margin: 0, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <BookOpen size={20} color="var(--secondary)" />
                    {rec.course.title}
                  </h3>
                  <p style={{ margin: '0.5rem 0 0 0', fontSize: '0.875rem' }}>
                    {rec.course.description}
                  </p>
                  <div className="flex items-center gap-4" style={{ marginTop: '1rem', fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
                    <span className="badge">Складність: {rec.course.difficulty}/5</span>
                    <span className="flex items-center gap-1">
                      <Star size={14} color="#F59E0B" fill="#F59E0B" />
                      Відповідність: {Math.round(rec.totalScore * 100)}%
                    </span>
                  </div>
                </div>
                <button className="btn btn-primary">Детальніше</button>
              </div>
            ))}
          </div>
        </div>
      )}

      <div>
        <h2 style={{ marginBottom: '1.5rem' }}>Каталог усіх курсів</h2>
        
        {courses.length === 0 && (!user || recommendations.length === 0) ? (
          <p>Курси відсутні.</p>
        ) : (
          <div className="flex flex-col gap-4">
            {(user ? recommendations.map(r => r.course) : courses).map((course: any) => (
              <div key={course.id} className="card flex items-center justify-between" style={{ opacity: 0.9 }}>
                <div>
                  <h3 style={{ margin: 0 }}>{course.title}</h3>
                  <p style={{ margin: '0.5rem 0 0 0', fontSize: '0.875rem' }}>{course.description}</p>
                </div>
                <button className="btn btn-secondary">Детальніше</button>
              </div>
            ))}
          </div>
        )}
      </div>

    </div>
  );
};

export default Courses;
