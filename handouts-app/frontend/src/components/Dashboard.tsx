
import React, { useEffect, useState, useRef } from 'react';
import { Stats, ItemRequest, Category, User } from '../types';
import { getCommunityPulse, getDashboardTips } from '../services/geminiService';
import { 
  LineChart, Line, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer, BarChart, Bar, Cell 
} from 'recharts';
import { 
  Bot, TrendingUp, Users, Heart, Zap, MapPin, Sparkles, 
  Activity, CloudRain, Sun, Gift, AlertCircle, Calendar,
  CloudSun, Snowflake, Cloud
} from 'lucide-react';

interface DashboardProps {
  items: ItemRequest[];
}

// --- SUB-COMPONENTS ---

const StatCard = ({ label, value, icon: Icon, color, delay, type = 'number' }: any) => {
  const [displayValue, setDisplayValue] = useState(0);

  useEffect(() => {
    let start = 0;
    const end = parseInt(value.toString().replace(/\D/g, '')) || 0;
    if (start === end) return;
    
    const duration = 2000;
    const incrementTime = (duration / end) * 10;
    
    const timer = setInterval(() => {
      start += Math.ceil(end / 50);
      if (start >= end) {
        start = end;
        clearInterval(timer);
      }
      setDisplayValue(start);
    }, 20);
    return () => clearInterval(timer);
  }, [value]);

  return (
    <div 
       className="glass-panel p-6 rounded-2xl border-t border-white/10 relative overflow-hidden group hover:-translate-y-1 transition-transform duration-300"
       style={{ animation: `fadeInUp 0.6s ease-out ${delay}s backwards` }}
    >
       <div className={`absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity ${color}`}>
          <Icon className="w-24 h-24 -mr-8 -mt-8 rotate-12" />
       </div>
       
       <div className="relative z-10">
          <div className="flex justify-between items-start mb-2">
             <p className="text-sm font-bold text-slate-400 uppercase tracking-wider">{label}</p>
             <div className={`p-2 rounded-lg bg-white/5 ${color}`}>
                <Icon className="w-5 h-5" />
             </div>
          </div>
          
          <div className="flex items-baseline gap-2">
             <h4 className={`text-4xl font-black text-white ${type === 'score' ? 'text-neon' : ''}`}>
               {type === 'percent' ? `${displayValue}%` : displayValue}
             </h4>
             {type === 'score' && <span className="text-sm text-emerald-400 font-bold">/ 100</span>}
          </div>
          
          {/* Progress Bar for Score/Growth */}
          {type === 'score' && (
             <div className="w-full h-1.5 bg-slate-800 rounded-full mt-4 overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-emerald-500 to-cyan-500 transition-all duration-1000 ease-out" 
                  style={{ width: `${displayValue}%` }}
                ></div>
             </div>
          )}
          {type === 'percent' && (
             <p className="text-xs text-emerald-400 mt-2 flex items-center gap-1">
                <TrendingUp className="w-3 h-3" /> +4.2% vs last week
             </p>
          )}
       </div>
    </div>
  );
};

const TypewriterText = ({ text }: { text: string }) => {
  const [displayed, setDisplayed] = useState('');
  
  useEffect(() => {
    setDisplayed('');
    let i = 0;
    const timer = setInterval(() => {
       if (i < text.length) {
         setDisplayed(prev => prev + text.charAt(i));
         i++;
       } else {
         clearInterval(timer);
       }
    }, 20); // Typing speed
    return () => clearInterval(timer);
  }, [text]);

  return <span>{displayed}</span>;
};

// --- MAIN COMPONENT ---

