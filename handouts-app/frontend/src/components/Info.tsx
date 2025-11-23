
import React from 'react';
import { ViewState } from '../types';
import { 
  ShieldCheck, HeartHandshake, Cpu, Lock, 
  ArrowLeft, Users, Globe, Zap, Lightbulb 
} from 'lucide-react';

interface InfoProps {
  setView: (view: ViewState) => void;
}

const Info: React.FC<InfoProps> = ({ setView }) => {
  return (
    <div className="min-h-screen pt-24 pb-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      
      {/* Header */}
      <div className="mb-12">
        <button 
          onClick={() => setView('HERO')}
          className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors mb-6 group"
        >
          <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
          Back to Home
        </button>
        <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">About Handouts</h1>
        <p className="text-xl text-slate-400 max-w-2xl">
          Bridging the gap between surplus and scarcity through intelligent, hyper-local community connection.
        </p>
      </div>

      {/* Grid Content */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
        
        {/* Mission */}
        <div className="glass-panel p-8 rounded-3xl border-l-4 border-l-emerald-500">
          <div className="w-12 h-12 bg-emerald-500/20 rounded-xl flex items-center justify-center mb-6">
            <HeartHandshake className="w-6 h-6 text-emerald-400" />
          </div>
          <h2 className="text-2xl font-bold text-white mb-4">Our Mission</h2>
          <p className="text-slate-300 leading-relaxed">
            We believe that help shouldn't be hard to find, and giving shouldn't be complicated. 
            Handouts uses technology to remove the friction from social aid, connecting neighbors 
            who have extra with neighbors who are in need—instantly, dignifyingly, and locally.
          </p>
        </div>

        {/* Tech */}
        <div className="glass-panel p-8 rounded-3xl border-l-4 border-l-cyan-500">
          <div className="w-12 h-12 bg-cyan-500/20 rounded-xl flex items-center justify-center mb-6">
            <Cpu className="w-6 h-6 text-cyan-400" />
          </div>
          <h2 className="text-2xl font-bold text-white mb-4">Powered by AI</h2>
          <p className="text-slate-300 leading-relaxed">
            We utilize <strong>Google Gemini 2.5</strong> to analyze requests for urgency and category, 
            ensuring critical needs get prioritized. <strong>BigQuery</strong> analytics help us identify 
            supply gaps in neighborhoods, allowing us to alert givers where they are needed most.
          </p>
        </div>

        {/* Safety */}
        <div className="glass-panel p-8 rounded-3xl border-l-4 border-l-orange-500">
          <div className="w-12 h-12 bg-orange-500/20 rounded-xl flex items-center justify-center mb-6">
            <ShieldCheck className="w-6 h-6 text-orange-400" />
          </div>
          <h2 className="text-2xl font-bold text-white mb-4">Trust & Safety</h2>
          <p className="text-slate-300 leading-relaxed">
            Community safety is paramount. We verify locations without revealing exact addresses until a match is confirmed. 
            Our platform encourages public meetup spots and provides community guidelines to ensure every interaction 
            is respectful and safe.
          </p>
        </div>

        {/* Privacy */}
        <div className="glass-panel p-8 rounded-3xl border-l-4 border-l-purple-500">
          <div className="w-12 h-12 bg-purple-500/20 rounded-xl flex items-center justify-center mb-6">
            <Lock className="w-6 h-6 text-purple-400" />
          </div>
          <h2 className="text-2xl font-bold text-white mb-4">Privacy First</h2>
          <p className="text-slate-300 leading-relaxed">
            Your data is yours. We do not sell user data. Location data is fuzzed for privacy, showing only 
            approximate neighborhoods on public maps. You have full control to delete your data at any time.
          </p>
        </div>
      </div>

      {/* FAQ Section */}
      <div className="max-w-3xl mx-auto">
        <h2 className="text-3xl font-bold text-white mb-8 text-center">Frequently Asked Questions</h2>
        
        <div className="space-y-4">
          {[
            { q: "Is this service free?", a: "Yes, Handouts is 100% free for both givers and needers." },
            { q: "How does the matching work?", a: "Our algorithm considers distance, category, and urgency. When a Giver posts an item that matches a local Need, we notify both parties." },
            { q: "Can I remain anonymous?", a: "Yes, you can choose a display name and your exact address is never shown publicly." },
            { q: "What if I need urgent help?", a: "Mark your request as 'Critical'. Our system highlights these to nearby givers immediately." }
          ].map((item, i) => (
            <div key={i} className="glass-card p-6 rounded-2xl border border-white/5">
              <h3 className="text-lg font-bold text-white mb-2 flex items-center gap-2">
                <Lightbulb className="w-4 h-4 text-emerald-400" /> {item.q}
              </h3>
              <p className="text-slate-400">{item.a}</p>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};

export default Info;
