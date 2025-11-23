
import React, { useState } from 'react';
import { ViewState, UserRole } from '../types';
import { HeartHandshake, Heart, HandPlatter, ArrowRight, Mail, Lock, Loader2, Bot, ArrowLeft } from 'lucide-react';

interface AuthProps {
  view: 'LOGIN' | 'SIGNUP';
  setView: (view: ViewState) => void;
  onLogin: (user: any) => void;
}

const Auth: React.FC<AuthProps> = ({ view, setView, onLogin }) => {
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  
  // Signup specific states
  const [signupStep, setSignupStep] = useState<1 | 2>(1); // 1: Role, 2: Details
  const [selectedRole, setSelectedRole] = useState<UserRole>(null);
  const [name, setName] = useState('');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    // Simulate API call
    setTimeout(() => {
      setLoading(false);
      onLogin({ name: 'Demo User', email, role: 'GIVER' }); // Assume existing user is a giver for demo
    }, 1500);
  };

  const handleSignup = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    // Simulate API call
    setTimeout(() => {
      setLoading(false);
      // Pass partial user data to App, expecting redirection to Onboarding
      onLogin({ name, email, role: selectedRole, isNewUser: true });
    }, 1500);
  };

  // Micro-interaction: Gemini Bot Greeting
  const [showBot, setShowBot] = useState(false);
  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
    if (e.target.value.length > 5 && !showBot) setShowBot(true);
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 pt-20 pb-12 relative overflow-hidden">
      
      {/* Back Button (if not on login) */}
      <div className="absolute top-24 left-4 md:left-8">
          <button 
              onClick={() => setView('HERO')}
              className="text-slate-400 hover:text-white flex items-center gap-2 text-sm font-medium transition-colors"
          >
              <ArrowLeft className="w-5 h-5" /> Back to Home
          </button>
      </div>

      {/* Ambient Background */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-emerald-500/5 rounded-full blur-[120px] -z-10 animate-pulse-slow"></div>

      <div className="w-full max-w-md relative">
        
        {/* 3D Logo Animation Placeholder */}
        <div className="flex justify-center mb-8">
          <div className="relative w-16 h-16 bg-slate-800 rounded-2xl flex items-center justify-center border border-emerald-500/30 shadow-[0_0_30px_rgba(16,185,129,0.2)] animate-float">
             <HeartHandshake className="w-8 h-8 text-emerald-400" />
             <div className="absolute inset-0 border border-emerald-400/20 rounded-2xl animate-ping opacity-20"></div>
          </div>
        </div>

        <div className="glass-card p-8 rounded-3xl border border-white/10 relative overflow-hidden animate-scale-in">
          
          {/* Header */}
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-white mb-2">
              {view === 'LOGIN' ? 'Welcome back, helper.' : signupStep === 1 ? 'Choose your path' : 'Create account'}
            </h2>
            <p className="text-slate-400 text-sm">
              {view === 'LOGIN' ? 'Ready to make an impact today?' : signupStep === 1 ? 'Tell us how you want to join.' : 'Just a few details to get started.'}
            </p>
          </div>

          {/* --- LOGIN FORM --- */}
          {view === 'LOGIN' && (
            <form onSubmit={handleLogin} className="space-y-5">
              <div className="relative group">
                <Mail className="absolute left-4 top-3.5 w-5 h-5 text-slate-500 group-focus-within:text-emerald-400 transition-colors" />
                <input 
                  type="email" 
                  value={email}
                  onChange={handleEmailChange}
                  placeholder="Email address"
                  className="w-full bg-slate-900/50 border border-slate-700 rounded-xl py-3 pl-12 pr-4 text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 transition-all"
                  required
                />
                {/* Bot Micro-interaction */}
                {showBot && (
                  <div className="absolute -right-12 top-0 animate-fade-in-up hidden sm:block">
                    <div className="bg-slate-800 text-[10px] p-2 rounded-lg border border-emerald-500/30 text-emerald-400 shadow-lg mb-1 w-24 text-center">
                       I remember you!
                    </div>
                    <Bot className="w-6 h-6 text-emerald-500 mx-auto" />
                  </div>
                )}
              </div>

              <div className="relative group">
                <Lock className="absolute left-4 top-3.5 w-5 h-5 text-slate-500 group-focus-within:text-emerald-400 transition-colors" />
                <input 
                  type="password" 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Password"
                  className="w-full bg-slate-900/50 border border-slate-700 rounded-xl py-3 pl-12 pr-4 text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 transition-all"
                  required
                />
              </div>

              <div className="flex justify-end">
                 <button type="button" className="text-xs text-slate-400 hover:text-emerald-400 transition-colors">Forgot password?</button>
              </div>

              <button 
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-900 font-bold py-3.5 rounded-xl shadow-lg shadow-emerald-500/20 transform active:scale-[0.98] transition-all flex items-center justify-center gap-2"
              >
                {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Log In'}
              </button>
            </form>
          )}

          {/* --- SIGNUP: ROLE SELECTION --- */}
          {view === 'SIGNUP' && signupStep === 1 && (
            <div className="grid grid-cols-1 gap-4 animate-slide-up">
              <button
                onClick={() => { setSelectedRole('NEEDER'); setSignupStep(2); }}
                className="group relative p-6 rounded-2xl bg-slate-800/40 border border-white/5 hover:bg-slate-800/80 hover:border-orange-400/50 transition-all text-left hover:scale-[1.02]"
              >
                 <div className="w-12 h-12 rounded-full bg-orange-500/20 flex items-center justify-center mb-4 group-hover:bg-orange-500/30 transition-colors">
                    <HandPlatter className="w-6 h-6 text-orange-400" />
                 </div>
                 <h3 className="text-lg font-bold text-white mb-1">I Need Help</h3>
                 <p className="text-xs text-slate-400">Get essentials from local givers, fast.</p>
                 <div className="absolute top-4 right-4 w-4 h-4 border border-white/20 rounded-full group-hover:border-orange-400"></div>
              </button>

              <button
                onClick={() => { setSelectedRole('GIVER'); setSignupStep(2); }}
                className="group relative p-6 rounded-2xl bg-slate-800/40 border border-white/5 hover:bg-slate-800/80 hover:border-emerald-400/50 transition-all text-left hover:scale-[1.02]"
              >
                 <div className="w-12 h-12 rounded-full bg-emerald-500/20 flex items-center justify-center mb-4 group-hover:bg-emerald-500/30 transition-colors">
                    <Heart className="w-6 h-6 text-emerald-400" />
                 </div>
                 <h3 className="text-lg font-bold text-white mb-1">I Want to Help</h3>
                 <p className="text-xs text-slate-400">Share what you have. Make someone's day.</p>
                 <div className="absolute top-4 right-4 w-4 h-4 border border-white/20 rounded-full group-hover:border-emerald-400"></div>
              </button>
            </div>
          )}

          {/* --- SIGNUP: DETAILS FORM --- */}
          {view === 'SIGNUP' && signupStep === 2 && (
             <form onSubmit={handleSignup} className="space-y-4 animate-slide-up">
                <div className="flex items-center gap-2 mb-2 text-sm text-emerald-400 cursor-pointer hover:underline" onClick={() => setSignupStep(1)}>
                   <ArrowRight className="w-4 h-4 rotate-180" /> Back to roles
                </div>
                <input 
                  type="text" 
                  placeholder="Your Name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-slate-900/50 border border-slate-700 rounded-xl py-3 px-4 text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 transition-all"
                  required
                />
                <input 
                  type="email" 
                  placeholder="Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-slate-900/50 border border-slate-700 rounded-xl py-3 px-4 text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 transition-all"
                  required
                />
                <input 
                  type="password" 
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-slate-900/50 border border-slate-700 rounded-xl py-3 px-4 text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 transition-all"
                  required
                />
                <div className="pt-2">
                   <button 
                      type="submit"
                      disabled={loading}
                      className="w-full bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-900 font-bold py-3.5 rounded-xl shadow-lg shadow-emerald-500/20 transform active:scale-[0.98] transition-all flex items-center justify-center gap-2"
                   >
                      {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Create Account'}
                   </button>
                </div>
             </form>
          )}

          {/* Toggle Login/Signup */}
          <div className="mt-8 text-center border-t border-white/5 pt-6">
             <p className="text-slate-400 text-sm">
               {view === 'LOGIN' ? "Don't have an account? " : "Already have an account? "}
               <button 
                 onClick={() => setView(view === 'LOGIN' ? 'SIGNUP' : 'LOGIN')}
                 className="text-emerald-400 font-semibold hover:text-emerald-300 transition-colors"
               >
                 {view === 'LOGIN' ? 'Join the movement' : 'Log in'}
               </button>
             </p>
          </div>

        </div>
      </div>
    </div>
  );
};

export default Auth;
