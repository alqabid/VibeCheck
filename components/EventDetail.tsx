import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, Share2, Info, Users, ShieldCheck, Star, ShoppingBag, Sparkles, Loader2 } from 'lucide-react';
import { Event as EventType } from '../types';
import { GoogleGenAI } from "@google/genai";

interface EventDetailProps {
  event: EventType;
  onBack: () => void;
  onBuy: () => void;
}

const EventDetail: React.FC<EventDetailProps> = ({ event, onBack, onBuy }) => {
  const [aiVibe, setAiVibe] = useState<string | null>(null);
  const [loadingAi, setLoadingAi] = useState(false);

  const checkVibeWithAI = async () => {
    setLoadingAi(true);
    try {
      // Fix: Follow @google/genai guidelines - use process.env.API_KEY directly and initialize with named parameter
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: `Describe the 'vibe' of this event in a 3-sentence, high-energy, Gen-Z Snapchat style. Use emojis. Event: ${event.title}. Description: ${event.description}`,
      });
      // Fix: Access .text property directly (do not call as a method)
      setAiVibe(response.text || "Vibe check failed, but trust us, it's lit! 🔥");
    } catch (error) {
      setAiVibe("AI Vibe check is currently recharging. But the energy is 10/10! ✨");
    } finally {
      setLoadingAi(false);
    }
  };

  return (
    <motion.div 
      initial={{ y: '100%' }}
      animate={{ y: 0 }}
      exit={{ y: '100%' }}
      transition={{ type: 'spring', damping: 25, stiffness: 200 }}
      className="absolute inset-0 bg-black z-50 overflow-y-auto no-scrollbar"
    >
      {/* Header Image */}
      <div className="relative h-[50vh] w-full">
        <img src={event.imageUrl} className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent" />
        
        <div className="absolute top-12 left-6 right-6 flex justify-between items-center z-10">
          <button onClick={onBack} className="bg-black/40 backdrop-blur-xl p-4 rounded-full border border-white/10 active:scale-90 transition-transform">
            <ChevronLeft className="w-6 h-6" />
          </button>
          <div className="bg-black/40 backdrop-blur-xl px-4 py-2 rounded-full border border-white/10 font-black text-xs uppercase tracking-widest text-[#00F0FF]">
            {event.category}
          </div>
          <button className="bg-black/40 backdrop-blur-xl p-4 rounded-full border border-white/10 active:scale-90 transition-transform">
            <Share2 className="w-6 h-6" />
          </button>
        </div>
      </div>

      {/* Content Body */}
      <div className="px-6 -mt-20 relative pb-52">
        <div className="flex items-center space-x-2 mb-6">
          <div className="flex -space-x-3">
             {[1,2,3,4].map(i => (
               <img key={i} src={`https://picsum.photos/seed/${i+50}/100/100`} className="w-10 h-10 rounded-full border-2 border-black" />
             ))}
          </div>
          <span className="text-sm text-white font-bold">{event.sold}+ going</span>
        </div>

        <h1 className="text-5xl font-black mb-4 leading-[0.9] tracking-tight">{event.title}</h1>
        
        <div className="flex items-center space-x-3 mb-8">
           <img src={event.hostAvatar} className="w-6 h-6 rounded-full ring-2 ring-[#00F0FF]" />
           <span className="text-gray-400 font-semibold">Hosted by <span className="text-white">{event.hostName}</span></span>
        </div>

        {/* AI Vibe Section */}
        <div className="bg-[#1A1A1A] rounded-[32px] p-6 mb-8 border border-[#00F0FF]/20 relative overflow-hidden">
           <div className="flex justify-between items-center mb-4">
              <h3 className="font-black uppercase text-xs tracking-[0.2em] text-[#00F0FF] flex items-center space-x-2">
                 <Sparkles className="w-4 h-4" />
                 <span>Vibe AI Check</span>
              </h3>
              {!aiVibe && !loadingAi && (
                <button 
                  onClick={checkVibeWithAI}
                  className="text-[10px] font-black uppercase bg-white/10 px-3 py-1 rounded-full text-white"
                >
                  Analyze Energy
                </button>
              )}
           </div>
           
           <AnimatePresence mode="wait">
             {loadingAi ? (
               <motion.div 
                 initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                 className="flex items-center space-x-3 py-4"
               >
                 <Loader2 className="w-5 h-5 text-[#00F0FF] animate-spin" />
                 <span className="text-sm font-bold text-gray-400">Consulting the vibe masters...</span>
               </motion.div>
             ) : aiVibe ? (
               <motion.p 
                 initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                 className="text-white text-lg font-semibold leading-relaxed"
               >
                 {aiVibe}
               </motion.p>
             ) : (
               <p className="text-gray-500 text-sm font-medium">Tap 'Analyze Energy' for an AI breakdown of this event.</p>
             )}
           </AnimatePresence>
        </div>

        {/* Info Grid */}
        <div className="grid grid-cols-2 gap-4 mb-8">
           <div className="bg-[#1A1A1A] p-6 rounded-[32px] space-y-2 border border-white/5">
              <Info className="w-6 h-6 text-[#00F0FF]" />
              <div className="text-[10px] text-gray-500 font-black uppercase tracking-widest">When</div>
              <div className="font-black text-xl">{event.date}</div>
              <div className="text-xs text-gray-400 font-bold">{event.time}</div>
           </div>
           <div className="bg-[#1A1A1A] p-6 rounded-[32px] space-y-2 border border-white/5">
              <Users className="w-6 h-6 text-[#00F0FF]" />
              <div className="text-[10px] text-gray-500 font-black uppercase tracking-widest">Space</div>
              <div className="font-black text-xl">{event.capacity - event.sold} Left</div>
              <div className="text-[10px] text-[#00FF00] font-black uppercase">Rapid Selling</div>
           </div>
        </div>

        <div className="space-y-4 mb-8">
           <h3 className="text-xl font-black flex items-center space-x-2">
             <Star className="w-5 h-5 text-[#00F0FF]" />
             <span>The Breakdown</span>
           </h3>
           <p className="text-gray-400 leading-relaxed text-lg">
             {event.description}
           </p>
        </div>

        <div className="bg-[#00FF00]/10 border border-[#00FF00]/20 p-6 rounded-[32px] flex items-center space-x-4 mb-10">
           <ShieldCheck className="w-12 h-12 text-[#00FF00]" />
           <div>
             <div className="font-black text-[#00FF00] uppercase tracking-wide">Vibe Verified</div>
             <div className="text-xs text-[#00FF00]/70 font-bold leading-tight">Fraud-proof QR entry and instant ticket delivery guaranteed.</div>
           </div>
        </div>
      </div>

      {/* Primary CTA - High Priority Floating Action */}
      <div className="fixed bottom-28 left-0 right-0 px-6 z-50 pointer-events-none">
        <motion.button 
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={onBuy}
          className="pointer-events-auto w-full bg-[#00F0FF] text-black font-black py-6 rounded-3xl text-2xl shadow-[0_20px_50px_rgba(0,240,255,0.4)] flex items-center justify-center space-x-3"
        >
          <ShoppingBag className="w-8 h-8" />
          <span>Get Ticket - ${event.price}</span>
        </motion.button>
      </div>
    </motion.div>
  );
};

export default EventDetail;