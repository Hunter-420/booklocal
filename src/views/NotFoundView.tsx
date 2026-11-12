import React from 'react';
import { Home } from 'lucide-react';

interface NotFoundViewProps {
  onNavigate: (tab: string) => void;
}

export const NotFoundView: React.FC<NotFoundViewProps> = ({ onNavigate }) => {
  return (
    <div className="max-w-md mx-auto px-4 py-24 text-center space-y-5">
      <span className="font-heading font-extrabold text-5xl text-[#1F4D3F] tabular-nums">
        404
      </span>
      <h1 className="font-heading font-bold text-2xl text-[#1F2A24]">
        Appointment Screen Not Found
      </h1>
      <p className="text-xs text-[#6B7A72]">
        The page or booking record you requested does not exist.
      </p>
      <button
        onClick={() => onNavigate('booking')}
        className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-[#1F4D3F] text-white font-bold text-xs uppercase tracking-wider hover:bg-[#2C6652] transition-colors"
      >
        <Home className="size-4" />
        <span>Return to Bookings</span>
      </button>
    </div>
  );
};
