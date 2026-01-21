
import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { BarChart, Bar, XAxis, ResponsiveContainer, Tooltip, Cell } from 'recharts';
import { 
  X, TrendingUp, DollarSign, Users, Plus, ArrowUpRight, 
  Image as ImageIcon, Calendar, Clock, MapPin, Tag, 
  ChevronRight, ChevronLeft, Sparkles, CheckCircle2,
  AlertCircle, Loader2, Camera, MapPinHouse, Ticket as TicketIcon,
  Trash2, Send
} from 'lucide-react';
import { APP_COLOR } from '../constants';

interface HostDashboardProps {
  onClose: () => void;
}

const data = [
  { name: 'Mon', sales: 400 },
  { name: 'Tue', sales: 300 },
  { name: 'Wed', sales: 200 },
  { name: 'Thu', sales: 278 },
  { name: 'Fri', sales: 189 },
  { name: 'Sat', sales: 239 },
  { name: 'Sun', sales: 349 },
];

const CATEGORIES = ['Music', 'Party', 'Workshop', 'Art', 'Sports', 'Other'];
const TICKET_TIERS = ['General', 'VIP', 'Early Bird', 'RSVP Only'];

const HostDashboard: React.FC<HostDashboardProps> = ({ onClose }) => {
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [step, setStep] = useState(1);
  const [isPublishing, setIsPublishing] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [isLocating, setIsLocating] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Form State
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'Music',
    date: '',
    time: '',
    location: '',
    price: '',
    capacity: '',
    tier: 'General',
    imageUrl: '' 
  });

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData(prev => ({ ...prev, imageUrl: reader.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleGetCurrentLocation = () => {
    setIsLocating(true);
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition((position) => {
        // In a real app we'd use reverse geocoding here
        setFormData(prev => ({ ...prev, location: `Near My Location (${position.coords.latitude.toFixed(4)}, ${position.coords.longitude.toFixed(4)})` }));
        setIsLocating(false);
        if (window.navigator.vibrate) window.navigator.vibrate(20);
      }, () => {
        setIsLocating(false);
        alert("Could not detect location. Please type it manually.");
      });
    }
  };

  const handlePublish = async () => {
    setIsPublishing(true);
    // Simulated Blockchain/Server Sync
    await new Promise(r => setTimeout(r, 2500));
    setIsPublishing(false);
    setIsSuccess(true);
    if (window.navigator.vibrate) window.navigator.vibrate([100, 30, 100, 30, 200]);
    
    setTimeout(() => {
      setIsSuccess(false);
      setShowCreateModal(false);
      setStep(1);
    }, 3000);
  };

  const nextStep = () => {
    if (window.navigator.vibrate) window.navigator.vibrate(10);
    setStep(s => Math.min(s + 1, 3));
  };
  
  const prevStep = () => {
    if (window.navigator.vibrate) window.navigator.vibrate(10);
    setStep(s => Math.max(s - 1, 1));
  };

  const isStep1Valid = formData.title.length > 3 && formData.description.length > 5;
  const isStep2Valid = formData.date && formData.time && formData.location.length > 3;
  const isStep3Valid = formData.price !== '' && formData.capacity !== '';

  return (
    <motion.div 
      initial={{ y: '100%' }}
      animate={{ y: 0 }}
      exit={{ y: '100%' }}
      className="absolute inset-0 bg-black z-50 overflow-y-auto no-scrollbar"
    >
      <div className="p-6 pb-32">
        <div className="flex justify-between items-center mb-8 pt-12">
          <div>
            <h1 className="text-4xl font-black tracking-tight">Creator Studio</h1>
            <p className="text-gray-500 font-bold uppercase text-[10px] tracking-widest mt-1">Global Event Management</p>
          </div>
          <button onClick={onClose} className="bg-white/10 p-3 rounded-full active:scale-90 transition-transform">
            <X className="w-8 h-8" />
          </button>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 gap-4 mb-8">
           <div className="bg-[#00F0FF] p-6 rounded-[32px] text-black shadow-[0_20px_40px_rgba(0,240,255,0.15)]">
              <DollarSign className="w-8 h-8 mb-4" />
              <div className="text-[10px] font-black uppercase mb-1 opacity-60">Revenue</div>
              <div className="text-3xl font-black">$12,450</div>
           </div>
           <div className="bg-[#1A1A1A] p-6 rounded-[32px] border border-white/5">
              <Users className="w-8 h-8 mb-4 text-[#00F0FF]" />
              <div className="text-[10px] font-black uppercase mb-1 text-gray-500 tracking-widest">Attendees</div>
              <div className="text-3xl font-black">842</div>
           </div>
        </div>

        {/* Analytics Section */}
        <div className="bg-[#1A1A1A] p-6 rounded-[40px] mb-8 border border-white/5">
           <h3 className="text-[10px] font-black uppercase text-gray-500 mb-6 flex justify-between items-center tracking-widest">
              <span>Weekly Momentum</span>
              <div className="flex items-center space-x-1 text-[#00FF00]">
                <TrendingUp className="w-3 h-3" />
                <span>Active</span>
              </div>
           </h3>
           <div className="h-40 w-full">
              <ResponsiveContainer width="100%" height="100%">
                 <BarChart data={data}>
                    <Bar dataKey="sales" radius={[8, 8, 0, 0]}>
                      {data.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={index === 6 ? '#00F0FF' : '#333333'} />
                      ))}
                    </Bar>
                    <XAxis 
                      dataKey="name" 
                      axisLine={false} 
                      tickLine={false} 
                      tick={{ fill: '#444', fontSize: 10, fontWeight: 800 }} 
                    />
                 </BarChart>
              </ResponsiveContainer>
           </div>
        </div>

        {/* Active Vibe List */}
        <div className="space-y-4">
           <h3 className="text-[10px] font-black uppercase text-gray-500 mb-4 tracking-widest">Manage Vibes</h3>
           {[1, 2].map(i => (
             <div 
               key={i} 
               className="bg-[#1A1A1A] p-4 rounded-[32px] flex items-center space-x-4 border border-white/5"
             >
                <img src={`https://picsum.photos/seed/ev${i+20}/200/200`} className="w-16 h-16 rounded-2xl object-cover" />
                <div className="flex-1 min-w-0">
                   <div className="font-black text-sm truncate uppercase">Underground Session {i}</div>
                   <div className="text-[10px] text-gray-500 font-bold uppercase mt-1">70% Attendance</div>
                </div>
                <div className="bg-black/50 p-3 rounded-2xl">
                   <ArrowUpRight className="w-5 h-5 text-[#00F0FF]" />
                </div>
             </div>
           ))}
        </div>
      </div>

      {/* Primary Action FAB */}
      <div className="fixed bottom-28 left-0 right-0 px-6 z-50 pointer-events-none">
         <motion.button 
           whileHover={{ scale: 1.02 }}
           whileTap={{ scale: 0.95 }}
           onClick={() => setShowCreateModal(true)}
           className="w-full bg-white text-black py-6 rounded-3xl text-xl font-black flex items-center justify-center space-x-3 pointer-events-auto shadow-[0_30px_60px_rgba(255,255,255,0.1)] border-b-4 border-gray-300"
         >
            <Plus className="w-7 h-7" />
            <span>Host New Vibe</span>
         </motion.button>
      </div>

      {/* Creation Flow Modal */}
      <AnimatePresence>
        {showCreateModal && (
          <motion.div 
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed inset-0 bg-black z-[100] flex flex-col pt-16"
          >
            {/* Modal Header */}
            <div className="px-6 flex justify-between items-center mb-8">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-[#00F0FF] rounded-2xl flex items-center justify-center">
                  <Plus className="text-black w-6 h-6" />
                </div>
                <div>
                  <h2 className="text-3xl font-black tracking-tight">Create Vibe</h2>
                  <div className="flex space-x-1 mt-1">
                    {[1, 2, 3].map(i => (
                      <div key={i} className={`h-1.5 rounded-full transition-all duration-300 ${i <= step ? 'w-6 bg-[#00F0FF]' : 'w-2 bg-gray-800'}`} />
                    ))}
                  </div>
                </div>
              </div>
              <button 
                onClick={() => { setShowCreateModal(false); setStep(1); }} 
                className="bg-[#1A1A1A] p-3 rounded-full"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto px-6 pb-40 no-scrollbar">
              {!isSuccess ? (
                <AnimatePresence mode="wait">
                  {step === 1 && (
                    <motion.div 
                      key="step1" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}
                      className="space-y-8"
                    >
                      <div className="space-y-4">
                        <label className="text-[10px] font-black uppercase text-gray-500 tracking-widest">Vibe Identity</label>
                        <input 
                          type="text"
                          placeholder="Event Title..."
                          value={formData.title}
                          onChange={e => setFormData({...formData, title: e.target.value})}
                          className="w-full bg-[#1A1A1A] p-6 rounded-3xl text-2xl font-black outline-none border border-transparent focus:border-[#00F0FF] placeholder:text-gray-800"
                        />
                      </div>

                      <div className="space-y-4">
                        <label className="text-[10px] font-black uppercase text-gray-500 tracking-widest">Select Tribe</label>
                        <div className="grid grid-cols-3 gap-2">
                          {CATEGORIES.map(cat => (
                            <button
                              key={cat}
                              onClick={() => setFormData({...formData, category: cat})}
                              className={`py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all ${formData.category === cat ? 'bg-[#00F0FF] text-black shadow-lg shadow-[#00F0FF]/20' : 'bg-[#1A1A1A] text-gray-500 border border-white/5'}`}
                            >
                              {cat}
                            </button>
                          ))}
                        </div>
                      </div>

                      <div className="space-y-4">
                        <label className="text-[10px] font-black uppercase text-gray-500 tracking-widest">What's the energy?</label>
                        <textarea 
                          rows={4}
                          placeholder="Describe the underground experience..."
                          value={formData.description}
                          onChange={e => setFormData({...formData, description: e.target.value})}
                          className="w-full bg-[#1A1A1A] p-6 rounded-3xl text-lg font-bold outline-none border border-transparent focus:border-[#00F0FF] placeholder:text-gray-800 resize-none"
                        />
                      </div>
                    </motion.div>
                  )}

                  {step === 2 && (
                    <motion.div 
                      key="step2" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}
                      className="space-y-8"
                    >
                      {/* Image Upload Area */}
                      <div className="space-y-4">
                        <label className="text-[10px] font-black uppercase text-gray-500 tracking-widest">Event Flyer</label>
                        <div 
                          onClick={() => fileInputRef.current?.click()}
                          className={`relative h-64 w-full rounded-[40px] border-2 border-dashed overflow-hidden flex flex-col items-center justify-center transition-all ${formData.imageUrl ? 'border-transparent' : 'border-gray-800 bg-[#1A1A1A]'}`}
                        >
                          {formData.imageUrl ? (
                            <>
                              <img src={formData.imageUrl} className="absolute inset-0 w-full h-full object-cover" />
                              <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                                <Camera className="w-12 h-12 text-white" />
                              </div>
                            </>
                          ) : (
                            <div className="flex flex-col items-center space-y-3">
                              <ImageIcon className="w-12 h-12 text-gray-700" />
                              <span className="text-xs font-black uppercase text-gray-700 tracking-widest">Upload 4K Flyer</span>
                            </div>
                          )}
                        </div>
                        <input 
                          type="file" 
                          ref={fileInputRef} 
                          onChange={handleImageUpload} 
                          className="hidden" 
                          accept="image/*"
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-4">
                          <label className="text-[10px] font-black uppercase text-gray-500 tracking-widest">Date</label>
                          <input 
                            type="date"
                            value={formData.date}
                            onChange={e => setFormData({...formData, date: e.target.value})}
                            className="w-full bg-[#1A1A1A] p-5 rounded-3xl font-black outline-none border border-transparent focus:border-[#00F0FF] [color-scheme:dark]"
                          />
                        </div>
                        <div className="space-y-4">
                          <label className="text-[10px] font-black uppercase text-gray-500 tracking-widest">Time</label>
                          <input 
                            type="time"
                            value={formData.time}
                            onChange={e => setFormData({...formData, time: e.target.value})}
                            className="w-full bg-[#1A1A1A] p-5 rounded-3xl font-black outline-none border border-transparent focus:border-[#00F0FF] [color-scheme:dark]"
                          />
                        </div>
                      </div>

                      <div className="space-y-4">
                        <label className="text-[10px] font-black uppercase text-gray-500 tracking-widest">Vibe Zone (Location)</label>
                        <div className="relative">
                          <input 
                            type="text"
                            placeholder="Venue name or exact address"
                            value={formData.location}
                            onChange={e => setFormData({...formData, location: e.target.value})}
                            className="w-full bg-[#1A1A1A] p-6 rounded-3xl text-xl font-black outline-none border border-transparent focus:border-[#00F0FF] placeholder:text-gray-800"
                          />
                          <button 
                            onClick={handleGetCurrentLocation}
                            disabled={isLocating}
                            className="absolute right-4 top-4 p-3 bg-black/40 rounded-2xl text-[#00F0FF] active:scale-90 transition-transform disabled:opacity-50"
                          >
                            {isLocating ? <Loader2 className="w-5 h-5 animate-spin" /> : <MapPinHouse className="w-5 h-5" />}
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  )}

                  {step === 3 && (
                    <motion.div 
                      key="step3" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}
                      className="space-y-8"
                    >
                      <div className="space-y-4">
                        <label className="text-[10px] font-black uppercase text-gray-500 tracking-widest">Ticket Category</label>
                        <div className="flex flex-wrap gap-2">
                          {TICKET_TIERS.map(t => (
                            <button
                              key={t}
                              onClick={() => setFormData({...formData, tier: t})}
                              className={`px-5 py-3 rounded-full text-[10px] font-black uppercase tracking-widest transition-all ${formData.tier === t ? 'bg-white text-black' : 'bg-[#1A1A1A] text-gray-500 border border-white/5'}`}
                            >
                              {t}
                            </button>
                          ))}
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-4">
                          <label className="text-[10px] font-black uppercase text-gray-500 tracking-widest flex items-center space-x-2">
                            <DollarSign className="w-3 h-3" />
                            <span>Entry Fee</span>
                          </label>
                          <div className="relative">
                            <span className="absolute left-6 top-6 text-2xl font-black text-gray-700">$</span>
                            <input 
                              type="number"
                              placeholder="0"
                              value={formData.price}
                              onChange={e => setFormData({...formData, price: e.target.value})}
                              className="w-full bg-[#1A1A1A] p-6 pl-12 rounded-3xl text-2xl font-black outline-none border border-transparent focus:border-[#00F0FF] placeholder:text-gray-800"
                            />
                          </div>
                        </div>
                        <div className="space-y-4">
                          <label className="text-[10px] font-black uppercase text-gray-500 tracking-widest flex items-center space-x-2">
                            <Users className="w-3 h-3" />
                            <span>Capacity</span>
                          </label>
                          <input 
                            type="number"
                            placeholder="50"
                            value={formData.capacity}
                            onChange={e => setFormData({...formData, capacity: e.target.value})}
                            className="w-full bg-[#1A1A1A] p-6 rounded-3xl text-2xl font-black outline-none border border-transparent focus:border-[#00F0FF] placeholder:text-gray-800"
                          />
                        </div>
                      </div>

                      <div className="bg-[#00F0FF]/10 border border-[#00F0FF]/20 p-8 rounded-[40px] space-y-6">
                        <div className="flex items-center space-x-3 text-[#00F0FF]">
                          <Sparkles className="w-6 h-6" />
                          <h4 className="font-black uppercase text-sm tracking-[0.2em]">Live Pulse Preview</h4>
                        </div>
                        <div className="space-y-4">
                          <div className="flex justify-between items-end border-b border-white/5 pb-2">
                            <div className="text-[10px] font-black uppercase text-gray-500">Event Title</div>
                            <div className="text-xl font-black text-white">{formData.title || 'Untitled Vibe'}</div>
                          </div>
                          <div className="flex justify-between items-end border-b border-white/5 pb-2">
                            <div className="text-[10px] font-black uppercase text-gray-500">Tier / Price</div>
                            <div className="text-xl font-black text-[#00FF00]">{formData.tier} • ${formData.price || '0'}</div>
                          </div>
                          <div className="flex justify-between items-end">
                            <div className="text-[10px] font-black uppercase text-gray-500">Capacity</div>
                            <div className="text-xl font-black text-white">{formData.capacity || 'Unlimited'} Slots</div>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              ) : (
                <motion.div 
                  initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
                  className="h-full flex flex-col items-center justify-center text-center space-y-10 py-20"
                >
                  <div className="relative">
                    <motion.div 
                      animate={{ scale: [1, 1.5, 1], opacity: [0.1, 0.4, 0.1] }}
                      transition={{ duration: 2, repeat: Infinity }}
                      className="absolute inset-0 bg-[#00FF00] rounded-full blur-3xl"
                    />
                    <div className="w-36 h-36 bg-[#00FF00] rounded-[50px] flex items-center justify-center relative z-10 shadow-[0_0_60px_rgba(0,255,0,0.4)]">
                      <Send className="w-16 h-16 text-black" />
                    </div>
                  </div>
                  <div className="space-y-4">
                    <h2 className="text-5xl font-black uppercase tracking-tight">Vibe is Live</h2>
                    <p className="text-gray-500 font-bold max-w-xs mx-auto text-lg leading-relaxed">Broadcasted to the tribe. Your dashboard is now monitoring the pulse. ✨</p>
                  </div>
                </motion.div>
              )}
            </div>

            {/* Sticky Action Footer */}
            {!isSuccess && (
              <div className="p-6 pb-12 bg-black border-t border-white/5">
                <div className="flex space-x-4">
                  {step > 1 && (
                    <button 
                      onClick={prevStep}
                      className="w-20 h-20 bg-[#1A1A1A] rounded-[32px] flex items-center justify-center border border-white/5 active:scale-90 transition-transform"
                    >
                      <ChevronLeft className="w-8 h-8" />
                    </button>
                  )}
                  
                  {step < 3 ? (
                    <button 
                      onClick={nextStep}
                      disabled={step === 1 ? !isStep1Valid : !isStep2Valid}
                      className={`flex-1 py-6 rounded-3xl text-2xl font-black flex items-center justify-center space-x-3 transition-all ${((step === 1 && isStep1Valid) || (step === 2 && isStep2Valid)) ? 'bg-[#00F0FF] text-black shadow-2xl' : 'bg-[#1A1A1A] text-gray-700 opacity-50 cursor-not-allowed'}`}
                    >
                      <span>Continue</span>
                      <ChevronRight className="w-7 h-7" />
                    </button>
                  ) : (
                    <button 
                      onClick={handlePublish}
                      disabled={!isStep3Valid || isPublishing}
                      className={`flex-1 py-6 rounded-3xl text-2xl font-black flex items-center justify-center space-x-3 transition-all ${isStep3Valid && !isPublishing ? 'bg-[#00FF00] text-black shadow-[0_20px_50px_rgba(0,255,0,0.3)]' : 'bg-[#1A1A1A] text-gray-700 opacity-50 cursor-not-allowed'}`}
                    >
                      {isPublishing ? (
                        <Loader2 className="w-8 h-8 animate-spin" />
                      ) : (
                        <>
                          <span>Broadcast Vibe</span>
                          <Sparkles className="w-7 h-7" />
                        </>
                      )}
                    </button>
                  )}
                </div>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default HostDashboard;
