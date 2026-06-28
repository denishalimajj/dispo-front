import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Button from '../components/ui/Button';
import ErrorMessage from '../components/ui/ErrorMessage';
import { login } from '../api/auth';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await login(email, password);
      navigate('/dashboard');
    } catch (err) {
      setError(err.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row font-sans">
      <div className="relative w-full md:w-1/2 bg-[var(--color-primary)] text-white flex flex-col justify-center items-center px-10 py-16 overflow-hidden">
        <div className="max-w-sm text-center">
          <img src="/truck.svg" alt="" className="w-16 h-16 mx-auto mb-4 brightness-0 invert opacity-90" />
          <h2 className="text-3xl font-bold mb-4">Dispo Dron</h2>
          <p className="text-white/90">
            Track Every Truck, Drive Your Business Forward.
          </p>
        </div>
        <div className="absolute bottom-0 left-0 w-full z-0">
          <img src="/wave.svg" alt="Wave" className="w-full" />
        </div>
      </div>

      <div className="w-full md:w-1/2 flex items-center justify-center px-8 py-16 animate-fade-in-right bg-white">
        <div className="w-full max-w-sm space-y-6">
          <div>
            <h2 className="text-3xl font-bold text-[var(--color-text-primary)]">
              Hello Again!
            </h2>
            <p className="text-[var(--color-text-secondary)] mt-1">
              Welcome Back
            </p>
          </div>

          <form className="space-y-4" onSubmit={handleSubmit}>
            <ErrorMessage message={error} onDismiss={() => setError('')} />
            <div>
              <label className="block text-sm text-[var(--color-text-secondary)] mb-1">
                Email Address
              </label>
              <input
                type="email"
                placeholder="dispodron@mail.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full px-4 py-2.5 border border-[var(--color-border)] rounded-[var(--radius-md)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm text-[var(--color-text-secondary)] mb-1">
                Password
              </label>
              <input
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full px-4 py-2.5 border border-[var(--color-border)] rounded-[var(--radius-md)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] focus:border-transparent"
              />
            </div>
            <Button
              type="submit"
              className="w-full"
              loading={loading}
            >
              Login
            </Button>
          </form>

          <div className="text-center">
            <Link
              to="/forgot-password"
              className="text-sm text-[var(--color-primary)] hover:underline"
            >
              Forgot Password?
            </Link>
          </div>

          <p className="text-center text-sm text-[var(--color-text-secondary)]">
            Don't have an account?{' '}
            <Link to="/register" className="text-[var(--color-primary)] font-medium hover:underline">
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
