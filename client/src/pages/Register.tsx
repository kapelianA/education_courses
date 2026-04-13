import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../api';
import { BookOpen } from 'lucide-react';

const Register = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const { data } = await api.post('/auth/register', { name, email, password });
      login(data.token, data.user);
      navigate('/dashboard');
    } catch (err: any) {
      setError(err.response?.data?.error || 'Помилка реєстрації');
    }
  };

  return (
    <div className="container flex items-center justify-center" style={{ minHeight: '80vh' }}>
      <div className="card" style={{ maxWidth: '400px', width: '100%' }}>
        <div className="flex flex-col items-center gap-4" style={{ marginBottom: '2rem' }}>
          <div style={{ padding: '1rem', backgroundColor: 'rgba(79, 70, 229, 0.1)', borderRadius: '50%' }}>
            <BookOpen size={32} color="var(--primary)" />
          </div>
          <h2 style={{ margin: 0 }}>Реєстрація</h2>
          <p style={{ margin: 0, textAlign: 'center', fontSize: '0.875rem' }}>
            Приєднуйся до платформи адаптивного навчання!
          </p>
        </div>

        {error && <div style={{ color: 'red', marginBottom: '1rem', fontSize: '0.875rem', textAlign: 'center' }}>{error}</div>}

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="input-group">
            <label className="input-label" htmlFor="name">Ім'я</label>
            <input 
              id="name" 
              type="text" 
              className="input-field" 
              value={name} 
              onChange={(e) => setName(e.target.value)} 
              required 
            />
          </div>
          <div className="input-group">
            <label className="input-label" htmlFor="email">Електронна пошта</label>
            <input 
              id="email" 
              type="email" 
              className="input-field" 
              value={email} 
              onChange={(e) => setEmail(e.target.value)} 
              required 
            />
          </div>
          <div className="input-group">
            <label className="input-label" htmlFor="password">Пароль</label>
            <input 
              id="password" 
              type="password" 
              className="input-field" 
              value={password} 
              onChange={(e) => setPassword(e.target.value)} 
              required 
              minLength={6}
            />
          </div>
          
          <button type="submit" className="btn btn-primary" style={{ padding: '0.75rem', marginTop: '1rem' }}>Створити акаунт</button>
        </form>

        <p style={{ textAlign: 'center', marginTop: '1.5rem', fontSize: '0.875rem' }}>
          Вже маєте акаунт? <Link to="/login" style={{ color: 'var(--primary)', textDecoration: 'none', fontWeight: 500 }}>Увійти</Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
