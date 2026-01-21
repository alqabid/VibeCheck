
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Zap, MapPin, Ticket, ChevronRight } from 'lucide-react';

interface OnboardingProps {
  onComplete: () => void;
}

const slides = [
  {
    icon: <Zap className="w-16 h-16 text-[#00F0FF]" />,
    title: "The Vibe Awaits",
    description: "Discover the most exclusive underground events in your city."
  },
  {
    icon: <MapPin className="w-16 h-16 text-[#00F0FF]" />,
    title: "Host Anywhere",
    description: "Got a space? Got a vision? Request to host and start selling."
  },
  {
    icon: <Ticket className="w-16 h-16 text-[#00F0FF]" />,
    title: "Secure Access",
    description: "Encrypted QR tickets that work offline. Just scan and enter."
  }
];

const Onboarding: React.FC<OnboardingProps> = ({ onComplete }) => {
  const [current, setCurrent] = useState(0);

  const next = () => {
    if (current < slides.length - 1) {
      setCurrent(current + 1);
    } else {
      onComplete();
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="flex flex-col h-full bg-black p-8 text-white justify-between items-center"
    >
      <div className="flex-1 flex flex-col items-center justify-center text-center space-y-8">
        <AnimatePresence mode="wait">
          <motion.div
            key={current}
            initial={{ opacity: 0, scale: 0.8, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: -20 }}
            transition={{ type: "spring", damping: 15 }}
            className="flex flex-col items-center"
          >
            <div className="mb-8 p-6 bg-[#1A1A1A] rounded-full">
              {slides[current].icon}
            </div>
            <h1 className="text-4xl font-extrabold mb-4">{slides[current].title}</h1>
            <p className="text-gray-400 text-lg max-w-xs">{slides[current].description}</p>
          </motion.div>
        </AnimatePresence>
      </div>

      <div className="w-full flex flex-col items-center space-y-6">
        <div className="flex space-x-2">
          {slides.map((_, i) => (
            <div 
              key={i} 
              className={`h-1.5 rounded-full transition-all duration-300 ${i === current ? 'w-8 bg-[#00F0FF]' : 'w-2 bg-gray-700'}`}
            />
          ))}
        </div>
        
        <button 
          onClick={next}
          className="w-full bg-[#00F0FF] text-black font-bold py-5 rounded-2xl text-xl flex items-center justify-center space-x-2 active:scale-95 transition-transform"
        >
          <span>{current === slides.length - 1 ? 'Get Started' : 'Next'}</span>
          <ChevronRight className="w-6 h-6" />
        </button>
      </div>
    </motion.div>
  );
};

export default Onboarding;
