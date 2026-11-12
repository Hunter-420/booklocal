import React, { useState } from 'react';
import { Shield, User, ArrowRight } from 'lucide-react';
import { BookLocalStore, DEMO_USERS } from '../lib/store';
import { Profile } from '../lib/types';

interface LoginViewProps {
  onNavigate: (tab: string) => void;
  onUserChange: (user: Profile) => void;
}

export const LoginView: React.FC<LoginViewProps> = ({ onNavigate, onUserChange }) => {
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState('sam.reed@example.com');
  const [password, setPassword] = useState('password123');
  const [fullName, setFullName] = useState('Samantha Reed');

  const handleTestLogin = (userType: 'customer' | 'owner') => {
    const user = DEMO_USERS[userType];
    BookLocalStore.setCurrentUser(user);
    onUserChange(user);
    if (userType === 'owner') {
      onNavigate('owner-dashboard');
    } else {
      onNavigate('my-bookings');
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newUser: Profile = {
      id: `user-${Date.now()}`,
      fullName: fullName || 'Demo Client',
      email: email || 'demo@client.co.nz',
      phone: '021 555 1234',
      role: 'customer',
    };
    BookLocalStore.setCurrentUser(newUser);
    onUserChange(newUser);
    onNavigate('my-bookings');
  };

  return (
    <div className="max-w-md mx-auto px-4 py-16">
      <div className="bg-white rounded-3xl p-8 border border-[#E8DDCB] shadow-sm space-y-6">
        <div className="text-center space-y-2">
          <span className="text-xs font-bold uppercase tracking-wider text-[#1F4D3F]">
            Willow & Stone Account
          </span>
          <h1 className="font-heading font-bold text-3xl text-[#1F2A24]">
            {isSignUp ? 'Create an account' : 'Welcome back'}
          </h1>
          <p className="text-xs text-[#6B7A72]">
            {isSignUp
              ? 'Save your hair preferences and manage upcoming appointments.'
              : 'Sign in to review and reschedule your bookings.'}
          </p>
        </div>

        {/* 1-Click Quick Demo Sign-in */}
        <div className="p-4 rounded-2xl bg-[#F0E6D8] border border-[#E8DDCB] space-y-3">
          <span className="text-xs font-bold text-[#1F2A24] block uppercase tracking-wider">
            Quick Demo Accounts:
          </span>
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => handleTestLogin('customer')}
              className="py-2.5 px-3 rounded-xl bg-white hover:bg-[#F5F0E8] border border-[#E8DDCB] text-xs font-bold text-[#1F2A24] transition-colors flex items-center justify-center gap-1.5"
            >
              <User className="size-3.5 text-[#1F4D3F]" />
              <span>Client Demo</span>
            </button>
            <button
              type="button"
              onClick={() => handleTestLogin('owner')}
              className="py-2.5 px-3 rounded-xl bg-[#1F4D3F] hover:bg-[#2C6652] text-white text-xs font-bold transition-colors flex items-center justify-center gap-1.5"
            >
              <Shield className="size-3.5 text-[#E07A5F]" />
              <span>Owner Demo</span>
            </button>
          </div>
        </div>

        {/* Regular Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {isSignUp && (
            <div className="space-y-1">
              <label className="block text-xs font-bold text-[#1F2A24] uppercase">Full Name</label>
              <input
                type="text"
                required
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-[#E8DDCB] bg-[#FBF6EF] text-sm text-[#1F2A24]"
              />
            </div>
          )}

          <div className="space-y-1">
            <label className="block text-xs font-bold text-[#1F2A24] uppercase">Email</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl border border-[#E8DDCB] bg-[#FBF6EF] text-sm text-[#1F2A24]"
            />
          </div>

          <div className="space-y-1">
            <label className="block text-xs font-bold text-[#1F2A24] uppercase">Password</label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl border border-[#E8DDCB] bg-[#FBF6EF] text-sm text-[#1F2A24]"
            />
          </div>

          <button
            type="submit"
            className="w-full py-3.5 rounded-xl bg-[#1F4D3F] hover:bg-[#2C6652] text-white font-bold text-sm transition-colors shadow-sm flex items-center justify-center gap-2"
          >
            <span>{isSignUp ? 'Create Account' : 'Sign In'}</span>
            <ArrowRight className="size-4" />
          </button>
        </form>

        <div className="text-center pt-2 border-t border-[#E8DDCB]">
          <button
            type="button"
            onClick={() => setIsSignUp(!isSignUp)}
            className="text-xs text-[#1F4D3F] font-bold hover:underline"
          >
            {isSignUp ? 'Already have an account? Sign in' : 'Need an account? Create one'}
          </button>
        </div>
      </div>
    </div>
  );
};
