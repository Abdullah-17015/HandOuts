import React, { useState, useEffect } from 'react';
import { User, Category, UserRole, Badge } from '../types';
import { getProfileInsights } from '../services/geminiService';
import { 
  Save, User as UserIcon, MapPin, Settings, X, CheckCircle, 
  Award, Zap, TrendingUp, Heart, Gift, Share2, Shield, 
  History, Sparkles, Edit3, LogOut, Lock, ArrowLeft, ArrowRight,
  Flame, HandHeart, Smile, Building, Baby, Box, Link, Utensils
} from 'lucide-react';

interface ProfileProps {
  user: User;
  onUpdate: (user: User) => void;
  onCancel: () => void;
}

// Mock Data Generators with Lucide Components
const MOCK_BADGES: Badge[] = [
  { id: '1', name: 'First Need Posted', icon: <Heart className="w-6 h-6" />, unlocked: true, description: 'You took the first step!' },
  { id: '2', name: 'Community Builder', icon: <Building className="w-6 h-6" />, unlocked: true, description: 'Connected with 5 neighbors' },
  { id: '3', name: 'Local Hero', icon: <Shield className="w-6 h-6" />, unlocked: false, description: 'Complete 10 donations' },
  { id: '4', name: 'Kindness Streak', icon: <Flame className="w-6 h-6" />, unlocked: false, description: 'Active for 7 days straight' },
];

const MOCK_HISTORY = [
  { id: '1', action: 'MATCHED', title: 'Matched with "Winter Jacket"', date: '2 days ago', icon: <Link className="w-5 h-5" /> },
  { id: '2', action: 'CREATED_NEED', title: 'Requested "Baby Formula"', date: '5 days ago', icon: <Baby className="w-5 h-5" /> },
  { id: '3', action: 'CREATED_OFFER', title: 'Offered "Canned Goods"', date: '1 week ago', icon: <Utensils className="w-5 h-5" /> },
];

