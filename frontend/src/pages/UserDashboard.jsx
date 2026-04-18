import React from 'react';
import PersonalPipeline from '../components/PersonalPipeline';
import { 
  BarChart3, 
  Clock, 
  LayoutDashboard,
  Calendar,
  Zap
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const UserDashboard = () => {
  const { user } = useAuth();
  const today = new Date().toLocaleDateString('en-GB', { 
    weekday: 'long', 
    day: 'numeric', 
    month: 'long' 
  });

  return (
    <div className="space-y-6 max-w-7xl mx-auto animate-in fade-in duration-500">
      {/* Welcome Header */}
      <div className="bg-slate-900 p-8 rounded-2xl relative overflow-hidden border border-slate-800 shadow-2xl">
         {/* Decorative Background Elements */}
         <div className="absolute top-0 right-0 w-64 h-64 bg-brand-primary/10 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl opacity-50" />
         <div className="absolute bottom-0 left-0 w-48 h-48 bg-indigo-500/10 rounded-full translate-y-1/2 -translate-x-1/2 blur-3xl opacity-30" />
         
         <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
            <div className="space-y-2">
               <div className="flex items-center gap-2 text-brand-primary">
                  <Zap size={16} fill="currentColor" />
                  <span className="text-[10px] font-bold uppercase tracking-[0.3em]">{today}</span>
               </div>
               <h1 className="text-3xl font-bold text-white tracking-tight">
                  Welcome back, <span className="text-brand-primary">{user?.name?.split(' ')[0]}</span>!
               </h1>
               <p className="text-slate-400 text-sm font-medium">
                  You have active follow-ups scheduled for today. Review your pipeline below.
               </p>
            </div>
            
            <div className="flex items-center gap-2 bg-white/5 border border-white/10 p-4 rounded-xl backdrop-blur-sm">
               <div className="p-2 bg-white/10 rounded-lg text-white">
                  <LayoutDashboard size={20} />
               </div>
               <div>
                  <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest leading-none">Access Level</p>
                  <p className="text-xs font-bold text-white uppercase mt-1">{user?.role?.replace('-', ' ')}</p>
               </div>
            </div>
         </div>
      </div>

      {/* Main Content Areas */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
         {/* Left Column: Personal Pipeline */}
         <div className="lg:col-span-12 space-y-6">
            <div className="flex items-center justify-between mb-2">
               <div className="flex items-center gap-2">
                  <div className="w-1.5 h-6 bg-brand-primary rounded-full" />
                  <h2 className="text-lg font-bold text-slate-900 tracking-tight uppercase">Sales Pipeline Operation</h2>
               </div>
            </div>
            
            <PersonalPipeline />
         </div>

         {/* Placeholder for future "Projects & Tasks" metrics */}
         {/* You can add more cards here as the project grows */}
      </div>

      <div className="bg-white p-6 rounded-xl border border-dashed border-slate-200 flex flex-col items-center justify-center text-center space-y-3">
         <div className="p-3 bg-slate-50 text-slate-400 rounded-full">
            <Clock size={24} />
         </div>
         <div>
            <h4 className="text-sm font-bold text-slate-900 uppercase">Project Tracking Module</h4>
            <p className="text-[11px] font-medium text-slate-500 mt-1 max-w-xs mx-auto">
               We are currently finalizing the task management and project timeline features. Stay tuned for the next update.
            </p>
         </div>
      </div>
    </div>
  );
};

export default UserDashboard;
