import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ViewState, Event as EventType, User, Ticket } from './types';
import { MOCK_USER, MOCK_EVENTS } from './constants';
import Onboarding from './components/Onboarding';
import Auth from './components/Auth';
import Home from './components/Home';
import Scanner from './components/Scanner';
import TicketList from './components/TicketList';
import HostDashboard from './components/HostDashboard';
import EventDetail from './components/EventDetail';
import BottomNav from './components/BottomNav';
import { ShieldCheck, CreditCard, Apple, CheckCircle2, ChevronDown } from 'lucide-react';

const App: React.FC = () => {
  const [view, setView] = useState<ViewState>('onboarding');
  const [user, setUser] = useState<User | null>(null);
  const [selectedEvent, setSelectedEvent] = useState<EventType | null>(null);
  const [userTickets, setUserTickets] = useState<Ticket[]>([]);
  const [showPayment, setShowPayment] = useState<EventType | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [purchaseSuccess, setPurchaseSuccess] = useState(false);

  useEffect(() => {
    const hasOnboarded = localStorage.getItem('onboarded');
    if (hasOnboarded && !user) {
      setView('auth');
    }
  }, [user]);

  const handleOnboardingComplete = () => {
    localStorage.setItem('onboarded', 'true');
    setView('auth');
  };

  const handleLogin = () => {
    setUser(MOCK_USER);
    setView('home');
  };

  const handleEventSelect = (event: EventType) => {
    setSelectedEvent(event);
    setView('eventDetail');
  };

  const handleConfirmPurchase = () => {
    if (!showPayment) return;
    setIsProcessing(true);
    
    setTimeout(() => {
      // Fix: combined 'new' and 'Ticket' into 'newTicket' variable name to resolve type usage error and missing variable error
      const newTicket: Ticket = {
        id: `TKT-${Math.random().toString(36).substr(2, 6).toUpperCase()}`,
        eventId: showPayment.id,
        eventTitle: showPayment.title,
        userId: user?.id || 'anon',
        qrPayload: `VIBE-${Math.random().toString(36).substr(2, 12)}`,
        status: 'valid',
        purchaseDate: new Date().toISOString(),
        tier: 'General Admission'
      };
      setUserTickets(prev => [newTicket, ...prev]);
      setIsProcessing(false);
      setPurchaseSuccess(true);
      
      if (window.navigator.vibrate) window.navigator.vibrate([100, 50, 100]);
      
      setTimeout(() => {
        setPurchaseSuccess(false);
        setShowPayment(null);
        setView('tickets');
      }, 2500);
    }, 2000);
  };

  return (
    <div className="relative h-screen w-screen overflow-hidden bg-black select-none text-white font-['Inter']">
      {/* Centering container for desktop views to keep mobile aspect ratio */}
      <div className="mx-auto max-w-lg h-full relative bg-black shadow-[0_0_100px_rgba(0,240,255,0.05)] border-x border-white/5">
        <AnimatePresence mode="wait">
          {view === 'onboarding' && <Onboarding key="onboarding" onComplete={handleOnboardingComplete} />}
          {view === 'auth' && <Auth key="auth" onLogin={handleLogin} />}
          {view === 'home' && (
            <Home 
              key="home" 
              onSelectEvent={handleEventSelect} 
              onBuyEvent={(ev) => setShowPayment(ev)}
              onHostRequest={() => setView('dashboard')}
            />
          )}
          {view === 'eventDetail' && selectedEvent && (
            <EventDetail 
              key="eventDetail" 
              event={selectedEvent} 
              onBack={() => setView('home')} 
              onBuy={() => setShowPayment(selectedEvent)}
            />
          )}
          {view === 'tickets' && <TicketList key="tickets" tickets={userTickets} onClose={() => setView('home')} />}
          {view === 'scanner' && <Scanner key="scanner" onClose={() => setView('home')} />}
          {view === 'dashboard' && <HostDashboard key="dashboard" onClose={() => setView('home')} />}
        </AnimatePresence>

        {/* Global Bottom Sheet Payment Modal */}
        <AnimatePresence>
          {showPayment && (
            <>
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => !isProcessing && setShowPayment(null)}
                className="absolute inset-0 bg-black/90 backdrop-blur-md z-[100]"
              />
              <motion.div 
                initial={{ y: '100%' }}
                animate={{ y: 0 }}
                exit={{ y: '100%' }}
                transition={{ type: 'spring', damping: 25 }}
                className="absolute bottom-0 left-0 right-0 bg-[#121212] rounded-t-[50px] p-10 z-[110] border-t border-white/10 shadow-2xl"
              >
                <div className="w-12 h-1.5 bg-gray-800 rounded-full mx-auto mb-8" />
                
                {!purchaseSuccess ? (
                  <div className="space-y-8">
                    <div className="flex justify-between items-start">
                      <div className="space-y-1">
                        <h2 className="text-3xl font-black">{isProcessing ? 'Authorizing' : 'Checkout'}</h2>
                        <p className="text-gray-500 font-bold uppercase text-[10px] tracking-widest">{showPayment.title}</p>
                      </div>
                      <div className="text-right">
                        <div className="text-4xl font-black text-[#00F0FF]">${showPayment.price}</div>
                        <div className="text-[10px] text-gray-500 font-black uppercase">Final Price</div>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <button className="w-full bg-[#1A1A1A] p-6 rounded-3xl flex items-center justify-between border border-white/5 active:bg-[#222]">
                        <div className="flex items-center space-x-4">
                          <div className="w-12 h-12 bg-white/5 rounded-2xl flex items-center justify-center">
                            <CreditCard className="text-gray-400" />
                          </div>
                          <div>
                            <div className="font-black text-sm">Visa •••• 4242</div>
                            <div className="text-[10px] text-gray-500 font-bold uppercase">Exp 12/26</div>
                          </div>
                        </div>
                        <ChevronDown className="w-5 h-5 text-gray-600" />
                      </button>
                      
                      <button className="w-full bg-white text-black py-6 rounded-3xl flex items-center justify-center space-x-3 font-black text-xl active:scale-95 transition-transform">
                        <Apple className="w-7 h-7" />
                        <span>Apple Pay</span>
                      </button>
                    </div>

                    <div className="flex flex-col items-center space-y-6 pt-4">
                      <div className="flex items-center space-x-2 text-[10px] text-gray-600 font-black uppercase tracking-widest">
                        <ShieldCheck className="w-4 h-4 text-green-500" />
                        <span>Secured by VibeCheck Protocol</span>
                      </div>
                      
                      <button 
                        disabled={isProcessing}
                        onClick={handleConfirmPurchase}
                        className="w-full bg-[#00F0FF] text-black py-6 rounded-[32px] text-2xl font-black shadow-[0_20px_50px_rgba(0,240,255,0.3)] active:scale-95 transition-all disabled:opacity-50 relative overflow-hidden"
                      >
                        {isProcessing && (
                          <motion.div 
                            initial={{ x: '-100%' }}
                            animate={{ x: '100%' }}
                            transition={{ duration: 1, repeat: Infinity }}
                            className="absolute inset-0 bg-white/20"
                          />
                        )}
                        <span>{isProcessing ? 'Processing...' : 'Confirm Order'}</span>
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="py-16 flex flex-col items-center justify-center space-y-6 text-center">
                    <motion.div 
                      initial={{ scale: 0, rotate: -45 }}
                      animate={{ scale: 1, rotate: 0 }}
                      className="w-24 h-24 bg-green-500 rounded-full flex items-center justify-center shadow-[0_0_50px_rgba(34,197,94,0.5)]"
                    >
                      <CheckCircle2 className="w-14 h-14 text-white" />
                    </motion.div>
                    <div className="space-y-2">
                      <h2 className="text-4xl font-black">Secured!</h2>
                      <p className="text-gray-400 font-bold max-w-xs text-lg">Your pass is ready in your wallet. See you there! ✨</p>
                    </div>
                  </div>
                )}
              </motion.div>
            </>
          )}
        </AnimatePresence>

        {/* Global Nav */}
        {view !== 'onboarding' && view !== 'auth' && (
          <BottomNav 
            activeView={view} 
            onNavigate={(v) => setView(v)} 
          />
        )}
      </div>
    </div>
  );
};

export default App;