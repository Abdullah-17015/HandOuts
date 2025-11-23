
import React, { useState } from 'react';
import { ViewState, User } from '../types';
import { HeartHandshake, LayoutDashboard, Search, PlusCircle, User as UserIcon, Menu, X, LogIn, Settings, LogOut, Info } from 'lucide-react';

interface NavbarProps {
  currentView: ViewState;
  setView: (view: ViewState) => void;
  user: User | null;
  onLogout?: () => void;
}

const Navbar: React.FC<NavbarProps> = ({ currentView, setView, user, onLogout }) => {
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  // Only show navigation items if user is logged in
  const navItems = user ? [
    { id: 'HERO', label: 'Home', icon: null },
    { id: 'MARKETPLACE', label: 'Marketplace', icon: Search },
    { id: 'INTAKE', label: 'Request Help', icon: PlusCircle },
    { id: 'DASHBOARD', label: 'Insights', icon: LayoutDashboard },
  ] : [
    { id: 'HERO', label: 'Home', icon: null },
  ];

  const handleNav = (view: string) => {
    // If trying to access restricted pages without auth, send to login
    if (!user && (view === 'MARKETPLACE' || view === 'INTAKE' || view === 'DASHBOARD')) {
        setView('LOGIN');
    } else {
        setView(view as ViewState);
    }
    setIsMobileOpen(false);
  };

  const toggleProfileMenu = () => {
    setIsProfileOpen(!isProfileOpen);
  };

  return (
    <nav className="fixed top-0 w-full z-50 transition-all duration-300 glass-panel border-b border-white/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          {/* Logo */}
          <div 
            className="flex-shrink-0 cursor-pointer flex items-center gap-2 group"
            onClick={() => handleNav('HERO')}
          >
            <div className="bg-emerald-500/10 p-2 rounded-xl border border-emerald-500/20 group-hover:border-emerald-500/50 transition-colors">
               <HeartHandshake className="h-8 w-8 text-emerald-400" />
            </div>
            <span className="font-bold text-2xl tracking-tight text-white">
              Hand<span className="text-emerald-400">outs</span>
            </span>
          </div>

          {/* Desktop Nav */}
          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-4">
              {navItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => handleNav(item.id)}
                  className={`relative px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 group flex items-center gap-2 ${
                    currentView === item.id 
                      ? 'text-white bg-white/10 shadow-[0_0_15px_rgba(16,185,129,0.15)]' 
                      : 'text-slate-400 hover:text-white hover:bg-white/5'
                  }`}
                >
                  {item.icon && <item.icon className="w-4 h-4" />}
                  {item.label}
                  {currentView === item.id && (
                    <span className="absolute bottom-0 left-1/2 w-1/2 h-0.5 bg-emerald-400 -translate-x-1/2 rounded-full shadow-[0_0_10px_#34d399]" />
                  )}
                </button>
              ))}
              <button
                  onClick={() => handleNav('INFO')}
                  className={`relative px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 group flex items-center gap-2 ${
                    currentView === 'INFO'
                      ? 'text-white bg-white/10' 
                      : 'text-slate-400 hover:text-white hover:bg-white/5'
                  }`}
                >
                  <Info className="w-4 h-4" />
                  Info
              </button>
            </div>
          </div>

          {/* Profile / Login Action */}
          <div className="hidden md:flex items-center gap-4">
            {user ? (
                <div className="flex items-center gap-3 pl-4 border-l border-white/10 relative">
                   <div className="text-right hidden lg:block">
                      <div className="text-sm font-medium text-white">{user.name}</div>
                      <div className="text-xs text-emerald-400">{user.role === 'GIVER' ? 'Level 1 Giver' : 'Verified Needer'}</div>
                   </div>
                   
                   <div className="relative">
                       <button 
                          onClick={toggleProfileMenu}
                          className="h-10 w-10 rounded-full bg-slate-700 flex items-center justify-center border border-white/10 shadow-lg cursor-pointer hover:border-emerald-500/50 transition-colors"
                        >
                          <UserIcon className="w-5 h-5 text-emerald-400" />
                       </button>

                       {/* Dropdown */}
                       {isProfileOpen && (
                           <div className="absolute right-0 mt-2 w-48 bg-slate-800 rounded-xl shadow-2xl border border-white/10 py-2 animate-scale-in overflow-hidden">
                               <button 
                                  onClick={() => { setView('PROFILE'); setIsProfileOpen(false); }}
                                  className="w-full text-left px-4 py-2.5 text-sm text-slate-300 hover:bg-slate-700 hover:text-white flex items-center gap-2"
                               >
                                  <Settings className="w-4 h-4" /> Edit Profile
                               </button>
                               <div className="h-px bg-white/5 my-1"></div>
                               <button 
                                  onClick={() => { if(onLogout) onLogout(); setIsProfileOpen(false); }}
                                  className="w-full text-left px-4 py-2.5 text-sm text-red-400 hover:bg-red-500/10 flex items-center gap-2"
                               >
                                  <LogOut className="w-4 h-4" /> Sign Out
                               </button>
                           </div>
                       )}
                   </div>
                </div>
            ) : (
                <div className="flex items-center gap-3">
                    <button 
                       onClick={() => setView('LOGIN')}
                       className="text-sm font-medium text-slate-300 hover:text-white transition-colors"
                    >
                       Log In
                    </button>
                    <button 
                       onClick={() => setView('SIGNUP')}
                       className="bg-emerald-500 hover:bg-emerald-400 text-slate-900 text-sm font-bold py-2.5 px-5 rounded-xl shadow-[0_0_15px_rgba(16,185,129,0.3)] transition-all"
                    >
                       Get Started
                    </button>
                </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="-mr-2 flex md:hidden">
            <button
              onClick={() => setIsMobileOpen(!isMobileOpen)}
              className="bg-slate-800 p-2 rounded-md text-slate-400 hover:text-white hover:bg-slate-700 focus:outline-none"
            >
              {isMobileOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileOpen && (
        <div className="md:hidden glass-panel border-b border-white/10">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => handleNav(item.id)}
                className={`block w-full text-left px-3 py-2 rounded-md text-base font-medium ${
                  currentView === item.id
                    ? 'text-white bg-emerald-500/20'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800'
                }`}
              >
                <div className="flex items-center gap-3">
                    {item.icon && <item.icon className="w-5 h-5" />}
                    {item.label}
                </div>
              </button>
            ))}
            <button
                onClick={() => handleNav('INFO')}
                className={`block w-full text-left px-3 py-2 rounded-md text-base font-medium ${
                  currentView === 'INFO'
                    ? 'text-white bg-emerald-500/20'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800'
                }`}
              >
                <div className="flex items-center gap-3">
                    <Info className="w-5 h-5" />
                    Info
                </div>
              </button>
            
            {user ? (
                <>
                    <div className="h-px bg-white/10 my-2 mx-3"></div>
                    <button 
                        onClick={() => { setView('PROFILE'); setIsMobileOpen(false); }}
                        className="block w-full text-left px-3 py-2 rounded-md text-base font-medium text-slate-400 hover:text-white hover:bg-slate-800"
                    >
                        <div className="flex items-center gap-3">
                           <Settings className="w-5 h-5" /> Edit Profile
                        </div>
                    </button>
                    <button 
                        onClick={() => { if(onLogout) onLogout(); setIsMobileOpen(false); }}
                        className="block w-full text-left px-3 py-2 rounded-md text-base font-medium text-red-400 hover:bg-slate-800"
                    >
                        <div className="flex items-center gap-3">
                           <LogOut className="w-5 h-5" /> Sign Out
                        </div>
                    </button>
                </>
            ) : (
               <div className="pt-4 mt-4 border-t border-white/10 flex flex-col gap-2">
                   <button 
                      onClick={() => { setView('LOGIN'); setIsMobileOpen(false); }}
                      className="w-full text-center py-3 bg-slate-800 text-white rounded-lg font-medium"
                   >
                      Log In
                   </button>
                   <button 
                      onClick={() => { setView('SIGNUP'); setIsMobileOpen(false); }}
                      className="w-full text-center py-3 bg-emerald-500 text-slate-900 rounded-lg font-bold"
                   >
                      Get Started
                   </button>
               </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
