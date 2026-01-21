
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Zap, History, Shield } from 'lucide-react';

interface ScannerProps {
  onClose: () => void;
}

const Scanner: React.FC<ScannerProps> = ({ onClose }) => {
  const [scanResult, setScanResult] = useState<'success' | 'error' | null>(null);
  const [history, setHistory] = useState<string[]>([]);

  // Simulation of scan process
  useEffect(() => {
    if (scanResult) {
      const timer = setTimeout(() => setScanResult(null), 2000);
      return () => clearTimeout(timer);
    }
  }, [scanResult]);

  const simulateScan = () => {
    const success = Math.random() > 0.2;
    setScanResult(success ? 'success' : 'error');
    if (success) {
      setHistory(prev => [`Validated: User_${Math.floor(Math.random()*1000)}`, ...prev]);
      // Mock haptic
      if (window.navigator.vibrate) window.navigator.vibrate(100);
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="absolute inset-0 bg-black z-50 flex flex-col"
    >
      {/* "Camera" Viewport */}
      <div className="flex-1 relative overflow-hidden bg-gray-900">
        {/* Mock Camera Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-900/20 via-black to-purple-900/20 animate-pulse" />
        
        {/* Guidelines */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-72 h-72 border-2 border-white/30 rounded-[40px] relative">
            <div className="absolute top-0 left-0 w-8 h-8 border-t-4 border-l-4 border-[#00F0FF] rounded-tl-2xl" />
            <div className="absolute top-0 right-0 w-8 h-8 border-t-4 border-r-4 border-[#00F0FF] rounded-tr-2xl" />
            <div className="absolute bottom-0 left-0 w-8 h-8 border-b-4 border-l-4 border-[#00F0FF] rounded-bl-2xl" />
            <div className="absolute bottom-0 right-0 w-8 h-8 border-b-4 border-r-4 border-[#00F0FF] rounded-br-2xl" />
            
            {/* Scanner Beam */}
            <motion.div 
              animate={{ top: ['10%', '90%', '10%'] }}
              transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
              className="absolute left-4 right-4 h-0.5 bg-[#00F0FF]/50 shadow-[0_0_15px_#00F0FF]"
            />
          </div>
        </div>

        {/* Scan Status Feedback Overlay */}
        <AnimatePresence>
          {scanResult && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className={`absolute inset-0 flex items-center justify-center z-10 ${scanResult === 'success' ? 'bg-green-500/20' : 'bg-red-500/20'}`}
            >
              <motion.div 
                initial={{ scale: 0.5 }}
                animate={{ scale: 1 }}
                className={`p-6 rounded-full ${scanResult === 'success' ? 'bg-green-500 shadow-[0_0_50px_rgba(34,197,94,0.5)]' : 'bg-red-500 shadow-[0_0_50px_rgba(239,68,68,0.5)]'}`}
              >
                {scanResult === 'success' ? (
                   <Shield className="w-16 h-16 text-white" />
                ) : (
                   <X className="w-16 h-16 text-white" />
                )}
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Top Controls */}
        <div className="absolute top-12 left-6 right-6 flex justify-between items-center">
          <button onClick={onClose} className="p-3 bg-black/40 backdrop-blur-md rounded-full">
            <X className="w-6 h-6 text-white" />
          </button>
          <div className="bg-black/40 backdrop-blur-md px-4 py-2 rounded-full border border-white/10 flex items-center space-x-2">
            <Zap className="w-4 h-4 text-[#00F0FF] fill-[#00F0FF]" />
            <span className="text-sm font-bold">Host Mode: Active</span>
          </div>
          <button className="p-3 bg-black/40 backdrop-blur-md rounded-full">
            <History className="w-6 h-6 text-white" />
          </button>
        </div>

        {/* Scan Button (Simulated) */}
        <div className="absolute bottom-32 left-0 right-0 flex justify-center">
           <button 
             onClick={simulateScan}
             className="w-20 h-20 rounded-full border-4 border-white flex items-center justify-center active:scale-90 transition-transform"
           >
             <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-full border border-white/50" />
           </button>
        </div>
      </div>

      {/* History Panel */}
      <div className="h-64 bg-black border-t border-white/10 p-6 overflow-y-auto">
        <h3 className="text-xs font-black uppercase text-gray-500 mb-4 tracking-widest">Live Entry Log</h3>
        <div className="space-y-4">
          {history.length === 0 ? (
            <p className="text-center text-gray-600 italic py-8">Waiting for scans...</p>
          ) : (
            history.map((log, i) => (
              <motion.div 
                key={i}
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                className="flex items-center justify-between bg-[#1A1A1A] p-4 rounded-2xl"
              >
                <div className="flex items-center space-x-3">
                   <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                   <span className="font-bold">{log}</span>
                </div>
                <span className="text-xs text-gray-500">Just now</span>
              </motion.div>
            ))
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default Scanner;
