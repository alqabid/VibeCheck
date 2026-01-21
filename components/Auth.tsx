
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
  Lock,
  Globe,
  Fingerprint
} from 'lucide-react';
import { COUNTRIES, Country } from '../constants';

interface AuthProps {
  onLogin: () => void;
}

const Auth: React.FC<AuthProps> = ({ onLogin }) => {
  const [step, setStep] = useState<'phone' | 'handshake' | 'otp'>('phone');
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(false);
  const [timer, setTimer] = useState(30);
  
  const [selectedCountry, setSelectedCountry] = useState<Country>(COUNTRIES[0]);
  const [isCountryModalOpen, setIsCountryModalOpen] = useState(false);
  const [countrySearch, setCountrySearch] = useState('');

  const otpRefs = useRef<(HTMLInputElement | null)[]>([]);

  const filteredCountries = useMemo(() => {
    return COUNTRIES.filter(c => 
      c.name.toLowerCase().includes(countrySearch.toLowerCase()) || 
      c.code.includes(countrySearch)
    );
  }, [countrySearch]);

  const rawPhone = useMemo(() => phone.replace(/\D/g, ''), [phone]);
  
  const isPhoneValid = useMemo(() => {
    return rawPhone.length >= selectedCountry.minLength && rawPhone.length <= selectedCountry.maxLength;
  }, [rawPhone, selectedCountry]);

  const formatPhoneNumber = (value: string, country: Country) => {
    const cleaned = value.replace(/\D/g, '');
    
    if (country.format === '(XXX) XXX-XXXX') {
      const match = cleaned.match(/^(\d{0,3})(\d{0,3})(\d{0,4})$/);
      if (!match) return value;
      const parts = [match[1], match[2], match[3]].filter(Boolean);
      if (parts.length === 0) return '';
      if (parts.length === 1) return parts[0];
      if (parts.length === 2) return `(${parts[0]}) ${parts[1]}`;
      return `(${parts[0]}) ${parts[1]}-${parts[2]}`;
    }
    
    // Default dynamic grouping for international numbers
    return cleaned.replace(/(\d{3})(?=\d)/g, '$1 ').trim();
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const cleaned = e.target.value.replace(/\D/g, '');
    if (cleaned.length <= selectedCountry.maxLength) {
      const formatted = formatPhoneNumber(e.target.value, selectedCountry);
      setPhone(formatted);
      if (window.navigator.vibrate) window.navigator.vibrate(5);
    }
  };

  const handleSendCode = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isPhoneValid) return;
    
    setStep('handshake');
    // Simulated Security Handshake
    await new Promise(r => setTimeout(r, 1800));
    setStep('otp');
    setTimer(30);
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
    if (window.navigator.vibrate) window.navigator.vibrate(10);
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      otpRefs.current[index - 1]?.focus();
    }
  };

  const verifyOtp = async () => {
    setIsLoading(true);
    await new Promise(r => setTimeout(r, 1500));
    const code = otp.join('');
    // Validation Logic: Any code starting with '1' is accepted
    if (code.startsWith('1')) {
      if (window.navigator.vibrate) window.navigator.vibrate([40, 40, 100]);
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
                <Globe className="text-black w-7 h-7" />
              </div>
              <h2 className="text-4xl font-black tracking-tight">Access</h2>
            </div>
            
            <p className="text-gray-500 font-bold mb-12 uppercase text-xs tracking-widest leading-loose">
              Enter your mobile number. We'll send an encrypted passcode for global access.
            </p>

            <form onSubmit={handleSendCode} className="space-y-8">
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
                    placeholder="000 000 000"
                    className="w-full bg-transparent pl-20 text-3xl font-black outline-none placeholder:text-gray-800"
                  />
                </div>
                
                <div className="flex justify-between items-center px-1">
                  <div className={`text-[10px] font-black uppercase tracking-widest flex items-center space-x-2 ${isPhoneValid ? 'text-[#00FF00]' : 'text-gray-700'}`}>
                    <div className={`w-1.5 h-1.5 rounded-full ${isPhoneValid ? 'bg-[#00FF00] animate-pulse' : 'bg-gray-700'}`} />
                    <span>{isPhoneValid ? 'Secure Match' : `Awaiting ${selectedCountry.minLength}-${selectedCountry.maxLength} digits`}</span>
                  </div>
                  <div className="text-[10px] font-black text-gray-800 uppercase tracking-widest">
                    {rawPhone.length} / {selectedCountry.maxLength}
                  </div>
                </div>
              </div>

              <button 
                disabled={!isPhoneValid || isLoading}
                type="submit"
                className={`w-full py-6 rounded-3xl text-xl font-black flex items-center justify-center space-x-3 transition-all duration-300 ${isPhoneValid ? 'bg-[#00F0FF] text-black shadow-[0_20px_40px_rgba(0,240,255,0.3)]' : 'bg-[#1A1A1A] text-gray-600 cursor-not-allowed'}`}
              >
                <span>Send Secure Pass</span>
                <ArrowRight className="w-6 h-6" />
              </button>
            </form>
          </motion.div>
        )}

        {step === 'handshake' && (
          <motion.div 
            key="handshake-step"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.1 }}
            className="flex-1 flex flex-col items-center justify-center text-center space-y-10"
          >
            <div className="relative">
              <motion.div 
                animate={{ scale: [1, 1.4, 1], opacity: [0.1, 0.3, 0.1] }}
                transition={{ duration: 1.5, repeat: Infinity }}
                className="absolute inset-0 bg-[#00F0FF] rounded-full blur-3xl"
              />
              <div className="w-32 h-32 bg-[#1A1A1A] border-4 border-[#00F0FF] rounded-[40px] flex items-center justify-center relative z-10 shadow-[0_0_50px_rgba(0,240,255,0.2)]">
                <Fingerprint className="w-16 h-16 text-[#00F0FF] animate-pulse" />
              </div>
            </div>
            <div className="space-y-2">
              <h2 className="text-3xl font-black uppercase tracking-tight">Security Handshake</h2>
              <p className="text-gray-500 font-bold text-sm tracking-widest uppercase">Initializing encrypted gateway...</p>
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
              <h2 className="text-4xl font-black tracking-tight">Verify</h2>
            </div>
            
            <p className="text-gray-500 font-bold mb-12 uppercase text-xs tracking-widest leading-loose">
              Sent to <span className="text-white">{selectedCountry.code} {phone}</span>. <br/>Enter the 6-digit passcode.
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
                <span>Passcode mismatch. Try again.</span>
              </div>
            )}

            <div className="flex flex-col items-center space-y-6">
              {isLoading ? (
                <div className="flex items-center space-x-2 text-[#00F0FF]">
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <span className="text-sm font-black uppercase tracking-widest">Validating Entry...</span>
                </div>
              ) : (
                <>
                  <button 
                    onClick={() => {
                      setOtp(['','','','','','']);
                      setTimer(30);
                    }}
                    disabled={timer > 0}
                    className={`flex items-center space-x-2 font-black uppercase text-[10px] tracking-widest transition-colors ${timer > 0 ? 'text-gray-700' : 'text-[#00F0FF]'}`}
                  >
                    <RefreshCcw className="w-3 h-3" />
                    <span>{timer > 0 ? `Retry in ${timer}s` : 'Resend Now'}</span>
                  </button>
                  
                  <button 
                    onClick={() => setStep('phone')}
                    className="text-gray-500 font-bold text-xs underline"
                  >
                    Change Number
                  </button>
                </>
              )}
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
              <h2 className="text-3xl font-black tracking-tight">Select Region</h2>
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
              {filteredCountries.length === 0 && (
                <div className="py-20 text-center text-gray-600 font-black uppercase text-xs tracking-widest">
                  Region Not Detected
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="mt-auto flex flex-col items-center space-y-6 pb-8">
        <div className="flex items-center space-x-2 text-gray-600 bg-white/5 px-4 py-2 rounded-full">
          <Lock className="w-3 h-3" />
          <span className="text-[10px] font-black uppercase tracking-widest">Global Protocol V.2.0</span>
        </div>
        <p className="text-[10px] text-gray-700 font-bold uppercase tracking-widest px-8 text-center leading-relaxed">
          VibeCheck encrypts all data packets locally before transmission.
        </p>
      </div>
    </motion.div>
  );
};

export default Auth;
