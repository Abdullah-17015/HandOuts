
import React, { useState, useEffect, useRef } from 'react';
import { User, Category } from '../types';
import { 
  MapPin, Check, Bot, ArrowRight, Utensils, Shirt, 
  Baby, Droplet, Stethoscope, Home, Bed, Book, 
  PawPrint, Smartphone, Armchair, Gamepad2, Box, 
  Calendar, Users, AlertCircle, Loader2, Navigation, CheckCircle
} from 'lucide-react';

interface OnboardingProps {
  user: User;
  onComplete: (updatedUser: User) => void;
}

const CATEGORY_CONFIG: Record<Category, { icon: any; color: string }> = {
  [Category.FOOD]: { icon: Utensils, color: 'text-orange-400 border-orange-500/50 bg-orange-500/10' },
  [Category.CLOTHES_ADULT]: { icon: Shirt, color: 'text-blue-400 border-blue-500/50 bg-blue-500/10' },
  [Category.CLOTHES_KIDS]: { icon: Shirt, color: 'text-pink-400 border-pink-500/50 bg-pink-500/10' },
  [Category.BABY]: { icon: Baby, color: 'text-purple-400 border-purple-500/50 bg-purple-500/10' },
  [Category.HYGIENE]: { icon: Droplet, color: 'text-cyan-400 border-cyan-500/50 bg-cyan-500/10' },
  [Category.MEDICAL]: { icon: Stethoscope, color: 'text-red-400 border-red-500/50 bg-red-500/10' },
  [Category.HOUSEHOLD]: { icon: Home, color: 'text-emerald-400 border-emerald-500/50 bg-emerald-500/10' },
  [Category.BEDDING]: { icon: Bed, color: 'text-indigo-400 border-indigo-500/50 bg-indigo-500/10' },
  [Category.SCHOOL]: { icon: Book, color: 'text-yellow-400 border-yellow-500/50 bg-yellow-500/10' },
  [Category.PETS]: { icon: PawPrint, color: 'text-amber-600 border-amber-600/50 bg-amber-600/10' },
  [Category.TECH]: { icon: Smartphone, color: 'text-slate-400 border-slate-500/50 bg-slate-500/10' },
  [Category.FURNITURE]: { icon: Armchair, color: 'text-teal-400 border-teal-500/50 bg-teal-500/10' },
  [Category.TOYS]: { icon: Gamepad2, color: 'text-lime-400 border-lime-500/50 bg-lime-500/10' },
  [Category.OTHER]: { icon: Box, color: 'text-gray-400 border-gray-500/50 bg-gray-500/10' },
};

// Sound Effect Utility
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
  } catch (e) {
    console.error("Audio play failed", e);
  }
};

