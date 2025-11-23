import React from 'react';
import { HeartHandshake, Github, Twitter, Linkedin } from 'lucide-react';

const Footer: React.FC = () => {
  return (
    <footer className="glass-panel border-t border-white/5 pt-12 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center gap-2 mb-4">
               <HeartHandshake className="h-6 w-6 text-emerald-400" />
               <span className="font-bold text-xl text-white">Hand<span className="text-emerald-400">outs</span></span>
            </div>
            <p className="text-slate-400 text-sm max-w-sm leading-relaxed">
              Empowering communities to bridge the gap between surplus and scarcity using advanced AI matching.
            </p>
          </div>
          
          <div>
            <h4 className="text-white font-semibold mb-4">Platform</h4>
            <ul className="space-y-2 text-sm text-slate-400">
              <li className="hover:text-emerald-400 cursor-pointer transition-colors">Marketplace</li>
              <li className="hover:text-emerald-400 cursor-pointer transition-colors">Giver Analytics</li>
              <li className="hover:text-emerald-400 cursor-pointer transition-colors">Success Stories</li>
            </ul>
          </div>

          <div>
             <h4 className="text-white font-semibold mb-4">Connect</h4>
             <div className="flex gap-4">
                <Github className="w-5 h-5 text-slate-400 hover:text-white cursor-pointer transition-colors" />
                <Twitter className="w-5 h-5 text-slate-400 hover:text-white cursor-pointer transition-colors" />
                <Linkedin className="w-5 h-5 text-slate-400 hover:text-white cursor-pointer transition-colors" />
             </div>
          </div>
        </div>

        <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row justify-between items-center text-xs text-slate-500">
          <p>© 2024 Handouts Inc. All rights reserved.</p>
          <p>Built with React, Tailwind, and Gemini AI.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;