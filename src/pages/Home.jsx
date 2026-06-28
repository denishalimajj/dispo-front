import React from 'react';
import { Link } from 'react-router-dom';
import Button from '../components/ui/Button';

export default function Home() {
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

      <div className="w-full md:w-1/2 flex items-center justify-center px-8 py-16 bg-white">
        <div className="w-full max-w-sm space-y-6">
          <div>
            <h2 className="text-3xl font-bold text-[var(--color-text-primary)]">
              Welcome
            </h2>
            <p className="text-[var(--color-text-secondary)] mt-1">
              Your platform for drone management and operations.
            </p>
          </div>

          <p className="text-[var(--color-text-secondary)] text-sm">
            Get started by logging in or creating a new account.
          </p>

          <div className="space-y-4">
            <Link to="/login" className="block">
              <Button className="w-full" size="lg">
                Login
              </Button>
            </Link>
            <Link to="/register" className="block">
              <Button variant="outline" className="w-full" size="lg">
                Sign Up
              </Button>
            </Link>
          </div>

          <p className="text-center text-sm text-[var(--color-text-secondary)]">
            Manage your fleet, track operations, and stay ahead.
          </p>
        </div>
      </div>
    </div>
  );
}
