import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Button from '../components/ui/Button';

export default function ForgotPassword() {
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setSubmitted(true);
    }, 2000);
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
              Forgot Password?
            </h2>
            <p className="text-[var(--color-text-secondary)] mt-1">
              {submitted
                ? 'Check your email for a reset link.'
                : 'Enter your email and we\'ll send you a reset link.'}
            </p>
          </div>

          {submitted ? (
            <div className="space-y-4">
              <Link to="/login" className="block">
                <Button variant="outline" className="w-full">
                  Back to Login
                </Button>
              </Link>
            </div>
          ) : (
            <form className="space-y-4" onSubmit={handleSubmit}>
              <div>
                <label className="block text-sm text-[var(--color-text-secondary)] mb-1">
                  Email Address
                </label>
                <input
                  type="email"
                  placeholder="dispodron@mail.com"
                  className="w-full px-4 py-2.5 border border-[var(--color-border)] rounded-[var(--radius-md)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] focus:border-transparent"
                />
              </div>
              <Button
                type="submit"
                className="w-full"
                loading={loading}
              >
                Send Reset Link
              </Button>
            </form>
          )}

          <div className="text-center">
            <Link
              to="/login"
              className="text-sm text-[var(--color-primary)] hover:underline"
            >
              Back to Login
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
