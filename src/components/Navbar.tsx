import React, { useState } from 'react';
import { Calendar, User, Shield, Menu, X, Scissors, Clock, Sparkles } from 'lucide-react';
import { BookLocalStore, DEMO_USERS } from '../lib/store';
import { Profile } from '../lib/types';

interface NavbarProps {
  currentTab: string;
  onNavigate: (tab: string) => void;
  currentUser: Profile;
  onUserChange: (user: Profile) => void;
}

export const Navbar: React.FC<NavbarProps> = ({ currentTab, onNavigate, currentUser, onUserChange }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const isOwner = currentUser.role === 'owner';

  const customerNavItems = [
    { id: 'booking', label: 'Book Online' },
    { id: 'services', label: 'Services & Pricing' },
    { id: 'my-bookings', label: 'My Bookings' },
    { id: 'contact', label: 'Studio & Hours' },
  ];

  const ownerNavItems = [
    { id: 'owner-dashboard', label: 'Owner Dashboard' },
    { id: 'owner-settings', label: 'Hours & Services' },
    { id: 'booking', label: 'Customer Booking View' },
  ];

  const activeNavItems = isOwner ? ownerNavItems : customerNavItems;

  const handleLinkClick = (id: string) => {
    onNavigate(id);
    setMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const toggleRole = () => {
    const nextUser = isOwner ? DEMO_USERS.customer : DEMO_USERS.owner;
    BookLocalStore.setCurrentUser(nextUser);
    onUserChange(nextUser);
    if (!isOwner) {
      onNavigate('owner-dashboard');
    } else {
      onNavigate('booking');
    }
  };

  return (
    <>
      {/* Top Demo Bar & Role Switcher */}
      <div className="bg-[#14201B] text-[#E3F1E8] text-xs py-2 px-4 sm:px-8 border-b border-[#243730]">
        <div className="max-w-6xl mx-auto flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <span className="font-semibold text-[#E07A5F] uppercase tracking-wider text-[11px]">
              Demo Mode
            </span>
            <span className="hidden sm:inline text-[#A3B3AA]">
              Ponsonby Studio · Pacific/Auckland Timezone
            </span>
          </div>

          {/* 1-Click Role Switcher */}
          <div className="flex items-center gap-2">
            <span className="text-[#A3B3AA] text-[11px] hidden md:inline">Viewing as:</span>
            <button
              onClick={toggleRole}
              className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#1F4D3F] hover:bg-[#2C6652] text-white font-medium text-xs border border-[#2F4238] transition-colors"
              title="Click to toggle between Customer and Studio Owner perspectives"
            >
              {isOwner ? <Shield className="size-3 text-[#E07A5F]" /> : <User className="size-3 text-[#C9A27E]" />}
              <span>{currentUser.fullName} ({isOwner ? 'Studio Owner' : 'Client'})</span>
              <span className="text-[10px] text-[#A3B3AA] underline ml-1">Switch</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Navbar */}
      <header className="sticky top-0 z-40 bg-[#FBF6EF]/95 backdrop-blur-md border-b border-[#E8DDCB]">
        <div className="max-w-6xl mx-auto px-4 sm:px-8 h-16 sm:h-18 flex items-center justify-between gap-4">
          {/* Brand */}
          <button
            onClick={() => handleLinkClick('booking')}
            className="flex items-center gap-3 text-left focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#1F4D3F] rounded-lg p-1 group"
            aria-label="Willow and Stone Home"
          >
            <div className="size-11 rounded-2xl bg-[#E3F1E8] flex items-center justify-center p-2.5 border border-[#C9A27E]/30 text-[#1F4D3F] group-hover:scale-105 transition-transform">
              <Scissors className="size-5" />
            </div>
            <div>
              <span className="block font-heading font-bold text-2xl text-[#1F2A24] leading-none">
                Willow & Stone
              </span>
              <span className="block font-body text-[11px] font-semibold text-[#6B7A72] uppercase tracking-widest mt-0.5">
                Hair & Styling · Ponsonby
              </span>
            </div>
          </button>

          {/* Desktop Nav */}
          <nav className="hidden lg:flex items-center gap-1.5" aria-label="Main Navigation">
            {activeNavItems.map((item) => {
              const isActive = currentTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleLinkClick(item.id)}
                  aria-current={isActive ? 'page' : undefined}
                  className={`px-4 py-2 rounded-xl font-body font-semibold text-sm transition-colors ${
                    isActive
                      ? 'bg-[#1F4D3F] text-[#FBF6EF] shadow-sm'
                      : 'text-[#1F2A24] hover:bg-[#F0E6D8] hover:text-[#1F4D3F]'
                  }`}
                >
                  {item.label}
                </button>
              );
            })}
          </nav>

          {/* Quick Actions */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => handleLinkClick(isOwner ? 'owner-dashboard' : 'booking')}
              className="hidden sm:inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-[#1F4D3F] hover:bg-[#2C6652] text-[#FBF6EF] font-body font-bold text-sm transition-all duration-150 shadow-sm active:scale-95"
            >
              <Calendar className="size-4" />
              <span>{isOwner ? 'Open Schedule' : 'Book Appointment'}</span>
            </button>

            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden size-11 flex items-center justify-center rounded-xl bg-[#F0E6D8] text-[#1F2A24] hover:bg-[#E8DDCB] transition-colors"
              aria-label={mobileMenuOpen ? 'Close menu' : 'Open menu'}
              aria-expanded={mobileMenuOpen}
            >
              {mobileMenuOpen ? <X className="size-5" /> : <Menu className="size-5" />}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 lg:hidden bg-black/40 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="fixed inset-y-0 right-0 w-full max-w-xs bg-[#FBF6EF] shadow-2xl flex flex-col justify-between p-6 overflow-y-auto">
            <div>
              <div className="flex items-center justify-between pb-6 border-b border-[#E8DDCB]">
                <div className="flex items-center gap-2">
                  <div className="size-8 rounded-xl bg-[#E3F1E8] flex items-center justify-center text-[#1F4D3F]">
                    <Scissors className="size-4" />
                  </div>
                  <span className="font-heading font-bold text-lg text-[#1F2A24]">Willow & Stone</span>
                </div>
                <button
                  onClick={() => setMobileMenuOpen(false)}
                  className="size-9 rounded-xl bg-[#F0E6D8] flex items-center justify-center text-[#1F2A24]"
                  aria-label="Close menu drawer"
                >
                  <X className="size-5" />
                </button>
              </div>

              <div className="mt-4 p-3 rounded-xl bg-[#F0E6D8] border border-[#E8DDCB] space-y-2">
                <span className="text-xs font-bold text-[#6B7A72] uppercase block">Role</span>
                <button
                  onClick={toggleRole}
                  className="w-full py-2 px-3 rounded-lg bg-[#1F4D3F] text-white text-xs font-bold text-center"
                >
                  Switch to {isOwner ? 'Client View' : 'Owner View'}
                </button>
              </div>

              <nav className="flex flex-col gap-1.5 mt-6" aria-label="Mobile Navigation">
                {activeNavItems.map((item) => {
                  const isActive = currentTab === item.id;
                  return (
                    <button
                      key={item.id}
                      onClick={() => handleLinkClick(item.id)}
                      className={`w-full text-left px-4 py-3 rounded-xl font-body font-semibold text-sm transition-colors ${
                        isActive
                          ? 'bg-[#1F4D3F] text-[#FBF6EF]'
                          : 'text-[#1F2A24] hover:bg-[#F0E6D8]'
                      }`}
                    >
                      {item.label}
                    </button>
                  );
                })}
              </nav>
            </div>

            <div className="pt-6 border-t border-[#E8DDCB] text-center">
              <p className="text-xs text-[#6B7A72]">
                142 Ponsonby Road, Auckland
              </p>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
