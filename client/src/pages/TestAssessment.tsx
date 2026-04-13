import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api';
import { Bot, CheckCircle2, ChevronRight } from 'lucide-react';

const TestAssessment = () => {
  const [questions, setQuestions] = useState<any[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // В ідеальній системі тут має бути ендпоінт /api/student/tests
    api.get('/admin/questions') // Mocking for now
      .then(res => {
        setQuestions(res.data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const handleSelectAnswer = (questionId: number, answerId: number) => {
    setAnswers(prev => ({ ...prev, [questionId]: answerId }));
  };

  const handleNext = () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex(prev => prev + 1);
    }
  };

  const handlePrevious = () => {
    if (currentIndex > 0) {
      setCurrentIndex(prev => prev - 1);
    }
  };

  const handleSubmit = async () => {
    setSubmitting(true);
    const payload = {
      answers: Object.keys(answers).map(qId => ({
        questionId: Number(qId),
        answerId: answers[Number(qId)]
      }))
    };
    
    try {
      await api.post('/student/tests/submit', payload);
      alert('Тест успішно завершено! Перенаправлення до кабінету...');
      navigate('/dashboard');
    } catch (error) {
      console.error(error);
      alert('Сталася помилка при збереженні результатів.');
      setSubmitting(false);
    }
  };

  if (loading) return <div className="container mt-8 text-center">Завантаження тесту...</div>;
  if (questions.length === 0) return <div className="container mt-8 text-center">Запитання відсутні. Зверніться до адміністратора.</div>;

  const question = questions[currentIndex];
  const isAnswered = answers[question.id] !== undefined;

  return (
    <div className="container flex flex-col items-center" style={{ marginTop: '2rem' }}>
      
      <div className="card" style={{ width: '100%', maxWidth: '700px' }}>
        <div className="flex items-center gap-4" style={{ marginBottom: '2rem', paddingBottom: '1rem', borderBottom: '1px solid var(--border)' }}>
          <div style={{ backgroundColor: 'var(--primary)', padding: '0.75rem', borderRadius: '50%' }}>
            <Bot size={32} color="white" />
          </div>
          <div>
            <h2 style={{ margin: 0 }}>Помічник Курсик</h2>
            <p style={{ margin: 0, fontSize: '0.875rem' }}>Діагностичне тестування ({currentIndex + 1} / {questions.length})</p>
          </div>
        </div>

        <div style={{ marginBottom: '2rem' }}>
          <h3 style={{ fontSize: '1.25rem', marginBottom: '1.5rem', lineHeight: 1.5 }}>
            {question.text}
          </h3>

          <div className="flex flex-col gap-3">
            {question.answers.map((ans: any) => (
              <label 
                key={ans.id} 
                className="flex items-center gap-3" 
                style={{ 
                  padding: '1rem', 
                  border: `2px solid ${answers[question.id] === ans.id ? 'var(--primary)' : 'var(--border)'}`, 
                  borderRadius: 'var(--radius-md)',
                  cursor: 'pointer',
                  backgroundColor: answers[question.id] === ans.id ? 'rgba(79, 70, 229, 0.05)' : 'transparent',
                  transition: 'all 0.2s'
                }}
              >
                <input 
                  type="radio" 
                  name={`question-${question.id}`} 
                  value={ans.id} 
                  checked={answers[question.id] === ans.id}
                  onChange={() => handleSelectAnswer(question.id, ans.id)}
                  style={{ width: '1.25rem', height: '1.25rem', accentColor: 'var(--primary)' }}
                />
                <span style={{ fontSize: '1rem' }}>{ans.text}</span>
              </label>
            ))}
          </div>
        </div>

        <div className="flex items-center justify-between" style={{ marginTop: '2rem', paddingTop: '1.5rem', borderTop: '1px solid var(--border)' }}>
          <button 
            className="btn btn-secondary" 
            onClick={handlePrevious} 
            disabled={currentIndex === 0}
            style={{ opacity: currentIndex === 0 ? 0.5 : 1 }}
          >
            Попереднє
          </button>
          
          {currentIndex === questions.length - 1 ? (
            <button 
              className="btn btn-primary flex items-center gap-2" 
              onClick={handleSubmit} 
              disabled={!isAnswered || submitting}
            >
              <CheckCircle2 size={18} />
              {submitting ? 'Збереження...' : 'Завершити тест'}
            </button>
          ) : (
            <button 
              className="btn btn-primary flex items-center gap-2" 
              onClick={handleNext} 
              disabled={!isAnswered}
            >
              Наступне <ChevronRight size={18} />
            </button>
          )}
        </div>
      </div>

    </div>
  );
};

export default TestAssessment;