const Dashboard: React.FC<DashboardProps> = ({ items }) => {
  const [pulseData, setPulseData] = useState<any>(null);
  const [tips, setTips] = useState<string[]>([]);
  const [activeTab, setActiveTab] = useState('overview');

  // Map Refs
  const mapRef = useRef<HTMLDivElement>(null);
  const leafletMapRef = useRef<any>(null);

  useEffect(() => {
    // Fetch Data
    const fetchData = async () => {
       const pulse = await getCommunityPulse();
       setPulseData(pulse);
       const t = await getDashboardTips('GIVER'); // Default role for demo dashboard
       setTips(t);
    };
    fetchData();
  }, []);

  // Initialize Leaflet Map
  useEffect(() => {
    if (!mapRef.current || leafletMapRef.current) return;
    if (!(window as any).L) return;

    const L = (window as any).L;

    try {
        const map = L.map(mapRef.current, {
            center: [43.6532, -79.3832],
            zoom: 11,
            zoomControl: false,
            dragging: false,
            scrollWheelZoom: false,
            attributionControl: false
        });

        // Dark Matter Tiles
        L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
            subdomains: 'abcd',
            maxZoom: 20
        }).addTo(map);

        leafletMapRef.current = map;

        // Mock Heatmap Circles using Leaflet Circles
        const heatPoints = [
            { lat: 43.6532, lng: -79.3832, color: '#ef4444', radius: 2000 }, // Needs (Red)
            { lat: 43.7000, lng: -79.4000, color: '#10b981', radius: 1500 }, // Offers (Green)
            { lat: 43.7500, lng: -79.2000, color: '#eab308', radius: 1800 }, // Mixed (Yellow)
        ];

        heatPoints.forEach(p => {
            L.circle([p.lat, p.lng], {
                color: p.color,
                fillColor: p.color,
                fillOpacity: 0.4,
                radius: p.radius,
                stroke: false
            }).addTo(map);
        });

    } catch(e) { console.error("Leaflet Map Error", e); }
  }, [pulseData]);

  // Chart Data
  const trendData = [
    { day: 'Mon', needs: 12, offers: 8, icon: <CloudSun className="w-4 h-4" /> },
    { day: 'Tue', needs: 19, offers: 15, icon: <Cloud className="w-4 h-4" /> },
    { day: 'Wed', needs: 15, offers: 22, icon: <CloudRain className="w-4 h-4" /> },
    { day: 'Thu', needs: 25, offers: 18, icon: <Heart className="w-4 h-4" /> },
    { day: 'Fri', needs: 32, offers: 28, icon: <Snowflake className="w-4 h-4" /> },
    { day: 'Sat', needs: 20, offers: 35, icon: <Gift className="w-4 h-4" /> },
    { day: 'Sun', needs: 18, offers: 30, icon: <Sun className="w-4 h-4" /> },
  ];

  const categoryData = Object.values(Category).slice(0, 7).map(cat => ({
    name: cat.split(' ')[0], // Shorten name
    value: Math.floor(Math.random() * 50) + 10,
  }));

  return (
    <div className="min-h-screen pt-24 pb-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto relative">
      
      {/* 1. AURA GLOW HEADER */}
      <div className="relative mb-12 text-center animate-fade-in-up">
         <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-3/4 h-32 bg-emerald-500/20 blur-[80px] rounded-full animate-pulse-slow -z-10"></div>
         
         <div className="inline-flex items-center gap-3 bg-white/5 border border-white/10 px-4 py-1.5 rounded-full backdrop-blur-md mb-4 shadow-glow">
             <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
             <span className="text-xs font-bold uppercase tracking-widest text-emerald-400">Live System Status</span>
         </div>
         
         <h1 className="text-5xl md:text-6xl font-black text-white mb-2 tracking-tight">
            Community <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-400">Pulse</span>
         </h1>
         <p className="text-slate-400 text-lg">Live snapshot of kindness happening around you.</p>
         
         {/* Badges */}
         <div className="flex justify-center gap-4 mt-6">
            <div className="flex items-center gap-2 px-3 py-1 rounded-lg bg-blue-500/10 border border-blue-500/30 text-blue-400 text-xs font-bold">
               <Activity className="w-3 h-3" />
               BigQuery Connected
            </div>
            <div className="flex items-center gap-2 px-3 py-1 rounded-lg bg-purple-500/10 border border-purple-500/30 text-purple-400 text-xs font-bold">
               <Sparkles className="w-3 h-3" /> Gemini 2.5 Active
            </div>
         </div>
      </div>

      {/* 2. STAT CARDS GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-10">
         <StatCard label="Active Needs" value={42} icon={AlertCircle} color="text-rose-400" delay={0.1} />
         <StatCard label="Total Offers" value={189} icon={Gift} color="text-emerald-400" delay={0.2} />
         <StatCard label="Matches" value={142} icon={Zap} color="text-cyan-400" delay={0.3} />
         <StatCard label="Impact Score" value={88} icon={StarIcon} color="text-yellow-400" delay={0.4} type="score" />
         <StatCard label="Growth" value={12} icon={TrendingUp} color="text-indigo-400" delay={0.5} type="percent" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
         
         {/* LEFT COL: Main Charts & Map */}
         <div className="lg:col-span-2 space-y-8">
            
            {/* 3. GEMINI AI STORY CARD */}
            <div className="glass-card p-1 rounded-3xl bg-gradient-to-br from-emerald-500/20 via-slate-800 to-slate-900 animate-scale-in">
               <div className="bg-slate-900/90 backdrop-blur-xl rounded-[22px] p-6 md:p-8 h-full relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/4"></div>
                  
                  <div className="flex items-start gap-4 relative z-10">
                      <div className="w-14 h-14 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-2xl flex items-center justify-center shadow-lg shadow-emerald-500/20 flex-shrink-0 animate-float">
                          <Bot className="w-8 h-8 text-white" />
                      </div>
                      <div className="flex-1">
                          <h3 className="text-xl font-bold text-white mb-2 flex items-center gap-2">
                              Gemini Intelligence
                              <span className="px-2 py-0.5 rounded text-[10px] bg-white/10 border border-white/5 uppercase tracking-wide">Live Analysis</span>
                          </h3>
                          <div className="prose prose-invert prose-sm">
                             <p className="text-slate-200 text-lg leading-relaxed font-light">
                                {pulseData ? <TypewriterText text={pulseData.story} /> : "Analyzing community patterns..."}
                             </p>
                          </div>

                          {/* Prediction Pill */}
                          {pulseData && (
                             <div className="mt-6 flex items-center gap-3 bg-indigo-500/10 border border-indigo-500/20 p-4 rounded-xl">
                                <div className="p-2 bg-indigo-500/20 rounded-lg">
                                   <CloudRain className="w-5 h-5 text-indigo-400" />
                                </div>
                                <div>
                                   <p className="text-xs font-bold text-indigo-400 uppercase mb-0.5">Forecast</p>
                                   <p className="text-sm text-slate-300 italic">"{pulseData.prediction}"</p>
                                </div>
                             </div>
                          )}
                      </div>
                  </div>
               </div>
            </div>

            {/* 4. WEEKLY ACTIVITY CHART */}
            <div className="glass-panel p-6 rounded-2xl">
               <div className="flex justify-between items-center mb-6">
                  <h3 className="text-lg font-bold text-white flex items-center gap-2">
                     <Activity className="w-5 h-5 text-emerald-400" /> Activity Trends
                  </h3>
                  <div className="flex gap-2">
                     {['Weekly', 'Monthly'].map(t => (
                        <button key={t} className="px-3 py-1 rounded-lg text-xs font-medium bg-slate-800 hover:bg-slate-700 text-slate-400 transition-colors">{t}</button>
                     ))}
                  </div>
               </div>
               <div className="h-72 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                     <AreaChart data={trendData}>
                        <defs>
                           <linearGradient id="colorNeeds" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="5%" stopColor="#fb923c" stopOpacity={0.3}/>
                              <stop offset="95%" stopColor="#fb923c" stopOpacity={0}/>
                           </linearGradient>
                           <linearGradient id="colorOffers" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="5%" stopColor="#34d399" stopOpacity={0.3}/>
                              <stop offset="95%" stopColor="#34d399" stopOpacity={0}/>
                           </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.2} vertical={false} />
                        <XAxis dataKey="day" stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} />
                        <YAxis stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} />
                        <RechartsTooltip 
                           contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '12px', color: '#f8fafc' }}
                           itemStyle={{ color: '#cbd5e1' }}
                        />
                        <Area type="monotone" dataKey="needs" stroke="#fb923c" strokeWidth={3} fillOpacity={1} fill="url(#colorNeeds)" />
                        <Area type="monotone" dataKey="offers" stroke="#34d399" strokeWidth={3} fillOpacity={1} fill="url(#colorOffers)" />
                     </AreaChart>
                  </ResponsiveContainer>
               </div>
            </div>

            {/* 5. COMMUNITY HEATMAP & CATEGORIES */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
               
               {/* Map */}
               <div className="glass-panel p-1 rounded-2xl relative group h-80">
                  <div className="absolute top-4 left-4 z-10 bg-slate-900/80 backdrop-blur px-3 py-1.5 rounded-lg border border-white/10 text-xs font-bold text-white flex items-center gap-2">
                     <MapPin className="w-3 h-3 text-red-400" /> Needs Heatmap
                  </div>
                  <div className="w-full h-full rounded-xl overflow-hidden grayscale-[50%] group-hover:grayscale-0 transition-all duration-500">
                     <div ref={mapRef} className="w-full h-full z-0" />
                  </div>
               </div>

               {/* Categories Bar Chart */}
               <div className="glass-panel p-6 rounded-2xl flex flex-col">
                   <h3 className="text-lg font-bold text-white mb-6">Top Categories</h3>
                   <div className="flex-1 min-h-[200px]">
                      <ResponsiveContainer width="100%" height="100%">
                         <BarChart data={categoryData} layout="vertical">
                            <XAxis type="number" hide />
                            <YAxis dataKey="name" type="category" stroke="#94a3b8" fontSize={11} width={70} tickLine={false} axisLine={false} />
                            <RechartsTooltip cursor={{fill: 'transparent'}} contentStyle={{ backgroundColor: '#0f172a', borderRadius: '8px', border: 'none' }} />
                            <Bar dataKey="value" radius={[0, 10, 10, 0]} barSize={24}>
                               {categoryData.map((entry, index) => (
                                  <Cell key={`cell-${index}`} fill={['#34d399', '#2dd4bf', '#22d3ee', '#38bdf8'][index % 4]} />
                               ))}
                            </Bar>
                         </BarChart>
                      </ResponsiveContainer>
                   </div>
               </div>

            </div>
         </div>

         {/* RIGHT COL: Sidebar (Timeline, Tips, Stories) */}
         <div className="space-y-8">
            
            {/* 10. PERSONALIZED AI TIPS */}
            <div className="glass-card p-6 rounded-2xl border-l-4 border-l-yellow-400">
               <h3 className="text-sm font-bold text-yellow-400 uppercase tracking-widest mb-4 flex items-center gap-2">
                  <Zap className="w-4 h-4" /> AI Daily Tips
               </h3>
               <div className="space-y-4">
                  {tips.length > 0 ? tips.map((tip, i) => (
                      <div key={i} className="flex gap-3 items-start animate-fade-in-up" style={{ animationDelay: `${i * 0.1}s` }}>
                         <div className="w-1.5 h-1.5 rounded-full bg-yellow-400 mt-2 flex-shrink-0 shadow-glow"></div>
                         <p className="text-sm text-slate-300 leading-relaxed">{tip}</p>
                      </div>
                  )) : (
                      <p className="text-slate-500 text-sm">Generating tips...</p>
                  )}
               </div>
            </div>

            {/* 9. IMPACT TIMELINE */}
            <div className="glass-panel p-6 rounded-2xl">
               <div className="flex justify-between items-center mb-6">
                  <h3 className="text-lg font-bold text-white">Live Impact</h3>
                  <span className="w-2 h-2 bg-red-500 rounded-full animate-ping"></span>
               </div>
               
               <div className="relative pl-4 border-l-2 border-white/5 space-y-8">
                  {[
                     { time: '2m ago', text: 'Sarah donated a stroller', icon: <Users className="w-3 h-3" />, color: 'text-pink-400' },
                     { time: '14m ago', text: 'New request in Scarborough', icon: <Snowflake className="w-3 h-3" />, color: 'text-blue-400' },
                     { time: '1h ago', text: 'Match confirmed! (Food)', icon: <Heart className="w-3 h-3" />, color: 'text-emerald-400' },
                     { time: '2h ago', text: 'Community goal reached', icon: <StarIcon className="w-3 h-3" />, color: 'text-yellow-400' },
                  ].map((item, idx) => (
                     <div key={idx} className="relative pl-6 animate-fade-in-up" style={{ animationDelay: `${idx * 0.2}s` }}>
                        {/* Dot */}
                        <div className="absolute -left-[21px] top-0 w-3 h-3 bg-slate-900 border-2 border-slate-600 rounded-full group-hover:border-emerald-500 transition-colors"></div>
                        
                        <p className="text-sm text-white font-medium mb-0.5 flex items-center gap-2">{item.text}</p>
                        <p className={`text-xs ${item.color} font-bold`}>{item.time}</p>
                     </div>
                  ))}
               </div>
               
               <button className="w-full mt-6 py-3 bg-slate-800 hover:bg-slate-700 rounded-xl text-xs font-bold text-slate-400 uppercase tracking-wider transition-colors">
                  View Full History
               </button>
            </div>

            {/* 8. COMMUNITY STORIES */}
            <div className="glass-panel p-6 rounded-2xl relative overflow-hidden">
               <div className="absolute -top-10 -right-10 w-32 h-32 bg-blue-500/10 rounded-full blur-2xl"></div>
               <h3 className="text-lg font-bold text-white mb-4">Success Stories</h3>
               
               <div className="bg-gradient-to-br from-slate-800 to-slate-900 p-4 rounded-xl border border-white/5 mb-4 shadow-lg">
                  <div className="flex gap-1 mb-2">
                     <Heart className="w-3 h-3 text-red-500 fill-red-500" />
                     <Heart className="w-3 h-3 text-red-500 fill-red-500" />
                     <Heart className="w-3 h-3 text-red-500 fill-red-500" />
                  </div>
                  <p className="text-sm text-slate-300 italic mb-3">
                     "I was worried about winter coats for my kids. Thanks to a neighbor just 2km away, we are all set. Handouts is a lifesaver."
                  </p>
                  <div className="flex items-center gap-2">
                     <div className="w-6 h-6 rounded-full bg-slate-700 flex items-center justify-center text-[10px] font-bold">MJ</div>
                     <span className="text-xs text-slate-500 font-bold">Mary J. • Needer</span>
                  </div>
               </div>
            </div>

         </div>
      </div>
    </div>
  );
};

// Helper Icon for Stat Card
const StarIcon = (props: any) => (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" stroke="none">
        <path fillRule="evenodd" d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.007 5.404.433c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.433 2.082-5.006z" clipRule="evenodd" />
    </svg>
);

export default Dashboard;
