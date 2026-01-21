
import React from 'react';
import { Home, Scan, Ticket, LayoutDashboard } from 'lucide-react';
import { ViewState } from '../types';

interface BottomNavProps {
  activeView: ViewState;
  onNavigate: (view: ViewState) => void;
}

const BottomNav: React.FC<BottomNavProps> = ({ activeView, onNavigate }) => {
  const tabs = [
    { id: 'home', icon: <Home />, label: 'Discover' },
    { id: 'scanner', icon: <Scan />, label: 'Scanner' },
    { id: 'tickets', icon: <Ticket />, label: 'Tickets' },
    { id: 'dashboard', icon: <LayoutDashboard />, label: 'Host' },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 h-24 glass-dark border-t border-white/5 px-6 flex items-center justify-around z-50">
      {tabs.map((tab) => {
        const isActive = activeView === tab.id;
        return (
          <button
            key={tab.id}
            onClick={() => onNavigate(tab.id as ViewState)}
            className={`flex flex-col items-center space-y-1 transition-all duration-300 ${isActive ? 'scale-110' : 'opacity-40 grayscale'}`}
          >
            <div className={`p-2 rounded-xl ${isActive ? 'bg-[#00F0FF] text-black shadow-[0_0_20px_rgba(0,240,255,0.4)]' : 'text-white'}`}>
              {React.cloneElement(tab.icon as React.ReactElement, { size: 24, strokeWidth: isActive ? 2.5 : 2 })}
            </div>
            <span className={`text-[10px] font-black uppercase tracking-widest ${isActive ? 'text-[#00F0FF]' : 'text-white'}`}>
              {tab.label}
            </span>
          </button>
        );
      })}
    </div>
  );
};

export default BottomNav;
