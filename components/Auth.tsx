
import React, { useState, useEffect, useRef, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ArrowRight, 
  Smartphone, 
  ShieldCheck, 
  Loader2, 
  RefreshCcw, 
  AlertCircle, 
  ChevronDown, 
  Search, 
  X, 
  MessageCircle, 
  ExternalLink,
  MessageSquare
} from 'lucide-react';
import { COUNTRIES } from '../constants';

interface AuthProps {
  onLogin: () => void;
}

const Auth: React.FC<AuthProps> = ({ onLogin }) => {
  const [step, setStep] = useState<'phone' | 'sync' | 'otp'>('phone');
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(false);
  const [timer, setTimer] = useState(60);
  const [sessionId] = useState(() => Math.random().toString(36).substring(2, 8).toUpperCase());
  
  const [selectedCountry, setSelectedCountry] = useState(COUNTRIES[0]);
  const [isCountryModalOpen, setIsCountryModalOpen] = useState(false);
  const [countrySearch, setCountrySearch] = useState('');

  const otpRefs = useRef<(HTMLInputElement | null)[]>([]);

  const filteredCountries = useMemo(() => {
    return COUNTRIES.filter(c => 
      c.name.toLowerCase().includes(countrySearch.toLowerCase()) || 
      c.code.includes(countrySearch)
    );
  }, [countrySearch]);

  const formatPhoneNumber = (value: string) => {
    const cleaned = value.replace(/\D/g, '');
    if (selectedCountry.code === '+1') {
      const match = cleaned.match(/^(\d{0,3})(\d{0,3})(\d{0,4})$/);
      if (!match) return value;
      const parts = [match[1], match[2], match[3]].filter(Boolean);
      if (parts.length === 0) return '';
      if (parts.length === 1) return parts[0];
      if (parts.length === 2) return `(${parts[0]}) ${parts[1]}`;
      return `(${parts[0]}) ${parts[1]}-${parts[2]}`;
    }
    return cleaned.replace(/(.{3})/g, '$1 ').trim();
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatPhoneNumber(e.target.value);
    if (formatted.length <= 18) setPhone(formatted);
  };

  const handleOtpChange = (index: number, value: string) => {
    if (isNaN(Number(value))) return;
    const newOtp = [...otp];
    newOtp[index] = value.substring(value.length - 1);
    setOtp(newOtp);
    setError(false);

    if (value && index < 5) {
      otpRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      otpRefs.current[index - 1]?.focus();
    }
  };

  const startSyncProcess = (e: React.FormEvent) => {
    e.preventDefault();
    setStep('sync');
  };

  const openWhatsApp = () => {
    const adminNumber = "233238318021";
    const message = `Authorize VibeCheck Access\nSession ID: [${sessionId}]\nPhone: ${selectedCountry.code}${phone.replace(/\D/g, '')}\n\nPlease send my verification code.`;
    const url = `https://wa.me/${adminNumber}?text=${encodeURIComponent(message)}`;
    window.open(url, '_blank');
    
    // After a delay, show the OTP input so they can enter what the admin sends
    setTimeout(() => {
      setStep('otp');
    }, 2000);
  };

  const verifyOtp = async () => {
    setIsLoading(true);
    await new Promise(r => setTimeout(r, 1500));
    const code = otp.join('');
    // Mock: Codes starting with "1" are success
    if (code.startsWith('1')) {
      if (window.navigator.vibrate) window.navigator.vibrate(50);
      onLogin();
    } else {
      setIsLoading(false);
      setError(true);
      if (window.navigator.vibrate) window.navigator.vibrate([100, 50, 100]);
    }
  };

  useEffect(() => {
    if (otp.every(digit => digit !== '')) {
      verifyOtp();
    }
  }, [otp]);

  useEffect(() => {
    let interval: any;
    if (step === 'otp' && timer > 0) {
      interval = setInterval(() => setTimer(t => t - 1), 1000);
    }
    return () => clearInterval(interval);
  }, [step, timer]);

  const shakeAnimation = {
    x: [0, -10, 10, -10, 10, 0],
    transition: { duration: 0.4 }
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="h-full flex flex-col bg-black text-white p-8 pt-20 overflow-hidden"
    >
      <AnimatePresence mode="wait">
        {step === 'phone' && (
          <motion.div 
            key="phone-step"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            className="flex-1"
          >
            <div className="flex items-center space-x-4 mb-6">
              <div className="w-14 h-14 bg-[#00F0FF] rounded-2xl flex items-center justify-center shadow-[0_0_20px_rgba(0,240,255,0.2)]">
                <Smartphone className="text-black w-7 h-7" />
              </div>
              <h2 className="text-4xl font-black tracking-tight">Vibe In</h2>
            </div>
            
            <p className="text-gray-500 font-bold mb-12 uppercase text-xs tracking-widest leading-loose">
              Direct access via WhatsApp Concierge. Enter your mobile number to begin sync.
            </p>

            <form onSubmit={startSyncProcess} className="space-y-8">
              <div className="flex flex-col space-y-4">
                <button
                  type="button"
                  onClick={() => setIsCountryModalOpen(true)}
                  className="flex items-center justify-between bg-[#1A1A1A] p-4 rounded-2xl border border-white/5 active:scale-95 transition-transform"
                >
                  <div className="flex items-center space-x-3">
                    <span className="text-2xl">{selectedCountry.flag}</span>
                    <span className="font-black text-lg">{selectedCountry.name}</span>
                  </div>
                  <ChevronDown className="w-5 h-5 text-gray-500" />
                </button>

                <div className="relative border-b-2 border-[#1A1A1A] focus-within:border-[#00F0FF] transition-colors pb-4">
                  <span className="absolute left-0 bottom-5 text-2xl font-black text-gray-500">
                    {selectedCountry.code}
                  </span>
                  <input 
                    autoFocus
                    type="tel"
                    value={phone}
                    onChange={handlePhoneChange}
                    placeholder="Mobile number"
                    className="w-full bg-transparent pl-16 text-3xl font-black outline-none placeholder:text-gray-800"
                  />
                </div>
              </div>

              <button 
                disabled={phone.length < 5}
                type="submit"
                className={`w-full py-6 rounded-3xl text-xl font-black flex items-center justify-center space-x-3 transition-all duration-300 ${phone.length >= 5 ? 'bg-[#00F0FF] text-black shadow-[0_20px_40px_rgba(0,240,255,0.3)]' : 'bg-[#1A1A1A] text-gray-600'}`}
              >
                <span>Continue to Sync</span>
                <ArrowRight className="w-6 h-6" />
              </button>
            </form>
          </motion.div>
        )}

        {step === 'sync' && (
          <motion.div 
            key="sync-step"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.1 }}
            className="flex-1 flex flex-col justify-center items-center text-center space-y-12"
          >
            <div className="relative">
              <motion.div 
                animate={{ scale: [1, 1.2, 1], opacity: [0.2, 0.4, 0.2] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="absolute inset-0 bg-[#25D366] rounded-full blur-3xl"
              />
              <div className="w-32 h-32 bg-[#25D366] rounded-full flex items-center justify-center relative z-10 shadow-[0_0_50px_rgba(37,211,102,0.4)]">
                <MessageCircle className="text-white w-16 h-16 fill-white" />
              </div>
            </div>

            <div className="space-y-4">
              <h2 className="text-4xl font-black">WhatsApp Sync</h2>
              <p className="text-gray-400 font-bold text-lg leading-relaxed max-w-xs">
                Tap the button below to message our admin and receive your unique access code.
              </p>
            </div>

            <div className="w-full space-y-4">
              <button 
                onClick={openWhatsApp}
                className="w-full py-6 rounded-3xl bg-white text-black font-black text-xl flex items-center justify-center space-x-3 active:scale-95 transition-all shadow-2xl"
              >
                <ExternalLink className="w-6 h-6" />
                <span>Open WhatsApp</span>
              </button>
              
              <div className="bg-[#1A1A1A] p-4 rounded-2xl flex items-center space-x-3 border border-white/5">
                <div className="w-10 h-10 bg-[#00F0FF]/10 rounded-xl flex items-center justify-center">
                  <MessageSquare className="text-[#00F0FF] w-5 h-5" />
                </div>
                <div className="text-left">
                  <div className="text-[10px] font-black uppercase text-[#00F0FF]">Admin Protocol</div>
                  <div className="text-xs font-bold text-gray-400">Ref: {sessionId}</div>
                </div>
              </div>

              <button 
                onClick={() => setStep('phone')}
                className="text-gray-500 font-bold text-xs underline pt-4"
              >
                Go back and edit number
              </button>
            </div>
          </motion.div>
        )}

        {step === 'otp' && (
          <motion.div 
            key="otp-step"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="flex-1"
          >
            <div className="flex items-center space-x-4 mb-6">
              <div className="w-14 h-14 bg-[#00F0FF] rounded-2xl flex items-center justify-center">
                <ShieldCheck className="text-black w-7 h-7" />
              </div>
              <h2 className="text-4xl font-black tracking-tight">Access Code</h2>
            </div>
            
            <p className="text-gray-500 font-bold mb-12 uppercase text-xs tracking-widest leading-loose">
              Check your WhatsApp for the code sent by the Admin. <br/>Enter it below to complete authorization.
            </p>

            <motion.div 
              animate={error ? shakeAnimation : {}}
              className="flex justify-between mb-10"
            >
              {otp.map((digit, i) => (
                <input
                  key={i}
                  ref={el => otpRefs.current[i] = el}
                  type="tel"
                  maxLength={1}
                  value={digit}
                  onChange={e => handleOtpChange(i, e.target.value)}
                  onKeyDown={e => handleKeyDown(i, e)}
                  autoFocus={i === 0}
                  className={`w-12 h-16 bg-[#1A1A1A] border-2 rounded-2xl text-center text-2xl font-black outline-none transition-all ${error ? 'border-red-500 bg-red-500/10' : digit ? 'border-[#00F0FF]' : 'border-transparent focus:border-white'}`}
                />
              ))}
            </motion.div>

            {error && (
              <div className="flex items-center space-x-2 text-red-500 font-bold text-sm mb-8 justify-center">
                <AlertCircle className="w-4 h-4" />
                <span>Incorrect code. Message admin again if needed.</span>
              </div>
            )}

            <div className="flex flex-col items-center space-y-6">
              {isLoading && (
                <div className="flex items-center space-x-2 text-[#00F0FF]">
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <span className="text-sm font-black uppercase tracking-widest">Verifying Connection...</span>
                </div>
              )}
              
              <button 
                onClick={openWhatsApp}
                className="flex items-center space-x-2 font-black uppercase text-[10px] tracking-widest text-[#00F0FF]"
              >
                <MessageCircle className="w-3 h-3" />
                <span>Message Admin Again</span>
              </button>
              
              <button 
                onClick={() => setStep('phone')}
                className="text-gray-500 font-bold text-xs underline"
              >
                Restart Verification
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isCountryModalOpen && (
          <motion.div
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="absolute inset-0 bg-black z-[200] flex flex-col pt-16"
          >
            <div className="px-6 flex justify-between items-center mb-8">
              <h2 className="text-3xl font-black tracking-tight">Region</h2>
              <button 
                onClick={() => setIsCountryModalOpen(false)}
                className="bg-white/10 p-3 rounded-full active:scale-90 transition-transform"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="px-6 mb-6">
              <div className="bg-[#1A1A1A] flex items-center px-4 py-4 rounded-2xl border border-white/5 focus-within:border-[#00F0FF] transition-all">
                <Search className="w-5 h-5 text-gray-500 mr-3" />
                <input 
                  autoFocus
                  type="text"
                  placeholder="Search countries..."
                  value={countrySearch}
                  onChange={(e) => setCountrySearch(e.target.value)}
                  className="bg-transparent w-full outline-none font-bold placeholder:text-gray-700"
                />
              </div>
            </div>

            <div className="flex-1 overflow-y-auto no-scrollbar px-6 space-y-2 pb-10">
              {filteredCountries.map((c) => (
                <button
                  key={c.name}
                  onClick={() => {
                    setSelectedCountry(c);
                    setIsCountryModalOpen(false);
                    setPhone('');
                  }}
                  className={`w-full flex items-center justify-between p-5 rounded-2xl transition-all ${selectedCountry.name === c.name ? 'bg-[#00F0FF]/10 border border-[#00F0FF]/30' : 'bg-[#1A1A1A]/50 active:bg-white/5 border border-transparent'}`}
                >
                  <div className="flex items-center space-x-4">
                    <span className="text-2xl">{c.flag}</span>
                    <span className={`font-black ${selectedCountry.name === c.name ? 'text-[#00F0FF]' : 'text-white'}`}>
                      {c.name}
                    </span>
                  </div>
                  <span className="font-black text-gray-500">{c.code}</span>
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="mt-auto text-center pb-8">
        <p className="text-[10px] text-gray-700 font-bold uppercase tracking-widest px-8 leading-relaxed">
          Authorized via VibeCheck Concierge Network. By continuing you verify your session identity.
        </p>
      </div>
    </motion.div>
  );
};

export default Auth;
