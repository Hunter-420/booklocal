import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { BookingView } from './views/BookingView';
import { ServicesView } from './views/ServicesView';
import { MyBookingsView } from './views/MyBookingsView';
import { OwnerDashboardView } from './views/OwnerDashboardView';
import { OwnerSettingsView } from './views/OwnerSettingsView';
import { LoginView } from './views/LoginView';
import { ContactView } from './views/ContactView';
import { NotFoundView } from './views/NotFoundView';
import { BookLocalStore } from './lib/store';
import { Profile } from './lib/types';

export const App: React.FC = () => {
  const [currentTab, setCurrentTab] = useState<string>('booking');
  const [currentUser, setCurrentUser] = useState<Profile>(() => BookLocalStore.getCurrentUser());

  useEffect(() => {
    const syncHash = () => {
      const rawHash = window.location.hash.replace('#', '').trim();
      const tab = rawHash.split('?')[0];
      if (!tab) {
        setCurrentTab('booking');
      } else {
        setCurrentTab(tab);
      }
    };

    syncHash();
    window.addEventListener('hashchange', syncHash);
    return () => window.removeEventListener('hashchange', syncHash);
  }, []);

  const handleNavigate = (tab: string) => {
    window.location.hash = tab;
    setCurrentTab(tab);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const renderView = () => {
    switch (currentTab) {
      case 'booking':
        return <BookingView onNavigate={handleNavigate} />;
      case 'services':
        return <ServicesView onNavigate={handleNavigate} />;
      case 'my-bookings':
        return <MyBookingsView onNavigate={handleNavigate} />;
      case 'owner-dashboard':
        return <OwnerDashboardView onNavigate={handleNavigate} />;
      case 'owner-settings':
        return <OwnerSettingsView />;
      case 'login':
        return <LoginView onNavigate={handleNavigate} onUserChange={setCurrentUser} />;
      case 'signup':
        return (
          <LoginView
            initialSignUp={true}
            onNavigate={handleNavigate}
            onUserChange={setCurrentUser}
          />
        );
      case 'contact':
        return <ContactView />;
      default:
        return <NotFoundView onNavigate={handleNavigate} />;
    }
  };

  return (
    <div className="min-h-dvh flex flex-col bg-[#FBF6EF] text-[#1F2A24] selection:bg-[#1F4D3F] selection:text-white">
      <Navbar
        currentTab={currentTab}
        onNavigate={handleNavigate}
        currentUser={currentUser}
        onUserChange={setCurrentUser}
      />
      <main className="flex-1">
        {renderView()}
      </main>
      <Footer onNavigate={handleNavigate} />
    </div>
  );
};
export default App;
