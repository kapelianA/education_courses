import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, Tooltip } from 'recharts';
import api from '../api';
import { Link } from 'react-router-dom';
import { PlayCircle, Trophy, Book } from 'lucide-react';

const Dashboard = () => {
  const { user } = useAuth();
  const [competencies, setCompetencies] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // В ідеальній системі тут має бути ендпоінт /api/student/profile
    api.get('/admin/competencies') // Mocking fetching user competencies. 
      .then(res => {
        // Умовно генеруємо або беремо рівні з БД
        const data = res.data.map((c: any) => ({
          subject: c.name,
          A: Math.floor(Math.random() * 100), // Random for demo, usually fetched from userCompetencies
          fullMark: 100,
        }));
        setCompetencies(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  return (
    <div className="container" style={{ marginTop: '2rem' }}>
      <div className="flex items-center justify-between" style={{ marginBottom: '2rem' }}>
        <div>
          <h1 style={{ marginBottom: '0.5rem' }}>Привіт, {user?.name}! 👋</h1>
          <p>Твій поточний рівень компетентностей та прогрес.</p>
        </div>
        <Link to="/test" className="btn btn-primary" style={{ padding: '0.75rem 1.5rem', display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
          <PlayCircle size={20} />
          Пройти тестування
        </Link>
      </div>

      <div className="flex gap-8">
        <div style={{ flex: 1 }} className="flex flex-col gap-4">
          <div className="flex gap-4">
            <div className="card" style={{ flex: 1, textAlign: 'center' }}>
              <Trophy size={32} color="var(--secondary)" style={{ margin: '0 auto 0.5rem' }} />
              <h3>Досягнення</h3>
              <p style={{ margin: 0, fontSize: '1.5rem', fontWeight: 'bold', color: 'var(--text-primary)' }}>12</p>
            </div>
            <div className="card" style={{ flex: 1, textAlign: 'center' }}>
              <Book size={32} color="var(--primary)" style={{ margin: '0 auto 0.5rem' }} />
              <h3>Пройдено курсів</h3>
              <p style={{ margin: 0, fontSize: '1.5rem', fontWeight: 'bold', color: 'var(--text-primary)' }}>4</p>
            </div>
          </div>

          <div className="card">
            <h3>Рекомендація від Курсика</h3>
            <div style={{ padding: '1rem', backgroundColor: 'rgba(79, 70, 229, 0.05)', borderRadius: 'var(--radius-md)', borderLeft: '4px solid var(--primary)' }}>
              <p style={{ margin: 0, fontSize: '0.875rem' }}>
                Я помітив, що у тебе є прогалини в "Алгоритмах та структурах даних". Рекомендую пройти курс для початковців, який щойно з'явився у каталозі!
              </p>
            </div>
            <div style={{ marginTop: '1rem' }}>
              <Link to="/courses" className="btn btn-secondary">Перейти до курсу</Link>
            </div>
          </div>
        </div>

        <div className="card" style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <h3>Профіль компетентностей</h3>
          <div style={{ width: '100%', height: 300, marginTop: '1rem' }}>
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart cx="50%" cy="50%" outerRadius="80%" data={competencies}>
                <PolarGrid />
                <PolarAngleAxis dataKey="subject" tick={{ fill: 'var(--text-secondary)', fontSize: 12 }} />
                <PolarRadiusAxis />
                <Tooltip />
                <Radar name="Рівень" dataKey="A" stroke="var(--primary)" fill="var(--primary)" fillOpacity={0.5} />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
