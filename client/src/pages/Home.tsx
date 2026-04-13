import React from 'react';
import { Link, Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { BookOpen, Target, ArrowRight } from 'lucide-react';

const Home = () => {
  const { user } = useAuth();

  if (user) {
    return <Navigate to="/dashboard" />;
  }

  return (
    <div className="container" style={{ marginTop: '2rem' }}>
      <div className="flex flex-col items-center justify-center text-center" style={{ minHeight: '60vh', gap: '2rem' }}>
        
        <div style={{ padding: '1.5rem', backgroundColor: 'rgba(79, 70, 229, 0.1)', borderRadius: '50%' }}>
          <BookOpen size={48} color="var(--primary)" />
        </div>

        <h1 style={{ fontSize: '3rem', maxWidth: '800px' }}>
          Персоналізований добір освітніх курсів
        </h1>
        
        <p style={{ fontSize: '1.25rem', maxWidth: '600px' }}>
          Розвивай свої компетентності за допомогою унікальної гібридної рекомендаційної системи. Проходь тестування та отримуй курси, які підходять саме тобі!
        </p>

        <div className="flex items-center gap-4" style={{ marginTop: '1rem' }}>
          <Link to="/register" className="btn btn-primary" style={{ padding: '0.75rem 1.5rem', fontSize: '1rem' }}>
            Почати навчання <ArrowRight size={18} style={{ marginLeft: '0.5rem' }} />
          </Link>
          <Link to="/login" className="btn btn-secondary" style={{ padding: '0.75rem 1.5rem', fontSize: '1rem' }}>
            Увійти до кабінету
          </Link>
        </div>

        <div className="flex gap-8" style={{ marginTop: '4rem' }}>
          <div className="card text-center" style={{ flex: 1, maxWidth: '300px' }}>
            <Target size={32} color="var(--secondary)" style={{ margin: '0 auto 1rem' }} />
            <h3>Аналіз навичок</h3>
            <p style={{ fontSize: '0.875rem' }}>Пройди вхідне тестування для визначення твого поточного рівня компетентностей.</p>
          </div>
          <div className="card text-center" style={{ flex: 1, maxWidth: '300px' }}>
            <BookOpen size={32} color="var(--primary)" style={{ margin: '0 auto 1rem' }} />
            <h3>Гібридні рекомендації</h3>
            <p style={{ fontSize: '0.875rem' }}>Отримуй персоналізовані поради на основі твого рівня знань та оцінок інших студентів.</p>
          </div>
        </div>

      </div>
    </div>
  );
};

export default Home;
