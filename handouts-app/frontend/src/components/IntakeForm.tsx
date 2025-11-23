
import React, { useState, useEffect } from 'react';
import { ItemRequest, Category, UrgencyLevel, ViewState } from '../types';
import { optimizeDescription } from '../services/geminiService';
import { 
  Wand2, Loader2, CheckCircle, MapPin, 
  Heart, HandPlatter, Camera, Zap, ArrowRight, ArrowLeft,
  Info, AlertTriangle
} from 'lucide-react';

interface IntakeFormProps {
  onAddRequest: (req: ItemRequest) => void;
  setView: (view: ViewState) => void;
}

// --- SOUND UTILS ---
const playPopSound = () => {
  try {
    const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
    if (!AudioContext) return;
    const ctx = new AudioContext();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(600, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(300, ctx.currentTime + 0.15);
    gain.gain.setValueAtTime(0.15, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.15);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start();
    osc.stop(ctx.currentTime + 0.15);
  } catch (e) {}
};

const playSuccessSound = () => {
  try {
    const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
    if (!AudioContext) return;
    const ctx = new AudioContext();
    const now = ctx.currentTime;
    [440, 554, 659].forEach((freq, i) => {
        const osc = ctx.createOscillator();
        const g = ctx.createGain();
        osc.frequency.setValueAtTime(freq, now + i*0.1);
        g.gain.setValueAtTime(0.1, now + i*0.1);
        g.gain.exponentialRampToValueAtTime(0.01, now + i*0.1 + 0.5);
        osc.connect(g);
        g.connect(ctx.destination);
        osc.start(now + i*0.1);
        osc.stop(now + i*0.1 + 0.5);
    });
  } catch (e) {}
};

// --- DATA ---
const QUICK_CATEGORIES = [
  { id: Category.FOOD, label: 'Food', icon: '🥫' },
  { id: Category.CLOTHES_ADULT, label: 'Clothes', icon: '👕' },
  { id: Category.BABY, label: 'Baby', icon: '🍼' },
  { id: Category.HYGIENE, label: 'Hygiene', icon: '🧼' },
  { id: Category.BEDDING, label: 'Winter', icon: '🧤' },
  { id: Category.OTHER, label: 'Other', icon: '🎒' },
];

const IntakeForm: React.FC<IntakeFormProps> = ({ onAddRequest, setView }) => {
  // Mode State
  const [mode, setMode] = useState<'NEED' | 'OFFER' | null>(null);
  const [isSuccess, setIsSuccess] = useState(false);

  // Form Data
  const [category, setCategory] = useState<string | null>(null);
  const [description, setDescription] = useState('');
  const [urgency, setUrgency] = useState(2); // 1-4 for slider
  const [quantity, setQuantity] = useState(1);
  const [pickupTime, setPickupTime] = useState('Morning'); // Giver only

  // AI States
  const [isOptimizing, setIsOptimizing] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // --- HELPERS ---
  const handleOptimize = async () => {
    if (!description) return;
    playPopSound();
    setIsOptimizing(true);
    const improved = await optimizeDescription(description, mode || 'NEED');
    setDescription(improved);
    setIsOptimizing(false);
  };

  const handleSubmit = () => {
    if (!category || !description) return;
    playSuccessSound();
    setIsSubmitting(true);
    
    // Simulate API delay
    setTimeout(() => {
        setIsSubmitting(false);
        setIsSuccess(true);
        // Add to global state
        onAddRequest({
            id: Math.random().toString(),
            title: `${category} Request`, // Simplified for this flow
            description,
            category: category as Category,
            urgency: urgency as UrgencyLevel,
            location: 'Downtown', // Mock
            createdAt: new Date().toISOString(),
            distanceKm: 0.5,
            type: mode || 'NEED'
        });
    }, 1500);
  };

  // --- UI PARTIALS ---
  
  // 1. MODE SELECTION
  if (!mode) {
      return (
          <div className="min-h-screen pt-28 pb-12 px-4 flex items-center justify-center animate-fade-in-up flex-col relative">
              
              {/* BACK BUTTON */}
              <div className="absolute top-24 left-4 md:left-8">
                <button 
                    onClick={() => setView('MARKETPLACE')}
                    className="text-slate-400 hover:text-white flex items-center gap-2 text-sm font-medium transition-colors"
                >
                    <ArrowLeft className="w-5 h-5" /> Back to Marketplace
                </button>
              </div>

              <div className="w-full max-w-4xl grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
                  {/* NEEDER CARD */}
                  <button 
                     onClick={() => setMode('NEED')}
                     className="group relative h-[400px] rounded-[32px] bg-gradient-to-br from-orange-500/10 to-red-500/10 border border-orange-500/20 hover:border-orange-500/50 transition-all flex flex-col items-center justify-center p-8 overflow-hidden hover:scale-[1.02]"
                  >
                      <div className="absolute top-0 right-0 w-64 h-64 bg-orange-500/10 rounded-full blur-[80px] -translate-y-1/2 translate-x-1/2"></div>
                      <div className="p-6 bg-orange-500/20 rounded-full mb-6 group-hover:scale-110 transition-transform shadow-[0_0_30px_rgba(249,115,22,0.2)]">
                          <Heart className="w-12 h-12 text-orange-400" />
                      </div>
                      <h2 className="text-3xl font-black text-white mb-2">I Need This</h2>
                      <p className="text-slate-400 text-center max-w-xs">Tell us what you need. We'll connect you with kind neighbors nearby.</p>
                      <span className="mt-8 px-6 py-3 bg-orange-500 text-white font-bold rounded-xl shadow-lg group-hover:shadow-orange-500/25 transition-all flex items-center gap-2">
                        Start Request <ArrowRight className="w-4 h-4" />
                      </span>
                  </button>

                  {/* GIVER CARD */}
                  <button 
                     onClick={() => setMode('OFFER')}
                     className="group relative h-[400px] rounded-[32px] bg-gradient-to-br from-emerald-500/10 to-teal-500/10 border border-emerald-500/20 hover:border-emerald-500/50 transition-all flex flex-col items-center justify-center p-8 overflow-hidden hover:scale-[1.02]"
                  >
                      <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/10 rounded-full blur-[80px] -translate-y-1/2 translate-x-1/2"></div>
                      <div className="p-6 bg-emerald-500/20 rounded-full mb-6 group-hover:scale-110 transition-transform shadow-[0_0_30px_rgba(16,185,129,0.2)]">
                          <HandPlatter className="w-12 h-12 text-emerald-400" />
                      </div>
                      <h2 className="text-3xl font-black text-white mb-2">I Want to Help</h2>
                      <p className="text-slate-400 text-center max-w-xs">Share what you have. Make someone's day a little brighter.</p>
                      <span className="mt-8 px-6 py-3 bg-emerald-500 text-slate-900 font-bold rounded-xl shadow-lg group-hover:shadow-emerald-500/25 transition-all flex items-center gap-2">
                        Give Help <ArrowRight className="w-4 h-4" />
                      </span>
                  </button>
              </div>
          </div>
      );
  }

  // 2. SUCCESS MODAL
  if (isSuccess) {
      return (
          <div className="min-h-screen pt-20 px-4 flex items-center justify-center animate-scale-in">
              <div className={`w-full max-w-lg rounded-[32px] p-8 text-center relative overflow-hidden border ${mode === 'NEED' ? 'bg-slate-900 border-orange-500/30' : 'bg-slate-900 border-emerald-500/30'}`}>
                  
                  {/* Confetti / Glow BG */}
                  <div className={`absolute inset-0 opacity-20 ${mode === 'NEED' ? 'bg-orange-500/20' : 'bg-emerald-500/20'} animate-pulse`}></div>
                  
                  <div className="relative z-10">
                      <div className={`w-20 h-20 mx-auto rounded-full flex items-center justify-center mb-6 shadow-[0_0_40px_currentColor] ${mode === 'NEED' ? 'bg-orange-500 text-white' : 'bg-emerald-500 text-slate-900'}`}>
                          <CheckCircle className="w-10 h-10" />
                      </div>
                      
                      <h2 className="text-3xl font-bold text-white mb-2">
                          {mode === 'NEED' ? 'Your request is live!' : 'You are amazing!'}
                      </h2>
                      <p className="text-slate-400 mb-8">
                          {mode === 'NEED' ? "We're notifying neighbors nearby." : "Your kindness just made the world brighter."}
                      </p>

                      {/* INSTANT MATCHES SIMULATION */}
                      <div className="bg-slate-800/50 rounded-2xl p-6 border border-white/5 mb-8">
                          <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-4 flex items-center justify-center gap-2">
                              <Zap className="w-4 h-4 text-yellow-400" /> 
                              {mode === 'NEED' ? '3 Nearby Helpers Found' : '3 People Need This'}
                          </h3>
                          
                          <div className="space-y-3">
                              {[1, 2, 3].map((i) => (
                                  <div key={i} className="flex items-center gap-3 p-3 bg-slate-900 rounded-xl border border-white/5 hover:border-white/20 transition-colors">
                                      <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold ${mode === 'NEED' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-orange-500/20 text-orange-400'}`}>
                                          {mode === 'NEED' ? 'H' : 'N'}
                                      </div>
                                      <div className="text-left flex-1">
                                          <p className="text-sm font-bold text-white">{mode === 'NEED' ? 'Kind Neighbor' : 'Local Family'}</p>
                                          <p className="text-xs text-slate-500">0.{i * 2 + 1} km away • {i} min ago</p>
                                      </div>
                                      <button className="px-3 py-1.5 bg-white/10 hover:bg-white/20 rounded-lg text-xs font-bold text-white transition-colors">
                                          {mode === 'NEED' ? 'Contact' : 'Offer'}
                                      </button>
                                  </div>
                              ))}
                          </div>
                      </div>

                      <div className="flex gap-4 justify-center">
                          <button 
                             onClick={() => setView('MARKETPLACE')}
                             className="px-8 py-3 bg-white text-slate-900 font-bold rounded-xl hover:bg-slate-200 transition-colors"
                          >
                             Go to Marketplace
                          </button>
                          <button 
                             onClick={() => { setIsSuccess(false); setMode(null); setCategory(null); setDescription(''); }}
                             className="px-8 py-3 bg-slate-800 text-white font-bold rounded-xl hover:bg-slate-700 transition-colors"
                          >
                             Close
                          </button>
                      </div>
                  </div>
              </div>
          </div>
      );
  }

  // 3. MAIN FORM
  const ThemeIcon = mode === 'NEED' ? Heart : HandPlatter;

  return (
    <div className="min-h-screen pt-24 pb-20 px-4 flex justify-center animate-slide-up">
      <div className="w-full max-w-2xl relative">
        
        {/* Back Button */}
        <button 
            onClick={() => setMode(null)}
            className="absolute -top-12 left-0 text-slate-400 hover:text-white flex items-center gap-2 text-sm font-medium transition-colors"
        >
            <ArrowLeft className="w-4 h-4" /> Back
        </button>

        {/* Header */}
        <div className="text-center mb-8">
            <div className={`inline-flex p-4 rounded-full mb-4 animate-bounce-subtle shadow-glow ${mode === 'NEED' ? 'bg-orange-500/20 text-orange-400' : 'bg-emerald-500/20 text-emerald-400'}`}>
                <ThemeIcon className="w-8 h-8" />
            </div>
            <h1 className="text-4xl font-bold text-white mb-2">
                {mode === 'NEED' ? 'We got you. Tell us what you need.' : "You're a legend. Let's help someone."}
            </h1>
            <p className="text-slate-400">
                {mode === 'NEED' ? 'Fill out the details below.' : 'Your generosity makes a difference.'}
            </p>
        </div>

        <div className={`glass-card rounded-[32px] p-8 border ${mode === 'NEED' ? 'border-orange-500/20' : 'border-emerald-500/20'} relative overflow-hidden`}>
            
            {/* Background Glow */}
            <div className={`absolute top-0 left-1/2 -translate-x-1/2 w-full h-32 opacity-20 blur-[60px] ${mode === 'NEED' ? 'bg-orange-500' : 'bg-emerald-500'}`}></div>

            {/* A. Categories */}
            <div className="relative z-10 mb-8">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-4 block">1. Choose Category</label>
                <div className="grid grid-cols-3 sm:grid-cols-6 gap-3">
                    {QUICK_CATEGORIES.map(cat => (
                        <button
                           key={cat.id}
                           onClick={() => { setCategory(cat.id); playPopSound(); }}
                           className={`flex flex-col items-center justify-center p-3 rounded-2xl border transition-all hover:-translate-y-1 ${
                               category === cat.id 
                                 ? `${mode === 'NEED' ? 'bg-orange-500 border-orange-400 text-white shadow-lg scale-105' : 'bg-emerald-500 border-emerald-400 text-slate-900 shadow-lg scale-105'}` 
                                 : 'bg-slate-800/50 border-white/5 text-slate-400 hover:bg-slate-800 hover:border-white/20'
                           }`}
                        >
                           <span className="text-2xl mb-1">{cat.icon}</span>
                           <span className="text-[10px] font-bold">{cat.label}</span>
                        </button>
                    ))}
                </div>
            </div>

            {/* B. Description + AI */}
            <div className="relative z-10 mb-8">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-4 block">2. Details</label>
                <div className="relative">
                    <textarea 
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        placeholder={mode === 'NEED' ? "e.g., I'm a single mom and need winter jackets for my 2 kids..." : "e.g., I have 2 gently used winter coats and a bag of canned beans..."}
                        className="w-full h-32 bg-slate-900/50 border border-white/10 rounded-2xl p-4 text-white placeholder-slate-600 focus:outline-none focus:border-white/30 resize-none transition-all"
                    />
                    
                    {/* AI Button */}
                    <button 
                        onClick={handleOptimize}
                        disabled={isOptimizing || !description}
                        className={`absolute bottom-3 right-3 flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-bold transition-colors ${
                            mode === 'NEED' 
                            ? 'bg-orange-500/20 text-orange-400 hover:bg-orange-500/30' 
                            : 'bg-emerald-500/20 text-emerald-400 hover:bg-emerald-500/30'
                        }`}
                    >
                        {isOptimizing ? <Loader2 className="w-3 h-3 animate-spin" /> : <Wand2 className="w-3 h-3" />}
                        Let AI Write It
                    </button>
                </div>
                
                {/* Giver: AI Hint */}
                {mode === 'OFFER' && (
                    <div className="mt-3 flex items-center gap-2 animate-fade-in-up">
                        <div className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_10px_#10b981]"></div>
                        <p className="text-xs text-slate-400 italic">Gemini Tip: "3 people nearby requested clothes today."</p>
                    </div>
                )}
            </div>

            {/* C. Sliders / Options */}
            <div className="relative z-10 mb-10 grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Quantity */}
                <div>
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-3 flex justify-between">
                        3. Quantity
                        <span className="text-white">{quantity} {quantity > 3 ? '+' : ''}</span>
                    </label>
                    <input 
                       type="range" min="1" max="4" step="1"
                       value={quantity} onChange={(e) => setQuantity(parseInt(e.target.value))}
                       className={`w-full h-2 rounded-lg appearance-none cursor-pointer bg-slate-800 ${mode === 'NEED' ? 'accent-orange-500' : 'accent-emerald-500'}`}
                    />
                    <div className="flex justify-between text-[10px] text-slate-500 mt-2 font-bold uppercase">
                        <span>1 Item</span>
                        <span>Bulk</span>
                    </div>
                </div>

                {/* Urgency (Needer) or Time (Giver) */}
                {mode === 'NEED' ? (
                     <div>
                        <label className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-3 flex justify-between">
                            4. Urgency
                            <span className={`${urgency > 3 ? 'text-red-400' : 'text-white'}`}>
                                {urgency === 1 ? 'Low' : urgency === 2 ? 'Medium' : urgency === 3 ? 'High' : 'Critical'}
                            </span>
                        </label>
                        <input 
                           type="range" min="1" max="4" step="1"
                           value={urgency} onChange={(e) => setUrgency(parseInt(e.target.value))}
                           className="w-full h-2 rounded-lg appearance-none cursor-pointer bg-slate-800 accent-orange-500"
                        />
                         <div className="flex justify-between text-[10px] text-slate-500 mt-2 font-bold uppercase">
                             <span>Low</span>
                             <span>Critical</span>
                         </div>
                     </div>
                ) : (
                    <div>
                        <label className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-3 block">4. Pickup Window</label>
                        <div className="flex bg-slate-900 rounded-xl p-1 border border-white/5">
                            {['Morning', 'Afternoon', 'Evening'].map(time => (
                                <button
                                   key={time}
                                   onClick={() => setPickupTime(time)}
                                   className={`flex-1 py-2 rounded-lg text-xs font-bold transition-all ${
                                       pickupTime === time 
                                       ? 'bg-emerald-500 text-slate-900 shadow-md' 
                                       : 'text-slate-400 hover:text-white'
                                   }`}
                                >
                                    {time}
                                </button>
                            ))}
                        </div>
                    </div>
                )}
            </div>

            {/* Giver: Photo Placeholder */}
            {mode === 'OFFER' && (
                <div className="relative z-10 mb-8 border-2 border-dashed border-white/10 rounded-2xl p-6 flex flex-col items-center justify-center text-slate-500 hover:border-emerald-500/50 hover:bg-emerald-500/5 transition-all cursor-pointer group">
                    <Camera className="w-8 h-8 mb-2 group-hover:scale-110 transition-transform text-slate-400 group-hover:text-emerald-400" />
                    <span className="text-sm font-medium">Add a photo (Optional)</span>
                </div>
            )}

            {/* D. Submit Button */}
            <button 
                onClick={handleSubmit}
                disabled={isSubmitting || !description || !category}
                className={`relative z-10 w-full py-4 rounded-xl font-bold text-lg shadow-xl hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2 ${
                    mode === 'NEED' 
                    ? 'bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-400 hover:to-red-400 text-white shadow-orange-500/20' 
                    : 'bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-900 shadow-emerald-500/20'
                }`}
            >
                {isSubmitting ? <Loader2 className="w-6 h-6 animate-spin" /> : mode === 'NEED' ? 'Confirm Request' : 'Post Offer'}
            </button>

        </div>
      </div>
    </div>
  );
};

export default IntakeForm;