const Onboarding: React.FC<OnboardingProps> = ({ user, onComplete }) => {
  const [step, setStep] = useState(1);
  const [location, setLocation] = useState('');
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [householdSize, setHouseholdSize] = useState(1);
  const [frequency, setFrequency] = useState('Weekly');
  
  // Map States
  const mapRef = useRef<HTMLDivElement>(null);
  const leafletMapRef = useRef<any>(null);
  const markerRef = useRef<any>(null);
  const [isMapLoaded, setIsMapLoaded] = useState(false);
  const [isLocating, setIsLocating] = useState(false);
  const [mapError, setMapError] = useState('');

  // Error Handling
  const [error, setError] = useState('');

  // Initialize Map
  useEffect(() => {
    if (step !== 1) return;
    
    // Check if L is available
    if (!(window as any).L) {
      setMapError("Leaflet library not loaded");
      return;
    }

    const L = (window as any).L;

    if (mapRef.current && !leafletMapRef.current) {
      try {
        const defaultPos = [43.6532, -79.3832]; // Toronto default

        const map = L.map(mapRef.current).setView(defaultPos, 13);
        
        // CartoDB Dark Matter Tiles
        L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
            attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
            subdomains: 'abcd',
            maxZoom: 20
        }).addTo(map);

        // Custom Div Icon
        const customIcon = L.divIcon({
            className: 'custom-pin',
            html: `<div class="w-6 h-6 bg-emerald-500 rounded-full border-2 border-white shadow-[0_0_15px_#10b981] animate-bounce-subtle"></div>`,
            iconSize: [24, 24],
            iconAnchor: [12, 12]
        });

        const marker = L.marker(defaultPos, { 
            draggable: true, 
            icon: customIcon 
        }).addTo(map);

        leafletMapRef.current = map;
        markerRef.current = marker;
        setIsMapLoaded(true);

        // Drag Listener
        marker.on('dragend', function(event: any) {
            playPopSound();
            const position = marker.getLatLng();
            geocodePosition(position.lat, position.lng);
            map.panTo(position);
        });

        // Map Click Listener
        map.on('click', function(e: any) {
            marker.setLatLng(e.latlng);
            playPopSound();
            geocodePosition(e.latlng.lat, e.latlng.lng);
            map.panTo(e.latlng);
        });

      } catch (err) {
        console.error("Map initialization failed", err);
        setMapError("Failed to initialize map.");
      }
    }
  }, [step]);

  // Reverse Geocoding using OpenStreetMap Nominatim
  const geocodePosition = async (lat: number, lng: number) => {
    try {
        const response = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`);
        const data = await response.json();
        if (data && data.address) {
            // Construct a friendly address
            const city = data.address.city || data.address.town || data.address.village || data.address.county;
            const road = data.address.road;
            if (city && road) setLocation(`${road}, ${city}`);
            else if (city) setLocation(city);
            else setLocation(`${lat.toFixed(4)}, ${lng.toFixed(4)}`);
        } else {
            setLocation(`${lat.toFixed(4)}, ${lng.toFixed(4)}`);
        }
    } catch (e) {
        setLocation(`${lat.toFixed(4)}, ${lng.toFixed(4)}`);
    }
  };

  const handleNext = () => {
    setError('');
    
    if (step === 1 && !location) {
       setError('Please enter or select your location.');
       return;
    }
    if (step === 2 && selectedCategories.length === 0) {
       setError('Please select at least one category.');
       return;
    }

    if (step < 3) setStep(step + 1);
    else handleFinish();
  };

  const handleFinish = () => {
    const updatedUser: User = {
      ...user,
      location,
      preferences: selectedCategories,
      householdSize: user.role === 'NEEDER' ? householdSize : undefined,
      helpFrequency: user.role === 'GIVER' ? frequency : undefined
    };
    onComplete(updatedUser);
  };

  const toggleCategory = (cat: string) => {
    if (selectedCategories.includes(cat)) {
      setSelectedCategories(selectedCategories.filter(c => c !== cat));
    } else {
      setSelectedCategories([...selectedCategories, cat]);
    }
  };

  const handleLocateMe = () => {
      setIsLocating(true);
      setMapError('');
      
      if (!navigator.geolocation) {
          setMapError('Geolocation is not supported');
          setIsLocating(false);
          return;
      }

      navigator.geolocation.getCurrentPosition(
          (position) => {
              const { latitude, longitude } = position.coords;
              const pos = [latitude, longitude];
              
              if (leafletMapRef.current && markerRef.current) {
                  const L = (window as any).L;
                  leafletMapRef.current.setView(pos, 14);
                  markerRef.current.setLatLng(pos);
                  playPopSound();
                  geocodePosition(latitude, longitude);
              } else {
                  // Fallback for when map is broken
                  setLocation(`${latitude.toFixed(4)}, ${longitude.toFixed(4)}`);
              }
              setIsLocating(false);
          },
          () => {
              setMapError('Unable to retrieve location');
              setIsLocating(false);
          }
      );
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-10 bg-slate-900 relative">
      
      {/* Progress Bar */}
      <div className="fixed top-0 left-0 w-full h-1.5 bg-slate-800 z-50">
        <div 
          className="h-full bg-emerald-500 transition-all duration-500 ease-out shadow-[0_0_10px_#10b981]"
          style={{ width: `${(step / 3) * 100}%` }}
        ></div>
      </div>

      <div className="w-full max-w-3xl">
        
        {/* Step Counter */}
        <div className="mb-8 flex justify-between items-center">
           <span className="text-xs font-bold tracking-widest text-slate-500 uppercase">Step {step} of 3</span>
           {step === 3 && <span className="text-xs text-emerald-400 font-medium animate-pulse flex items-center gap-1"><CheckCircle className="w-3 h-3" /> Almost there!</span>}
        </div>

        <div className="glass-card p-6 md:p-10 rounded-3xl border border-white/10 shadow-2xl relative overflow-hidden min-h-[600px] flex flex-col">
          
          {/* Background Effects */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3"></div>
          
          {/* Error Toast */}
          {error && (
              <div className="absolute top-6 left-1/2 -translate-x-1/2 bg-red-500/10 border border-red-500/50 text-red-400 px-4 py-2 rounded-lg flex items-center gap-2 text-sm animate-fade-in-up z-20">
                  <AlertCircle className="w-4 h-4" /> {error}
              </div>
          )}

          {/* --- STEP 1: LOCATION & MAP --- */}
          {step === 1 && (
            <div className="flex-1 animate-fade-in-up flex flex-col">
              <div className="w-14 h-14 bg-slate-800 rounded-2xl flex items-center justify-center mb-6 border border-emerald-500/20 shadow-lg">
                <MapPin className="w-7 h-7 text-emerald-400" />
              </div>
              <h2 className="text-3xl font-bold text-white mb-3">Where are you located?</h2>
              <p className="text-slate-400 mb-6">
                 {mapError ? "Enter your location manually below." : "Drag the pin to set your exact location for better matches."}
              </p>

              <div className="flex-1 flex flex-col gap-4">
                  {/* Leaflet Map Container */}
                  <div className="relative w-full h-72 bg-slate-800 rounded-2xl overflow-hidden border border-white/10 group shadow-inner">
                      {mapError ? (
                          <div className="w-full h-full flex flex-col items-center justify-center p-6 text-center bg-slate-800/80">
                              <AlertCircle className="w-10 h-10 text-slate-500 mb-3" />
                              <p className="text-white font-bold mb-1">Map Unavailable</p>
                              <p className="text-xs text-slate-400 max-w-xs">{mapError}</p>
                              <p className="text-xs text-emerald-500 mt-4">Manual entry enabled below</p>
                          </div>
                      ) : (
                          <>
                             <div ref={mapRef} className="w-full h-full z-0" />
                             {!isMapLoaded && !mapError && (
                                <div className="absolute inset-0 flex items-center justify-center bg-slate-800 z-10">
                                    <Loader2 className="w-8 h-8 animate-spin text-emerald-500" />
                                </div>
                             )}
                          </>
                      )}

                      {/* Locate Button */}
                      <button 
                         onClick={handleLocateMe}
                         disabled={isLocating}
                         className="absolute bottom-4 right-4 bg-white text-slate-900 p-3 rounded-xl shadow-lg hover:bg-emerald-50 transition-all active:scale-95 disabled:opacity-70 z-10"
                         title="Use my current location"
                      >
                          {isLocating ? <Loader2 className="w-5 h-5 animate-spin text-emerald-600" /> : <Navigation className="w-5 h-5 text-emerald-600" />}
                      </button>
                  </div>

                  <div className="relative group">
                    <input 
                      type="text" 
                      value={location}
                      onChange={(e) => setLocation(e.target.value)}
                      readOnly={!mapError && isMapLoaded}
                      placeholder={mapError ? "Type your city or address..." : "Select a location on the map"}
                      className={`w-full bg-slate-900/50 border border-slate-700 rounded-xl py-4 px-6 pl-12 text-lg text-white placeholder-slate-600 focus:outline-none focus:border-emerald-500 transition-all shadow-inner ${mapError ? 'cursor-text' : 'cursor-default'}`}
                    />
                    <MapPin className={`absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 transition-colors ${location ? 'text-emerald-500' : 'text-slate-500'}`} />
                    {location && <Check className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-emerald-500 animate-scale-in" />}
                  </div>
              </div>
            </div>
          )}

          {/* --- STEP 2: CATEGORIES --- */}
          {step === 2 && (
            <div className="flex-1 animate-fade-in-up flex flex-col">
              <div className="w-14 h-14 bg-slate-800 rounded-2xl flex items-center justify-center mb-6 border border-emerald-500/20 shadow-lg">
                <Box className="w-7 h-7 text-emerald-400" />
              </div>
              <h2 className="text-3xl font-bold text-white mb-3">
                 {user.role === 'NEEDER' ? 'What do you need?' : 'What can you donate?'}
              </h2>
              <p className="text-slate-400 mb-6">Select all that apply to help us filter your feed.</p>

              <div className="flex-1 overflow-y-auto pr-2 -mr-2 custom-scrollbar">
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 pb-4">
                    {(Object.keys(CATEGORY_CONFIG) as Category[]).map((cat) => {
                      const config = CATEGORY_CONFIG[cat];
                      const Icon = config.icon;
                      const isSelected = selectedCategories.includes(cat);
                      
                      return (
                        <button
                          key={cat}
                          onClick={() => toggleCategory(cat)}
                          className={`p-3 rounded-xl border transition-all duration-200 flex flex-col items-center gap-2 text-center relative overflow-hidden group ${
                            isSelected
                              ? `${config.color} shadow-[0_0_15px_rgba(0,0,0,0.3)] ring-1 ring-inset ring-white/10`
                              : 'bg-slate-800/40 border-white/5 text-slate-500 hover:bg-slate-800 hover:border-white/10 hover:text-slate-300'
                          }`}
                        >
                          <div className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${isSelected ? 'bg-white/10 scale-110' : 'bg-slate-700 group-hover:bg-slate-600'}`}>
                             <Icon className="w-5 h-5" />
                          </div>
                          <span className="text-xs font-semibold leading-tight">{cat}</span>
                          {isSelected && <div className="absolute top-2 right-2 w-2 h-2 bg-white rounded-full shadow-glow"></div>}
                        </button>
                      );
                    })}
                  </div>
              </div>
            </div>
          )}

          {/* --- STEP 3: PERSONALIZATION --- */}
          {step === 3 && (
            <div className="flex-1 animate-fade-in-up">
              <div className="w-14 h-14 bg-slate-800 rounded-2xl flex items-center justify-center mb-6 border border-emerald-500/20 shadow-lg">
                <Bot className="w-7 h-7 text-emerald-400" />
              </div>
              <h2 className="text-3xl font-bold text-white mb-3">Let's personalize Handouts</h2>
              <p className="text-slate-400 mb-8">Our Gemini AI uses this to curate your feed.</p>

              <div className="bg-slate-800/30 rounded-2xl p-8 border border-white/5 mb-6">
                  {user.role === 'NEEDER' ? (
                      <>
                        <div className="flex justify-between items-center mb-6">
                            <label className="text-lg font-medium text-white flex items-center gap-2">
                               <Users className="w-5 h-5 text-emerald-400" /> Household Size
                            </label>
                            <span className="text-3xl font-bold text-emerald-400">{householdSize}</span>
                        </div>
                        <input 
                           type="range" 
                           min="1" 
                           max="10" 
                           value={householdSize} 
                           onChange={(e) => setHouseholdSize(parseInt(e.target.value))}
                           className="w-full h-3 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-emerald-500 hover:accent-emerald-400"
                        />
                        <div className="flex justify-between text-xs text-slate-500 mt-3 font-medium">
                           <span>Just me</span>
                           <span>Big family (10+)</span>
                        </div>
                      </>
                  ) : (
                      <>
                        <div className="flex justify-between items-center mb-6">
                            <label className="text-lg font-medium text-white flex items-center gap-2">
                               <Calendar className="w-5 h-5 text-emerald-400" /> How often can you help?
                            </label>
                        </div>
                        <div className="grid grid-cols-2 gap-3">
                            {['Weekly', 'Bi-weekly', 'Monthly', 'Quarterly', 'Ad-hoc'].map(f => (
                                <button 
                                   key={f} 
                                   onClick={() => setFrequency(f)}
                                   className={`py-3 px-2 rounded-xl font-medium text-sm transition-all border ${
                                      frequency === f 
                                        ? 'bg-emerald-500 border-emerald-400 text-slate-900 shadow-lg scale-[1.02]' 
                                        : 'bg-slate-700 border-transparent text-slate-300 hover:bg-slate-600'
                                   }`}
                                >
                                   {f}
                                </button>
                            ))}
                        </div>
                      </>
                  )}
              </div>

              {/* AI Note */}
              <div className="flex items-start gap-4 bg-gradient-to-r from-emerald-500/10 to-teal-500/10 p-5 rounded-xl border border-emerald-500/20">
                  <div className="p-2 bg-emerald-500/20 rounded-lg">
                     <Bot className="w-5 h-5 text-emerald-400" />
                  </div>
                  <div>
                     <h4 className="text-sm font-bold text-emerald-400 mb-1">AI Optimization</h4>
                     <p className="text-sm text-slate-300 leading-relaxed">
                        "Thanks! I'll prioritize {user.role === 'NEEDER' ? 'urgent family items matching your household size' : `local requests that fit your ${frequency} schedule`}."
                     </p>
                  </div>
              </div>
            </div>
          )}

          {/* Footer Buttons */}
          <div className="mt-auto pt-8 border-t border-white/5 flex justify-end items-center">
             {step > 1 && (
                <button 
                   onClick={() => setStep(step - 1)}
                   className="px-6 py-3 text-slate-400 font-medium hover:text-white transition-colors mr-auto flex items-center gap-2"
                >
                   Back
                </button>
             )}
             <button 
                onClick={handleNext}
                className={`group px-8 py-3 font-bold rounded-xl transition-all flex items-center gap-2 active:scale-95 ${
                  step === 1 && location 
                    ? 'bg-emerald-500 hover:bg-emerald-400 text-slate-900 shadow-[0_0_20px_rgba(16,185,129,0.4)]' 
                    : 'bg-emerald-500 hover:bg-emerald-400 text-slate-900 shadow-lg shadow-emerald-500/20'
                }`}
             >
                {step === 3 ? 'Complete Setup' : 'Next Step'}
                {step === 3 ? <Check className="w-5 h-5" /> : <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />}
             </button>
          </div>

        </div>
      </div>
    </div>
  );
};

export default Onboarding;
