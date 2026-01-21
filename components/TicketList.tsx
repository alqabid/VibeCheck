
import React from 'react';
import { motion } from 'framer-motion';
import { Ticket as TicketType } from '../types';
import { X, QrCode, Download, Info, ShieldCheck } from 'lucide-react';

interface TicketListProps {
  tickets: TicketType[];
  onClose: () => void;
}

const TicketList: React.FC<TicketListProps> = ({ tickets, onClose }) => {
  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="absolute inset-0 bg-black z-50 overflow-y-auto no-scrollbar pt-12 pb-32"
    >
      <div className="px-6 flex justify-between items-center mb-10">
        <div>
          <h1 className="text-5xl font-black tracking-tighter">My Wallet</h1>
          <p className="text-gray-500 font-bold uppercase text-[10px] tracking-[0.3em] mt-1">Ready for Entry</p>
        </div>
        <button onClick={onClose} className="bg-white/10 p-3 rounded-full active:scale-90 transition-transform">
          <X className="w-8 h-8" />
        </button>
      </div>

      <div className="px-6 space-y-12">
        {tickets.length === 0 ? (
          <div className="text-center py-32 space-y-6">
             <div className="w-32 h-32 bg-[#1A1A1A] rounded-full flex items-center justify-center mx-auto mb-6 border-2 border-dashed border-gray-800">
                <QrCode className="w-16 h-16 text-gray-700" />
             </div>
             <p className="text-gray-400 text-xl font-bold">Your wallet is empty.</p>
             <button onClick={onClose} className="bg-[#00F0FF] text-black font-black px-8 py-4 rounded-2xl active:scale-95 transition-transform">
                Find Vibe
             </button>
          </div>
        ) : (
          tickets.map((ticket, i) => (
            <motion.div 
              key={ticket.id}
              initial={{ scale: 0.9, opacity: 0, y: 30 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1, type: 'spring', damping: 20 }}
              className="relative group"
            >
              {/* Card Decoration */}
              <div className="absolute -inset-1 bg-gradient-to-r from-[#00F0FF] to-transparent opacity-10 rounded-[44px] blur-xl" />
              
              <div className="relative bg-[#1A1A1A] rounded-[40px] overflow-hidden border border-white/5 shadow-2xl">
                <div className="p-10 text-center space-y-8">
                   <div className="flex flex-col items-center">
                      <div className="bg-[#00F0FF]/10 text-[#00F0FF] px-4 py-1 rounded-full text-[10px] font-black uppercase tracking-widest mb-4">
                        General Admission
                      </div>
                      <h2 className="text-3xl font-black leading-tight">{ticket.eventTitle}</h2>
                   </div>
                   
                   {/* QR Code Container */}
                   <div className="relative group mx-auto w-64 h-64 bg-white rounded-[40px] p-6 flex items-center justify-center overflow-hidden">
                      <QrCode className="w-full h-full text-black" />
                      
                      {/* Scanning Animation Glow */}
                      <motion.div 
                        animate={{ 
                          top: ['-100%', '100%'],
                          opacity: [0, 1, 0]
                        }}
                        transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                        className="absolute inset-x-0 h-2 bg-[#00F0FF]/40 blur-md pointer-events-none"
                      />
                   </div>

                   <div className="grid grid-cols-2 gap-8 text-left pt-6 border-t border-white/5">
                      <div>
                         <div className="text-[10px] text-gray-500 uppercase font-black tracking-widest mb-1">Pass ID</div>
                         <div className="font-black text-sm truncate uppercase">{ticket.id.split('-')[1]}</div>
                      </div>
                      <div className="text-right">
                         <div className="text-[10px] text-gray-500 uppercase font-black tracking-widest mb-1">Gate</div>
                         <div className="font-black text-sm">Any Entry</div>
                      </div>
                   </div>
                </div>

                <div className="bg-[#00F0FF] p-8 flex justify-between items-center">
                   <div className="flex items-center space-x-3">
                      <div className="w-3 h-3 rounded-full bg-black animate-pulse shadow-[0_0_10px_rgba(0,0,0,0.5)]" />
                      <span className="text-black font-black uppercase text-xs tracking-wider">Secure Pass Active</span>
                   </div>
                   <div className="flex space-x-5">
                      <button className="text-black active:scale-90 transition-transform"><Download className="w-6 h-6" /></button>
                      <button className="text-black active:scale-90 transition-transform"><Info className="w-6 h-6" /></button>
                   </div>
                </div>
              </div>

              {/* Offline Availability Indicator */}
              <div className="mt-4 flex justify-center items-center space-x-2">
                 <ShieldCheck className="w-4 h-4 text-gray-600" />
                 <span className="text-[10px] font-black text-gray-600 uppercase tracking-widest">Saved Offline</span>
              </div>
            </motion.div>
          ))
        )}
      </div>
    </motion.div>
  );
};

export default TicketList;
