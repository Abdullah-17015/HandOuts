
import React, { useState } from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Marketplace from './components/Marketplace';
import IntakeForm from './components/IntakeForm';
import Dashboard from './components/Dashboard';
import Auth from './components/Auth';
import Onboarding from './components/Onboarding';
import Profile from './components/Profile';
import Info from './components/Info';
import Footer from './components/Footer';
import { ViewState, ItemRequest, User } from './types';
import { INITIAL_ITEMS } from './constants';

function App() {
  const [currentView, setView] = useState<ViewState>('HERO');
  const [items, setItems] = useState<ItemRequest[]>(INITIAL_ITEMS);
  const [user, setUser] = useState<User | null>(null);

  // Handler for Login/Signup completion
  const handleLogin = (userData: any) => {
    const newUser: User = {
      name: userData.name,
      email: userData.email,
      role: userData.role,
    };
    setUser(newUser);
    
    if (userData.isNewUser) {
      setView('ONBOARDING');
    } else {
      setView('MARKETPLACE');
    }
  };

  const handleLogout = () => {
      setUser(null);
      setView('HERO');
  };

  // Handler for Onboarding completion
  const handleOnboardingComplete = (updatedUser: User) => {
    setUser(updatedUser);
    setView('MARKETPLACE');
  };

  const handleProfileUpdate = (updatedUser: User) => {
      setUser(updatedUser);
      // Stay on profile briefly or switch? Profile component handles transition via onCancel/callback
  };

  const handleAddRequest = (req: ItemRequest) => {
    setItems((prev) => [req, ...prev]);
  };

  const renderView = () => {
    switch(currentView) {
      case 'HERO':
        return <Hero setView={setView} user={user} />;
      case 'LOGIN':
        return <Auth view="LOGIN" setView={setView} onLogin={handleLogin} />;
      case 'SIGNUP':
        return <Auth view="SIGNUP" setView={setView} onLogin={handleLogin} />;
      case 'ONBOARDING':
        return user ? <Onboarding user={user} onComplete={handleOnboardingComplete} /> : <Hero setView={setView} user={user} />;
      case 'MARKETPLACE':
        return user ? <Marketplace items={items} setView={setView} /> : <Auth view="LOGIN" setView={setView} onLogin={handleLogin} />;
      case 'INTAKE':
        return user ? <IntakeForm onAddRequest={handleAddRequest} setView={setView} /> : <Auth view="LOGIN" setView={setView} onLogin={handleLogin} />;
      case 'DASHBOARD':
        return user ? <Dashboard items={items} /> : <Auth view="LOGIN" setView={setView} onLogin={handleLogin} />;
      case 'PROFILE':
        return user ? <Profile user={user} onUpdate={handleProfileUpdate} onCancel={() => setView('MARKETPLACE')} /> : <Auth view="LOGIN" setView={setView} onLogin={handleLogin} />;
      case 'INFO':
        return <Info setView={setView} />;
      default:
        return <Hero setView={setView} user={user} />;
    }
  };

  // Determine if we should show the navbar (Hide on Auth/Onboarding screens for immersion)
  const showNavbar = !['LOGIN', 'SIGNUP', 'ONBOARDING'].includes(currentView);

  return (
    <div className="bg-slate-900 text-slate-50 min-h-screen flex flex-col font-sans selection:bg-emerald-500/30">
      {showNavbar && <Navbar currentView={currentView} setView={setView} user={user} onLogout={handleLogout} />}
      
      <main className="flex-grow relative">
        {/* Global Ambient Background Effects - Persistent across views */}
        <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-emerald-900/10 rounded-full blur-[100px] opacity-50"></div>
            <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-cyan-900/10 rounded-full blur-[100px] opacity-50"></div>
        </div>
        
        <div className="relative z-10">
          {renderView()}
        </div>
      </main>
      
      {showNavbar && <Footer />}
    </div>
  );
}

export default App;
