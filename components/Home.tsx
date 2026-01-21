
import React from 'react';
import { motion } from 'framer-motion';
import { MOCK_EVENTS } from '../constants';
import { Event as EventType } from '../types';
import { MapPin, Calendar, TrendingUp, ShoppingCart, User as UserIcon } from 'lucide-react';

interface HomeProps {
  onSelectEvent: (event: EventType) => void;
  onBuyEvent: (event: EventType) => void;
  onHostRequest: () => void;
}

const Home: React.FC<HomeProps> = ({ onSelectEvent, onBuyEvent, onHostRequest }) => {
  return (
    <div className="h-full bg-black">
      <div className="snap-container no-scrollbar">
        {MOCK_EVENTS.map((event) => (
          <div key={event.id} className="snap-item relative w-full h-full overflow-hidden">
            {/* Background Image with Ken Burns effect simulation */}
            <motion.img 
              initial={{ scale: 1 }}
              animate={{ scale: 1.1 }}
              transition={{ duration: 20, repeat: Infinity, repeatType: "reverse" }}
              src={event.imageUrl} 
              alt={event.title}
              className="absolute inset-0 w-full h-full object-cover opacity-70"
            />
            
            {/* Overlay Gradient for Text Readability */}
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-black/40" />

            {/* Top Bar Navigation Area */}
            <div className="absolute top-0 left-0 right-0 p-6 flex justify-between items-center pt-14 z-20">
              <div className="flex items-center space-x-2 bg-black/40 backdrop-blur-2xl px-4 py-2 rounded-full border border-white/10">
                <TrendingUp className="w-4 h-4 text-[#00F0FF]" />
                <span className="text-[10px] font-black uppercase tracking-[0.2em] text-[#00F0FF]">Trending</span>
              </div>
              <button className="bg-black/40 backdrop-blur-2xl p-3 rounded-full border border-white/10 active:scale-90 transition-transform">
                <UserIcon className="w-5 h-5 text-white" />
              </button>
            </div>

            {/* Event Meta Floating Pills */}
            <div className="absolute top-32 left-6 right-6 flex flex-wrap gap-2 z-20">
               <div className="bg-white/10 backdrop-blur-xl px-3 py-1 rounded-full text-[10px] font-black uppercase border border-white/5">
                 {event.category}
               </div>
               <div className="bg-[#00F0FF]/20 backdrop-blur-xl px-3 py-1 rounded-full text-[10px] font-black uppercase text-[#00F0FF] border border-[#00F0FF]/20">
                 {event.capacity - event.sold} Spots Left
               </div>
            </div>

            {/* Bottom Content Area */}
            <div className="absolute bottom-32 left-0 right-0 p-6 space-y-6 z-20">
              <motion.div 
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                className="space-y-3"
              >
                <h1 className="text-6xl font-black leading-[0.85] tracking-tighter drop-shadow-2xl text-white">
                  {event.title}
                </h1>
                <div className="flex items-center space-x-4 text-xs font-bold uppercase tracking-widest text-gray-400">
                  <div className="flex items-center space-x-1">
                    <MapPin className="w-3 h-3" />
                    <span>{event.location.split(',')[0]}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Calendar className="w-3 h-3" />
                    <span>{event.date}</span>
                  </div>
                </div>
              </motion.div>

              <div className="flex items-center space-x-3">
                <button 
                  onClick={() => onSelectEvent(event)}
                  className="flex-1 bg-white text-black font-black py-5 rounded-3xl text-xl active:scale-95 transition-all shadow-xl"
                >
                  Details
                </button>
                <motion.button 
                  animate={{ 
                    scale: [1, 1.05, 1],
                    boxShadow: [
                      "0 0 20px rgba(0,240,255,0.3)",
                      "0 0 40px rgba(0,240,255,0.6)",
                      "0 0 20px rgba(0,240,255,0.3)"
                    ]
                  }}
                  transition={{ duration: 2, repeat: Infinity }}
                  onClick={() => onBuyEvent(event)}
                  className="w-24 h-24 bg-[#00F0FF] text-black rounded-[32px] flex flex-col items-center justify-center active:scale-90 transition-transform"
                >
                  <ShoppingCart className="w-6 h-6 mb-1" />
                  <span className="font-black text-2xl leading-none">${event.price}</span>
                  <span className="text-[8px] font-black uppercase mt-1 opacity-60">Buy Now</span>
                </motion.button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Floating Filter Chips (Snapchat style) */}
      <div className="absolute top-24 left-0 right-0 overflow-x-auto flex space-x-2 px-6 no-scrollbar pointer-events-none z-30">
        {['Music', 'Parties', 'Workshops', 'Art', 'Sports'].map((cat) => (
          <button key={cat} className="pointer-events-auto bg-black/60 backdrop-blur-2xl border border-white/10 px-6 py-3 rounded-full whitespace-nowrap text-xs font-black uppercase tracking-widest active:scale-95 hover:bg-[#00F0FF] hover:text-black transition-all">
            {cat}
          </button>
        ))}
      </div>
    </div>
  );
};

export default Home;
