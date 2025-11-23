
import React, { useState, useEffect } from 'react';
import { ItemRequest, Category, UrgencyLevel, ViewState } from '../types';
import { 
    MapPin, Package, Filter, Share2, CheckCircle, 
    ArrowLeft, Heart, HandHeart, Info
} from 'lucide-react';

interface MarketplaceProps {
  items: ItemRequest[];
  setView?: (view: ViewState) => void;
}

const Marketplace: React.FC<MarketplaceProps> = ({ items, setView }) => {
  const [loading, setLoading] = useState(true);
  const [filterCategory, setFilterCategory] = useState<string>('All');
  const [filterType, setFilterType] = useState<'ALL' | 'NEED' | 'OFFER'>('ALL');
  const [filteredItems, setFilteredItems] = useState<ItemRequest[]>([]);
  
  // Interaction State
  const [interactionItem, setInteractionItem] = useState<ItemRequest | null>(null);
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  // Simulate loading delay for skeleton effect
  useEffect(() => {
    setLoading(true);
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1500);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    let result = items;
    if (filterCategory !== 'All') {
      result = result.filter(i => i.category === filterCategory);
    }
    if (filterType !== 'ALL') {
      result = result.filter(i => i.type === filterType);
    }
    setFilteredItems(result);
  }, [items, filterCategory, filterType]);

  const getUrgencyColor = (level: UrgencyLevel) => {
    switch(level) {
      case 5: return 'bg-red-500/20 text-red-400 border-red-500/50';
      case 4: return 'bg-orange-500/20 text-orange-400 border-orange-500/50';
      case 3: return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/50';
      default: return 'bg-emerald-500/20 text-emerald-400 border-emerald-500/50';
    }
  };

  const getCategoryIcon = (cat: Category) => {
    return <Package className="w-4 h-4" />;
  };

  // --- ACTIONS ---

  const handleShare = (e: React.MouseEvent, item: ItemRequest) => {
    e.stopPropagation();
    const shareData = {
        title: `Handouts: ${item.title}`,
        text: item.description,
        url: window.location.href
    };
    if (navigator.share) {
        navigator.share(shareData).catch(console.error);
    } else {
        navigator.clipboard.writeText(`${shareData.title}\n${shareData.text}`);
        alert("Link copied to clipboard!");
    }
  };

  const handleInteract = (item: ItemRequest) => {
      setInteractionItem(item);
      // Simulate API call
      setTimeout(() => {
          setInteractionItem(null);
          setShowSuccessModal(true);
      }, 1500);
  };

  return (
    <div className="min-h-screen pt-28 pb-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto relative">
      
      {/* SUCCESS MODAL */}
      {showSuccessModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/80 backdrop-blur-sm animate-fade-in-up">
              <div className="bg-slate-800 rounded-3xl p-8 max-w-sm w-full border border-emerald-500/30 shadow-2xl relative overflow-hidden text-center">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/10 rounded-full blur-2xl"></div>
                  
                  <div className="w-16 h-16 bg-emerald-500/20 rounded-full flex items-center justify-center mx-auto mb-4 text-emerald-400">
                      <CheckCircle className="w-8 h-8" />
                  </div>
                  
                  <h3 className="text-2xl font-bold text-white mb-2">Connection Sent!</h3>
                  <p className="text-slate-400 mb-6">We've notified the other person. Check your inbox for their response.</p>
                  
                  <button 
                      onClick={() => setShowSuccessModal(false)}
                      className="w-full py-3 bg-emerald-500 hover:bg-emerald-400 text-slate-900 font-bold rounded-xl transition-colors"
                  >
                      Awesome
                  </button>
              </div>
          </div>
      )}

      {/* Header & Filters */}
      <div className="flex flex-col md:flex-row justify-between items-end mb-10 gap-6">
        <div className="w-full md:w-auto">
          {/* Back Button */}
          {setView && (
            <button 
                onClick={() => setView('DASHBOARD')}
                className="mb-4 flex items-center gap-2 text-sm text-slate-400 hover:text-white transition-colors"
            >
                <ArrowLeft className="w-4 h-4" /> Back to Dashboard
            </button>
          )}
          <h2 className="text-3xl font-bold text-white mb-2">Community Marketplace</h2>
          <p className="text-slate-400">Real-time needs and offers in your vicinity.</p>
        </div>

        <div className="flex flex-wrap gap-3 w-full md:w-auto">
            {/* Type Toggle */}
            <div className="flex bg-slate-800/50 p-1 rounded-xl border border-white/5">
                <button 
                  onClick={() => setFilterType('ALL')}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${filterType === 'ALL' ? 'bg-slate-700 text-white shadow-sm' : 'text-slate-400 hover:text-white'}`}
                >All</button>
                <button 
                  onClick={() => setFilterType('NEED')}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${filterType === 'NEED' ? 'bg-slate-700 text-white shadow-sm' : 'text-slate-400 hover:text-white'}`}
                >Needs</button>
                <button 
                   onClick={() => setFilterType('OFFER')}
                   className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${filterType === 'OFFER' ? 'bg-slate-700 text-white shadow-sm' : 'text-slate-400 hover:text-white'}`}
                >Offers</button>
            </div>

            {/* Category Dropdown */}
            <div className="relative group">
                <div className="flex items-center gap-2 bg-slate-800/50 border border-white/10 px-4 py-2.5 rounded-xl text-slate-300 cursor-pointer hover:border-emerald-500/50 transition-colors">
                    <Filter className="w-4 h-4" />
                    <span className="text-sm">{filterCategory}</span>
                </div>
                {/* Dropdown Content */}
                <div className="absolute top-full right-0 mt-2 w-48 bg-slate-800 border border-white/10 rounded-xl shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-20 overflow-hidden">
                    <div className="py-1">
                        {['All', ...Object.values(Category)].map(cat => (
                            <button 
                              key={cat} 
                              onClick={() => setFilterCategory(cat)}
                              className="block w-full text-left px-4 py-2 text-sm text-slate-300 hover:bg-slate-700 hover:text-white"
                            >
                                {cat}
                            </button>
                        ))}
                    </div>
                </div>
            </div>
        </div>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {loading ? (
          // Skeleton Loaders
          Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="glass-card rounded-2xl p-6 h-64 animate-pulse">
               <div className="flex justify-between items-start mb-4">
                  <div className="w-20 h-6 bg-slate-700 rounded-full"></div>
                  <div className="w-8 h-8 bg-slate-700 rounded-full"></div>
               </div>
               <div className="w-3/4 h-6 bg-slate-700 rounded mb-3"></div>
               <div className="w-full h-4 bg-slate-700 rounded mb-2"></div>
               <div className="w-2/3 h-4 bg-slate-700 rounded mb-6"></div>
               <div className="flex gap-3 mt-auto">
                  <div className="w-16 h-4 bg-slate-700 rounded"></div>
                  <div className="w-16 h-4 bg-slate-700 rounded"></div>
               </div>
            </div>
          ))
        ) : filteredItems.length === 0 ? (
            <div className="col-span-full flex flex-col items-center justify-center py-20 text-center">
                <div className="w-20 h-20 bg-slate-800/50 rounded-full flex items-center justify-center mb-6 border border-white/5">
                    <Info className="w-10 h-10 text-slate-600" />
                </div>
                <h3 className="text-xl font-bold text-white mb-2">No items found</h3>
                <p className="text-slate-400 max-w-md">We couldn't find any matches for your current filters. Try adjusting them or creating a new request.</p>
            </div>
        ) : (
          filteredItems.map((item) => (
            <div 
              key={item.id}
              className="group glass-card rounded-2xl p-6 relative hover:scale-[1.02] transition-all duration-300 border-t border-white/10 hover:border-emerald-500/30 overflow-hidden flex flex-col"
            >
              {/* Top Badge Row */}
              <div className="flex justify-between items-start mb-4 relative z-10">
                 <div className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider border ${item.type === 'NEED' ? getUrgencyColor(item.urgency) : 'bg-cyan-500/20 text-cyan-400 border-cyan-500/50'}`}>
                    {item.type === 'NEED' ? `Urgency ${item.urgency}` : 'OFFER'}
                 </div>
                 <button 
                    onClick={(e) => handleShare(e, item)}
                    className="p-2 -mr-2 -mt-2 text-slate-400 hover:text-white hover:bg-white/10 rounded-full transition-colors"
                 >
                    <Share2 className="w-4 h-4" />
                 </button>
              </div>

              {/* Content */}
              <h3 className="text-xl font-bold text-white mb-2 line-clamp-1 group-hover:text-emerald-400 transition-colors relative z-10">{item.title}</h3>
              <p className="text-slate-400 text-sm mb-6 line-clamp-2 h-10 relative z-10">{item.description}</p>

              {/* Meta Data */}
              <div className="mt-auto flex items-center gap-4 text-xs text-slate-500 border-t border-white/5 pt-4 relative z-10">
                  <div className="flex items-center gap-1.5">
                      <MapPin className="w-3.5 h-3.5 text-emerald-500" />
                      {item.location} ({item.distanceKm}km)
                  </div>
                  <div className="flex items-center gap-1.5 ml-auto">
                      {getCategoryIcon(item.category)}
                      {item.category}
                  </div>
              </div>
              
              {/* Fun Action Overlay (Hover) */}
              <div className={`absolute inset-0 bg-slate-900/95 backdrop-blur-md opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center rounded-2xl z-20 ${interactionItem?.id === item.id ? 'opacity-100' : ''}`}>
                 {interactionItem?.id === item.id ? (
                     <div className="flex flex-col items-center animate-pulse">
                         <div className="w-12 h-12 rounded-full border-2 border-emerald-500 border-t-transparent animate-spin mb-3"></div>
                         <span className="text-emerald-400 font-bold">Connecting...</span>
                     </div>
                 ) : item.type === 'NEED' ? (
                     <button 
                        onClick={() => handleInteract(item)}
                        className="group/btn relative px-8 py-3 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-900 font-bold rounded-xl transform translate-y-4 group-hover:translate-y-0 transition-all duration-300 shadow-[0_0_20px_rgba(16,185,129,0.3)] hover:scale-105 active:scale-95 flex items-center gap-2"
                     >
                        <span>I Want to Help</span>
                        <HandHeart className="w-5 h-5 group-hover/btn:animate-wiggle" />
                     </button>
                 ) : (
                     <button 
                        onClick={() => handleInteract(item)}
                        className="group/btn relative px-8 py-3 bg-gradient-to-r from-orange-500 to-rose-500 hover:from-orange-400 hover:to-rose-400 text-white font-bold rounded-xl transform translate-y-4 group-hover:translate-y-0 transition-all duration-300 shadow-[0_0_20px_rgba(249,115,22,0.3)] hover:scale-105 active:scale-95 flex items-center gap-2"
                     >
                        <span>I Need This</span>
                        <Heart className="w-5 h-5 group-hover/btn:animate-bounce" />
                     </button>
                 )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Marketplace;