const Profile: React.FC<ProfileProps> = ({ user, onUpdate, onCancel }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [aiTip, setAiTip] = useState("Generating personalized insights...");
  
  // Form States
  const [name, setName] = useState(user.name);
  const [location, setLocation] = useState(user.location || '');
  const [preferences, setPreferences] = useState<string[]>(user.preferences || []);
  const [showSuccess, setShowSuccess] = useState(false);

  useEffect(() => {
    // Load AI insights on mount
    getProfileInsights(user.role, user.location || 'Toronto', user.preferences)
      .then(setAiTip);
  }, [user]);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    const updatedUser = { ...user, name, location, preferences };
    onUpdate(updatedUser);
    setShowSuccess(true);
    setTimeout(() => {
        setShowSuccess(false);
        setIsEditing(false);
    }, 1500);
  };

  const toggleCategory = (cat: string) => {
    if (preferences.includes(cat)) {
      setPreferences(preferences.filter(c => c !== cat));
    } else {
      setPreferences([...preferences, cat]);
    }
  };

  // Visual Helpers
  const getRoleColor = (role: UserRole) => role === 'GIVER' ? 'text-emerald-400' : 'text-orange-400';
  const getRoleBg = (role: UserRole) => role === 'GIVER' ? 'bg-emerald-500/20 border-emerald-500/50' : 'bg-orange-500/20 border-orange-500/50';

  // --- EDIT MODE RENDER ---
  if (isEditing) {
    return (
      <div className="min-h-screen pt-28 pb-20 px-4 flex justify-center animate-fade-in-up">
        <div className="w-full max-w-2xl">
          <div className="flex items-center justify-between mb-8">
              <h2 className="text-3xl font-bold text-white flex items-center gap-3">
                  <div className="p-2 bg-emerald-500/10 rounded-xl border border-emerald-500/20">
                      <Settings className="w-6 h-6 text-emerald-400" />
                  </div>
                  Edit Profile
              </h2>
              <button onClick={() => setIsEditing(false)} className="p-2 hover:bg-slate-800 rounded-full transition-colors">
                  <X className="w-6 h-6 text-slate-400" />
              </button>
          </div>

          <div className="glass-card rounded-3xl p-8 border border-white/10 relative overflow-hidden">
              {showSuccess && (
                  <div className="absolute inset-0 bg-slate-900/90 backdrop-blur-sm z-20 flex items-center justify-center flex-col animate-fade-in-up">
                      <CheckCircle className="w-16 h-16 text-emerald-500 mb-4" />
                      <h3 className="text-2xl font-bold text-white">Profile Saved!</h3>
                  </div>
              )}

              <form onSubmit={handleSave} className="space-y-8">
                  <div className="space-y-4">
                      <h3 className="text-lg font-semibold text-white border-b border-white/10 pb-2">Basic Information</h3>
                      <div className="grid grid-cols-1 gap-4">
                          <div>
                              <label className="block text-sm font-medium text-slate-400 mb-1">Full Name</label>
                              <div className="relative">
                                  <input 
                                      type="text" 
                                      value={name}
                                      onChange={(e) => setName(e.target.value)}
                                      className="w-full bg-slate-900/50 border border-slate-700 rounded-xl py-3 pl-10 pr-4 text-white focus:border-emerald-500 focus:outline-none transition-colors"
                                  />
                                  <UserIcon className="absolute left-3 top-3.5 w-5 h-5 text-slate-500" />
                              </div>
                          </div>
                          
                          <div>
                              <label className="block text-sm font-medium text-slate-400 mb-1">Location</label>
                              <div className="relative">
                                  <input 
                                      type="text" 
                                      value={location}
                                      onChange={(e) => setLocation(e.target.value)}
                                      className="w-full bg-slate-900/50 border border-slate-700 rounded-xl py-3 pl-10 pr-4 text-white focus:border-emerald-500 focus:outline-none transition-colors"
                                  />
                                  <MapPin className="absolute left-3 top-3.5 w-5 h-5 text-slate-500" />
                              </div>
                          </div>
                      </div>
                  </div>

                  <div className="space-y-4">
                      <h3 className="text-lg font-semibold text-white border-b border-white/10 pb-2">
                          {user.role === 'GIVER' ? 'Donation Preferences' : 'Needs Preferences'}
                      </h3>
                      <div className="flex flex-wrap gap-2">
                          {Object.values(Category).map((cat) => (
                              <button
                                  key={cat}
                                  type="button"
                                  onClick={() => toggleCategory(cat)}
                                  className={`px-4 py-2 rounded-full text-sm font-medium border transition-all ${
                                      preferences.includes(cat)
                                          ? 'bg-emerald-500/20 border-emerald-500 text-emerald-400'
                                          : 'bg-slate-800 border-white/5 text-slate-400 hover:text-white'
                                  }`}
                              >
                                  {cat}
                              </button>
                          ))}
                      </div>
                  </div>

                  <div className="pt-4 flex justify-end gap-4">
                      <button 
                          type="button" 
                          onClick={() => setIsEditing(false)}
                          className="px-6 py-3 text-slate-400 font-medium hover:text-white transition-colors"
                      >
                          Cancel
                      </button>
                      <button 
                          type="submit"
                          className="px-8 py-3 bg-emerald-500 hover:bg-emerald-400 text-slate-900 font-bold rounded-xl shadow-lg shadow-emerald-500/20 flex items-center gap-2 transition-all active:scale-95"
                      >
                          <Save className="w-5 h-5" /> Save Changes
                      </button>
                  </div>
              </form>
          </div>
        </div>
      </div>
    );
  }

  // --- DASHBOARD RENDER ---
  return (
    <div className="min-h-screen pt-24 pb-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        
        {/* BACK BUTTON */}
        <div className="mb-6">
            <button 
                onClick={onCancel}
                className="text-slate-400 hover:text-white flex items-center gap-2 text-sm font-medium transition-colors"
            >
                <ArrowLeft className="w-5 h-5" /> Back to Dashboard
            </button>
        </div>

        {/* 1. HERO PROFILE CARD */}
        <div className="glass-card rounded-[32px] p-8 mb-8 relative overflow-hidden border border-emerald-500/20 animate-fade-in-up">
            {/* Background Gradients */}
            <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-gradient-to-br from-emerald-500/10 to-teal-500/10 rounded-full blur-[80px] -z-10"></div>
            <div className="absolute bottom-0 left-0 w-[300px] h-[300px] bg-cyan-500/5 rounded-full blur-[60px] -z-10"></div>

            <div className="flex flex-col md:flex-row items-center gap-8">
                {/* Avatar */}
                <div className="relative group cursor-pointer">
                    <div className="w-32 h-32 rounded-full bg-gradient-to-br from-emerald-400 via-teal-500 to-cyan-500 p-1 shadow-[0_0_40px_rgba(16,185,129,0.4)] group-hover:scale-105 transition-transform duration-500">
                        <div className="w-full h-full rounded-full bg-slate-900 flex items-center justify-center overflow-hidden relative">
                           {/* Pseudo-Avatar */}
                           <div className="text-4xl font-bold text-white">{user.name.charAt(0)}</div>
                        </div>
                    </div>
                    <div className="absolute bottom-1 right-1 w-8 h-8 bg-slate-900 rounded-full flex items-center justify-center border border-white/10">
                        <div className="w-4 h-4 bg-emerald-500 rounded-full animate-pulse"></div>
                    </div>
                </div>

                {/* Info */}
                <div className="text-center md:text-left flex-1">
                    <div className="flex flex-col md:flex-row items-center gap-3 mb-2">
                        <h1 className="text-4xl font-bold text-white tracking-tight">{user.name}</h1>
                        <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-widest border ${getRoleBg(user.role)} ${getRoleColor(user.role)}`}>
                            {user.role === 'NEEDER' ? 'Verified Needer' : 'Level 1 Giver'}
                        </span>
                    </div>
                    
                    <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 text-slate-400 text-sm mb-6">
                        <div className="flex items-center gap-1">
                            <MapPin className="w-4 h-4 text-emerald-500" /> {user.location || 'Unknown Location'}
                        </div>
                        <div className="flex items-center gap-1">
                           <Sparkles className="w-4 h-4 text-yellow-400" /> Joined Oct 2024
                        </div>
                    </div>

                    {/* Stats Row */}
                    <div className="flex gap-8 border-t border-white/10 pt-6 justify-center md:justify-start">
                        <div className="text-center md:text-left">
                            <p className="text-xs text-slate-500 uppercase tracking-wider font-bold mb-1">Needs</p>
                            <p className="text-2xl font-bold text-white">3</p>
                        </div>
                        <div className="text-center md:text-left">
                            <p className="text-xs text-slate-500 uppercase tracking-wider font-bold mb-1">Offers</p>
                            <p className="text-2xl font-bold text-white">7</p>
                        </div>
                        <div className="text-center md:text-left">
                            <p className="text-xs text-slate-500 uppercase tracking-wider font-bold mb-1">Impact</p>
                            <p className="text-2xl font-bold text-emerald-400">High</p>
                        </div>
                    </div>
                </div>

                {/* Community Score Dial (Simplified) */}
                <div className="hidden lg:flex flex-col items-center justify-center w-40 h-40 relative group">
                    <svg className="w-full h-full rotate-[-90deg]" viewBox="0 0 36 36">
                        <path className="text-slate-800" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="currentColor" strokeWidth="2" />
                        <path className="text-emerald-500 drop-shadow-[0_0_10px_rgba(16,185,129,0.5)]" strokeDasharray="75, 100" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
                    </svg>
                    <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                        <span className="text-2xl font-bold text-white group-hover:scale-110 transition-transform">750</span>
                        <span className="text-[10px] text-slate-400 uppercase font-bold">Points</span>
                    </div>
                </div>
            </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            
            {/* LEFT COL: Quick Actions & Info */}
            <div className="space-y-8 lg:col-span-1">
                {/* Quick Actions - FUN & BOUNCY */}
                <div className="glass-panel rounded-2xl p-6">
                    <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                        <Zap className="w-5 h-5 text-yellow-400" /> Quick Actions
                    </h3>
                    <div className="grid grid-cols-1 gap-3">
                        {user.role === 'NEEDER' ? (
                            <>
                                <button onClick={onCancel} className="group relative flex items-center justify-between p-4 rounded-2xl bg-gradient-to-r from-slate-800 to-slate-800 hover:from-orange-500/20 hover:to-red-500/20 border border-white/5 hover:border-orange-500/50 transition-all active:scale-95">
                                    <div className="flex items-center gap-3">
                                        <div className="p-2.5 bg-orange-500/20 rounded-xl group-hover:bg-orange-500/30 group-hover:scale-110 transition-transform shadow-lg shadow-orange-500/10">
                                            <Heart className="w-5 h-5 text-orange-400" />
                                        </div>
                                        <span className="font-bold text-slate-200 group-hover:text-white">I Need Something</span>
                                    </div>
                                    <Heart className="w-5 h-5 text-slate-500 group-hover:text-orange-400 transition-colors" />
                                </button>
                                
                                <button className="group relative flex items-center justify-between p-4 rounded-2xl bg-gradient-to-r from-slate-800 to-slate-800 hover:from-blue-500/20 hover:to-indigo-500/20 border border-white/5 hover:border-blue-500/50 transition-all active:scale-95">
                                    <div className="flex items-center gap-3">
                                        <div className="p-2.5 bg-blue-500/20 rounded-xl group-hover:bg-blue-500/30 group-hover:scale-110 transition-transform shadow-lg shadow-blue-500/10">
                                            <History className="w-5 h-5 text-blue-400" />
                                        </div>
                                        <span className="font-bold text-slate-200 group-hover:text-white">View My Requests</span>
                                    </div>
                                    <ArrowRight className="w-5 h-5 text-slate-500 group-hover:text-blue-400 transition-colors" />
                                </button>
                            </>
                        ) : (
                            <>
                                <button onClick={onCancel} className="group relative flex items-center justify-between p-4 rounded-2xl bg-gradient-to-r from-slate-800 to-slate-800 hover:from-emerald-500/20 hover:to-teal-500/20 border border-white/5 hover:border-emerald-500/50 transition-all active:scale-95">
                                    <div className="flex items-center gap-3">
                                        <div className="p-2.5 bg-emerald-500/20 rounded-xl group-hover:bg-emerald-500/30 group-hover:scale-110 transition-transform shadow-lg shadow-emerald-500/10">
                                            <Gift className="w-5 h-5 text-emerald-400" />
                                        </div>
                                        <span className="font-bold text-slate-200 group-hover:text-white">Give Something</span>
                                    </div>
                                    <Gift className="w-5 h-5 text-slate-500 group-hover:text-emerald-400 transition-colors" />
                                </button>

                                <button className="group relative flex items-center justify-between p-4 rounded-2xl bg-gradient-to-r from-slate-800 to-slate-800 hover:from-cyan-500/20 hover:to-sky-500/20 border border-white/5 hover:border-cyan-500/50 transition-all active:scale-95">
                                    <div className="flex items-center gap-3">
                                        <div className="p-2.5 bg-cyan-500/20 rounded-xl group-hover:bg-cyan-500/30 group-hover:scale-110 transition-transform shadow-lg shadow-cyan-500/10">
                                            <TrendingUp className="w-5 h-5 text-cyan-400" />
                                        </div>
                                        <span className="font-bold text-slate-200 group-hover:text-white">Impact Insights</span>
                                    </div>
                                    <ArrowRight className="w-5 h-5 text-slate-500 group-hover:text-cyan-400 transition-colors" />
                                </button>
                            </>
                        )}
                    </div>
                </div>

                {/* Personal Data */}
                <div className="glass-panel rounded-2xl p-6">
                    <div className="flex justify-between items-center mb-4">
                        <h3 className="text-lg font-bold text-white flex items-center gap-2">
                            <Shield className="w-5 h-5 text-emerald-400" /> My Data
                        </h3>
                        <button onClick={() => setIsEditing(true)} className="text-xs text-emerald-400 hover:text-white transition-colors">Edit</button>
                    </div>
                    <div className="space-y-4">
                        <div className="group flex items-center justify-between p-3 rounded-lg hover:bg-white/5 transition-colors">
                            <span className="text-sm text-slate-400">Name</span>
                            <span className="text-sm text-white font-medium group-hover:text-emerald-400 transition-colors flex items-center gap-2">
                                {user.name} <Smile className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                            </span>
                        </div>
                        <div className="group flex items-center justify-between p-3 rounded-lg hover:bg-white/5 transition-colors">
                            <span className="text-sm text-slate-400">Email</span>
                            <span className="text-sm text-white font-medium group-hover:text-emerald-400 transition-colors flex items-center gap-2">
                                {user.email} <Box className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                            </span>
                        </div>
                        <div className="group flex items-center justify-between p-3 rounded-lg hover:bg-white/5 transition-colors">
                            <span className="text-sm text-slate-400">Location</span>
                            <span className="text-sm text-white font-medium group-hover:text-emerald-400 transition-colors flex items-center gap-2">
                                {user.location || 'Not set'} <MapPin className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                            </span>
                        </div>
                    </div>
                </div>
            </div>

            {/* CENTER/RIGHT COL: Impact, AI, History */}
            <div className="lg:col-span-2 space-y-8">
                
                {/* 2. IMPACT TRACKER */}
                <div className="glass-card rounded-2xl p-6 border border-white/10">
                    <div className="flex justify-between items-end mb-6">
                        <div>
                            <h3 className="text-lg font-bold text-white mb-1">Impact Tracker</h3>
                            <p className="text-xs text-slate-400">Unlock badges by helping your community.</p>
                        </div>
                        <span className="text-sm font-bold text-emerald-400">Level 3 Helper</span>
                    </div>
                    
                    {/* Progress Bar */}
                    <div className="w-full h-4 bg-slate-800 rounded-full mb-8 overflow-hidden relative">
                        <div className="absolute top-0 left-0 h-full bg-gradient-to-r from-emerald-500 to-cyan-500 w-[70%] shadow-[0_0_15px_#10b981]"></div>
                        {/* Milestones */}
                        <div className="absolute top-0 left-[33%] h-full w-0.5 bg-slate-900/50"></div>
                        <div className="absolute top-0 left-[66%] h-full w-0.5 bg-slate-900/50"></div>
                    </div>

                    {/* Badges */}
                    <div className="grid grid-cols-4 gap-4">
                        {MOCK_BADGES.map(badge => (
                            <div key={badge.id} className={`group relative flex flex-col items-center justify-center p-4 rounded-xl border transition-all ${badge.unlocked ? 'bg-slate-800/50 border-emerald-500/30 hover:border-emerald-400' : 'bg-slate-900/50 border-white/5 opacity-50 grayscale'}`}>
                                <div className="mb-2 group-hover:scale-125 transition-transform text-white">{badge.icon}</div>
                                <span className="text-[10px] font-bold text-center text-slate-300 leading-tight">{badge.name}</span>
                                {badge.unlocked && (
                                    <div className="absolute -top-1 -right-1 w-2 h-2 bg-emerald-400 rounded-full shadow-glow animate-pulse"></div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>

                {/* 5. AI RECOMMENDATION PANEL */}
                <div className="glass-card rounded-2xl p-6 relative overflow-hidden border border-emerald-500/30">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/10 rounded-full blur-2xl"></div>
                    <div className="flex gap-4 relative z-10">
                        <div className="w-12 h-12 bg-emerald-500/20 rounded-full flex items-center justify-center flex-shrink-0">
                            <Sparkles className="w-6 h-6 text-emerald-400" />
                        </div>
                        <div>
                            <h3 className="text-lg font-bold text-white mb-2">Gemini Insights</h3>
                            <div className="p-4 bg-slate-900/50 rounded-xl border border-white/5">
                                <p className="text-slate-300 italic text-sm leading-relaxed">
                                    "{aiTip}"
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* 6. HISTORY SECTION */}
                <div className="glass-panel rounded-2xl p-6">
                    <h3 className="text-lg font-bold text-white mb-6">Activity History</h3>
                    <div className="relative border-l border-white/10 ml-3 space-y-8">
                        {MOCK_HISTORY.map((item, idx) => (
                            <div key={item.id} className="relative pl-8 group cursor-pointer">
                                <div className="absolute -left-[21px] top-0 w-10 h-10 bg-slate-800 border border-white/10 rounded-full flex items-center justify-center group-hover:scale-110 group-hover:border-emerald-500 transition-all z-10 shadow-lg text-slate-300 group-hover:text-emerald-400">
                                    <span className="text-lg">{item.icon}</span>
                                </div>
                                <div>
                                    <p className="text-white font-medium group-hover:text-emerald-400 transition-colors">{item.title}</p>
                                    <p className="text-xs text-slate-500">{item.date}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

            </div>
        </div>

        {/* 10. STICKY FOOTER ACTIONS */}
        <div className="fixed bottom-0 left-0 w-full bg-slate-900/80 backdrop-blur-lg border-t border-white/10 py-4 px-6 z-40 flex justify-between items-center md:hidden">
            <button onClick={() => setIsEditing(true)} className="flex flex-col items-center gap-1 text-slate-400 hover:text-white">
                <Edit3 className="w-5 h-5" /> <span className="text-[10px]">Edit</span>
            </button>
            <button className="flex flex-col items-center gap-1 text-slate-400 hover:text-white">
                <Lock className="w-5 h-5" /> <span className="text-[10px]">Privacy</span>
            </button>
            <button onClick={onCancel} className="flex flex-col items-center gap-1 text-red-400 hover:text-red-300">
                <LogOut className="w-5 h-5" /> <span className="text-[10px]">Exit</span>
            </button>
        </div>
    </div>
  );
};

export default Profile;