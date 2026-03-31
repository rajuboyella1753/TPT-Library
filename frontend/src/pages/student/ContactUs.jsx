import React from 'react';
import { motion } from 'framer-motion';
import { Mail, Github, MessageSquare, ShieldAlert, Cpu, ArrowUpRight, BookOpen } from 'lucide-react';

export default function ContactUs() {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }} 
      animate={{ opacity: 1, y: 0 }}
      className="pb-10 lg:pb-20 px-2 sm:px-4"
    >
      {/* Header Section */}
      <div className="text-center mb-8 lg:mb-16">
        <h2 className="text-2xl sm:text-3xl lg:text-5xl font-black text-slate-900 tracking-tighter uppercase mb-4">
          Technical <span className="text-orange-500">Support</span>
        </h2>
        <p className="text-slate-500 font-medium max-w-2xl mx-auto text-xs sm:text-sm lg:text-base px-4">
          Facing any technical glitches or have suggestions for the app? Our developer is here to help you.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
        
        {/* --- Developer Profile Card --- */}
        <div className="lg:col-span-1 h-full">
          <div className="bg-white/70 backdrop-blur-xl border border-white rounded-[2rem] p-6 sm:p-8 lg:p-10 shadow-xl text-center flex flex-col items-center group transition-all hover:shadow-orange-100 h-full">
            <div className="relative w-20 h-20 lg:w-28 lg:h-28 mb-6">
              <div className="absolute inset-0 bg-orange-500 rounded-full animate-pulse opacity-10 group-hover:scale-125 transition-transform duration-500"></div>
              <div className="relative w-full h-full bg-slate-900 rounded-full flex items-center justify-center border-4 border-white shadow-lg overflow-hidden">
                 <Cpu className="text-orange-500" size={32} />
              </div>
            </div>
            
            <h3 className="text-xl lg:text-2xl font-black text-slate-900 uppercase tracking-tight">Raju Boyella</h3>
            <p className="text-orange-500 text-[10px] font-bold uppercase tracking-[0.2em] mb-8">Lead System Architect</p>
            
            <div className="w-full pt-6 border-t border-slate-100 flex justify-center mt-auto">
              <a 
                href="https://github.com/rajuboyella1753?tab=repositories" 
                target="_blank" 
                rel="noreferrer" 
                className="w-full flex items-center justify-center gap-3 px-4 py-3 bg-slate-900 text-white rounded-2xl text-[10px] sm:text-xs font-black uppercase tracking-widest hover:bg-orange-500 transition-all shadow-lg active:scale-95"
              >
                <Github size={16}/> GitHub Profile
              </a>
            </div>
          </div>
        </div>

        {/* --- Support Options --- */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Main Support Box */}
          <div className="bg-white/70 backdrop-blur-xl border border-white rounded-[2rem] p-6 sm:p-8 lg:p-10 shadow-xl relative overflow-hidden group">
            <div className="absolute -top-10 -right-10 p-8 opacity-[0.03] group-hover:rotate-12 transition-transform pointer-events-none hidden sm:block">
              <ShieldAlert size={200} />
            </div>
            
            <div className="relative z-10">
              <div className="flex items-center gap-4 mb-6">
                <div className="p-3 bg-orange-50 text-orange-500 rounded-xl shrink-0">
                  <Mail size={24} />
                </div>
                <h4 className="text-lg lg:text-2xl font-black text-slate-900 uppercase tracking-tight">Report an Issue</h4>
              </div>

              <p className="text-slate-500 text-xs sm:text-sm font-medium leading-relaxed mb-8">
                System slow ga unna, bugs dorikina, leda features pani cheyakapoina direct ga developer ki mail cheyandi.
              </p>
              
              <div className="bg-slate-900 rounded-2xl p-4 sm:p-6 border border-slate-800 shadow-2xl overflow-hidden">
                <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
                  <div className="flex items-center gap-3 w-full sm:w-auto">
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse shadow-[0_0_8px_rgba(34,197,94,0.8)] shrink-0"></div>
                    <span className="text-slate-300 font-mono text-[10px] sm:text-xs lg:text-sm font-bold truncate">
                      rajuboyella737@gmail.com
                    </span>
                  </div>
                  <a 
                    href="mailto:rajuboyella737@gmail.com" 
                    className="w-full sm:w-auto px-6 py-3.5 bg-orange-500 text-white rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-white hover:text-orange-500 transition-all flex items-center justify-center gap-2 whitespace-nowrap shadow-lg active:scale-95"
                  >
                    Compose <ArrowUpRight size={14}/>
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* Guidelines Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
            <div className="bg-white/50 backdrop-blur-sm border border-white rounded-[1.5rem] p-5 shadow-sm">
              <div className="flex items-center gap-3 mb-3">
                <MessageSquare className="text-orange-500" size={18} />
                <h5 className="font-black text-slate-800 uppercase text-[10px] tracking-widest">Guide</h5>
              </div>
              <p className="text-slate-500 text-[10px] sm:text-xs font-semibold leading-relaxed italic opacity-80">
                "Please mention your registered email and attach a screenshot of the error for faster resolution."
              </p>
            </div>

            <div className="bg-orange-50/60 border border-orange-100 rounded-[1.5rem] p-5 flex items-center justify-between shadow-sm group">
              <div>
                <h5 className="font-black text-orange-900 uppercase text-[10px] tracking-widest mb-1">ICEU TPT</h5>
                <p className="text-orange-700 text-[9px] font-bold uppercase tracking-tight opacity-70">Spiritual World Tech</p>
              </div>
              <div className="p-2.5 bg-white rounded-xl shadow-md text-orange-500 group-hover:bg-orange-500 group-hover:text-white transition-all duration-300">
                <BookOpen size={18} />
              </div>
            </div>
          </div>

        </div>
      </div>
    </motion.div>
  );
}