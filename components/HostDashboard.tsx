
import React from 'react';
import { motion } from 'framer-motion';
import { BarChart, Bar, XAxis, ResponsiveContainer, Tooltip, Cell } from 'recharts';
import { X, TrendingUp, DollarSign, Users, Plus, ArrowUpRight } from 'lucide-react';

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

const HostDashboard: React.FC<HostDashboardProps> = ({ onClose }) => {
  return (
    <motion.div 
      initial={{ y: '100%' }}
      animate={{ y: 0 }}
      exit={{ y: '100%' }}
      className="absolute inset-0 bg-black z-50 overflow-y-auto p-6"
    >
      <div className="flex justify-between items-center mb-8 pt-12">
        <h1 className="text-4xl font-black">Creator Studio</h1>
        <button onClick={onClose} className="bg-white/10 p-2 rounded-full">
          <X className="w-8 h-8" />
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 gap-4 mb-8">
         <div className="bg-[#00F0FF] p-6 rounded-[32px] text-black">
            <DollarSign className="w-8 h-8 mb-4" />
            <div className="text-xs font-black uppercase mb-1">Total Revenue</div>
            <div className="text-3xl font-black">$12,450</div>
            <div className="flex items-center space-x-1 text-xs mt-2 font-bold">
               <ArrowUpRight className="w-3 h-3" />
               <span>+12% vs last month</span>
            </div>
         </div>
         <div className="bg-[#1A1A1A] p-6 rounded-[32px]">
            <Users className="w-8 h-8 mb-4 text-[#00F0FF]" />
            <div className="text-xs font-black uppercase mb-1 text-gray-500">Ticket Sales</div>
            <div className="text-3xl font-black">842</div>
            <div className="flex items-center space-x-1 text-xs mt-2 font-bold text-[#00FF00]">
               <TrendingUp className="w-3 h-3" />
               <span>Growing fast</span>
            </div>
         </div>
      </div>

      {/* Analytics Chart */}
      <div className="bg-[#1A1A1A] p-6 rounded-[40px] mb-8">
         <h3 className="text-sm font-black uppercase text-gray-500 mb-6 flex justify-between items-center">
            <span>Weekly Sales</span>
            <span className="text-[#00F0FF]">View Full Report</span>
         </h3>
         <div className="h-48 w-full">
            <ResponsiveContainer width="100%" height="100%">
               <BarChart data={data}>
                  <Bar dataKey="sales" radius={[10, 10, 0, 0]}>
                    {data.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={index === 6 ? '#00F0FF' : '#333333'} />
                    ))}
                  </Bar>
                  <XAxis 
                    dataKey="name" 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{ fill: '#666666', fontSize: 10, fontWeight: 800 }} 
                  />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#000', borderRadius: '12px', border: '1px solid #333' }}
                    itemStyle={{ color: '#00F0FF', fontWeight: 'bold' }}
                    cursor={{ fill: 'transparent' }}
                  />
               </BarChart>
            </ResponsiveContainer>
         </div>
      </div>

      {/* Active Events List */}
      <div className="space-y-4 mb-32">
         <h3 className="text-xs font-black uppercase text-gray-500 mb-4 tracking-widest">Your Live Events</h3>
         {[1, 2].map(i => (
           <div key={i} className="bg-[#1A1A1A] p-5 rounded-3xl flex items-center space-x-4">
              <img src={`https://picsum.photos/seed/ev${i}/200/200`} className="w-16 h-16 rounded-2xl object-cover" />
              <div className="flex-1">
                 <div className="font-bold">Neon Underground {i}</div>
                 <div className="text-xs text-gray-500">Aug {15 + i}, 2024 • 10:00 PM</div>
                 <div className="mt-2 w-full bg-gray-800 h-1.5 rounded-full overflow-hidden">
                    <div className="bg-[#00F0FF] h-full w-[70%]" />
                 </div>
              </div>
              <div className="text-right">
                 <div className="text-sm font-bold">$4,200</div>
                 <div className="text-[10px] text-gray-500 uppercase font-black">Earned</div>
              </div>
           </div>
         ))}
      </div>

      {/* FAB - Create New */}
      <div className="fixed bottom-24 left-0 right-0 px-6 pointer-events-none">
         <button className="w-full bg-white text-black py-5 rounded-2xl text-xl font-black flex items-center justify-center space-x-3 pointer-events-auto active:scale-95 transition-transform shadow-[0_10px_40px_rgba(0,0,0,0.5)]">
            <Plus className="w-6 h-6" />
            <span>Host New Event</span>
         </button>
      </div>
    </motion.div>
  );
};

export default HostDashboard;
