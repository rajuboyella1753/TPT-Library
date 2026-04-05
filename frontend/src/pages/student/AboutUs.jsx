import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { BookOpen, Target, Heart, Sparkles, GraduationCap, Quote, Users } from 'lucide-react';

export default function AboutUs() {
  const [activeTab, setActiveTab] = useState('brothers'); // 'brothers' or 'sisters'

  // Names taken exactly from your uploaded images
  const brothers = [
    { name: "Anji", char: "Nehemiah (The Builder)" },
    { name: "Vamsi", char: "Timothy (The Faithful)" },
    { name: "Suresh", char: "Barnabas (The Encourager)" },
    { name: "Ravi", char: "David (The Worshipper)" },
    { name: "Vinodh", char: "Stephen (The Courageous)" },
    { name: "Poorna Prasad", char: "Samuel (The Dedicated)" },
    { name: "Arun", char: "Andrew (The Bringer)" },
    { name: "Raju", char: "Caleb (The Wholehearted)" },
    { name: "Joshua", char: "Joshua (The Leader)" }
  ];

  const sisters = [
    { name: "Ramya", char: "Ruth (The Loyal)" },
    { name: "J. Sowmya", char: "Mary (The Devoted)" },
    { name: "P. Veena", char: "Esther (The Influential)" },
    { name: "Pavani", char: "Lydia (The Hospitable)" },
    { name: "P. Yamuna", char: "Priscilla (The Teacher)" },
    { name: "Indhu", char: "Hannah (The Prayerful)" },
    { name: "Swathi", char: "Deborah (The Wise)" },
    { name: "Tejaswini", char: "Dorcas (The Kind)" },
    { name: "Sampathi", char: "Rebekah (The Generous)" },
    { name: "Praneetha", char: "Eunice (The Faithful Guide)" },
    { name: "Ramya (M.A)", char: "Sarah (The Believer)" },
    { name: "Kaveri", char: "Abigail (The Peaceful)" },
    { name: "Sharon", char: "Elizabeth (The Blessed)" },
    { name: "Anitha", char: "Tabitha (The Helper)" }
  ];

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="pb-20 px-4 max-w-7xl mx-auto">
      
      {/* --- HERO SECTION --- */}
      <section className="text-center mb-16 pt-10">
        <div className="text-center mb-10 flex justify-center">
  <motion.div 
    initial={{ opacity: 0, y: -20, scale: 0.9 }} 
    animate={{ opacity: 1, y: 0, scale: 1 }}
    transition={{ delay: 0.2, duration: 0.5, type: "spring", stiffness: 100 }}
    whileHover={{ scale: 1.05, y: -2 }}
    className="inline-flex items-center gap-2.5 px-5 py-2 rounded-full border border-orange-100 bg-gradient-to-r from-orange-50/50 to-white backdrop-blur-sm shadow-inner transition-all hover:border-orange-200"
  >
    {/* Animated Icon Container */}
    <div className="p-1.5 rounded-full bg-orange-100 text-orange-600 shadow-sm border border-orange-200">
      <GraduationCap size={14} className="group-hover:rotate-6 transition-transform" />
    </div>

    {/* Legacy Text */}
    <span className="font-black text-[10px] uppercase text-orange-600 tracking-[0.2em] relative">
      Outgoing Students 
      <span className="ml-1.5 text-orange-800 font-extrabold">2026 Legacy</span>
      {/* Subtle Bottom Line Decor */}
      <span className="absolute -bottom-1 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-orange-300 to-transparent"></span>
    </span>

    {/* Small Sparkle for Premium Feel */}
    <Sparkles size={12} className="text-orange-300 fill-orange-200 animate-pulse ml-1" />
  </motion.div>
</div>
        <h2 className="text-4xl lg:text-6xl font-black text-slate-900 tracking-tighter uppercase mb-6">
          A Legacy <span className="text-orange-500">Gifted.</span>
        </h2>
        <p className="text-slate-500 font-medium max-w-2xl mx-auto leading-relaxed text-sm lg:text-base">
          This Spiritual Library is a token of love and gratitude from the outgoing batch of 2025-26. 
          As we step out, we leave behind these pages of wisdom to nourish the generations to come.
        </p>
      </section>

      {/* --- TOGGLE BUTTONS --- */}
      <div className="flex justify-center mb-12">
        <div className="bg-slate-100 p-1.5 rounded-2xl flex items-center gap-2 shadow-inner border border-slate-200">
          <button 
            onClick={() => setActiveTab('brothers')}
            className={`px-8 py-3 rounded-xl font-black text-[10px] uppercase tracking-widest transition-all flex items-center gap-2 ${activeTab === 'brothers' ? 'bg-white text-slate-900 shadow-md scale-105' : 'text-slate-400 hover:text-slate-600'}`}
          >
            <Users size={14} /> Brothers
          </button>
          <button 
            onClick={() => setActiveTab('sisters')}
            className={`px-8 py-3 rounded-xl font-black text-[10px] uppercase tracking-widest transition-all flex items-center gap-2 ${activeTab === 'sisters' ? 'bg-white text-orange-600 shadow-md scale-105' : 'text-slate-400 hover:text-slate-600'}`}
          >
            <Heart size={14} /> Sisters
          </button>
        </div>
      </div>

      {/* --- MEMORABLE STONES SECTION --- */}
      <section className="min-h-[400px]">
        <div className="text-center mb-10">
          <h3 className="text-xl font-black text-slate-800 uppercase tracking-tight flex items-center justify-center gap-3">
            <Sparkles className="text-orange-500" size={20} /> 
            {activeTab === 'brothers' ? 'The Students' : 'The Students'} of ICEU TPT
          </h3>
          <p className="text-slate-400 text-[10px] font-bold uppercase tracking-[0.3em] mt-2 italic">Click each stone to see their spirit</p>
        </div>

        <AnimatePresence mode="wait">
          <motion.div 
            key={activeTab}
            initial={{ opacity: 0, x: activeTab === 'brothers' ? -20 : 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: activeTab === 'brothers' ? 20 : -20 }}
            transition={{ duration: 0.3 }}
            className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 lg:gap-6"
          >
            {activeTab === 'brothers' ? (
              brothers.map((b, i) => <MemberCard key={i} name={b.name} character={b.char} color="bg-slate-900" />)
            ) : (
              sisters.map((s, i) => <MemberCard key={i} name={s.name} character={s.char} color="bg-gradient-to-br from-orange-500 to-orange-600" />)
            )}
          </motion.div>
        </AnimatePresence>
      </section>

      {/* --- VISION & MISSION --- */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-32 max-w-5xl mx-auto">
        <div className="bg-white/60 backdrop-blur-xl border border-white rounded-[2.5rem] p-8 shadow-xl group hover:shadow-orange-100 transition-all">
          <Target className="text-orange-500 mb-4 group-hover:rotate-12 transition-transform" size={32} />
          <h4 className="text-xl font-black text-slate-900 uppercase mb-4 tracking-tighter">Our Vision</h4>
          <p className="text-slate-500 text-sm leading-relaxed font-medium opacity-80">To be a beacon of spiritual wisdom for students in Tirupati, fostering deep spiritual maturity through reading.</p>
        </div>
        <div className="bg-white/60 backdrop-blur-xl border border-white rounded-[2.5rem] p-8 shadow-xl group hover:shadow-orange-100 transition-all">
          <Heart className="text-orange-500 mb-4 group-hover:scale-110 transition-transform" size={32} />
          <h4 className="text-xl font-black text-slate-900 uppercase mb-4 tracking-tighter">Our Mission</h4>
          <p className="text-slate-500 text-sm leading-relaxed font-medium opacity-80">Making life-transforming literature accessible to help students discover their divine purpose in God's kingdom.</p>
        </div>
      </div>

      {/* --- FINAL QUOTE --- */}
      <footer className="mt-20 pt-10 text-center border-t border-slate-100">
        <Quote className="mx-auto text-orange-200 mb-4 opacity-50" size={40} />
        <p className="text-lg lg:text-xl font-bold text-slate-800 italic px-4">"Go forth and set the world on fire with the love you found here."</p>
        <div className="mt-6">
            <p className="font-black text-slate-900 uppercase tracking-widest text-[10px]">ICEU TPT | Batch of 2025-26</p>
            <p className="text-[9px] font-bold text-orange-500 uppercase tracking-[0.4em] mt-1">Inter-Collegiate Evangelical Union</p>
        </div>
      </footer>
    </motion.div>
  );
}

function MemberCard({ name, character, color }) {
  const [flipped, setFlipped] = useState(false);

  return (
    <div 
      className="w-full h-32 lg:h-36 cursor-pointer"
      style={{ perspective: '1000px' }} // Perspective ikkada pettali paka
      onClick={() => setFlipped(!flipped)}
    >
      <motion.div 
        animate={{ rotateY: flipped ? 180 : 0 }}
        transition={{ duration: 0.6, type: "spring", stiffness: 260, damping: 20 }}
        style={{ 
          transformStyle: 'preserve-3d', 
          width: '100%', 
          height: '100%', 
          position: 'relative' 
        }}
      >
        {/* FRONT SIDE - Student Name (e.g., Raju) */}
        <div 
          className="absolute inset-0 flex flex-col items-center justify-center p-4 bg-white border border-slate-200 rounded-2xl shadow-lg"
          style={{ 
            backfaceVisibility: 'hidden',
            WebkitBackfaceVisibility: 'hidden'
          }}
        >
          <p className="text-center font-black text-slate-800 uppercase text-[11px] sm:text-xs tracking-tighter">
            {name}
          </p>
        </div>

        {/* BACK SIDE - Bible Character (e.g., Solomon) */}
        {/* Important: rotateY(180deg) ikkada kachitanga undali text straight ga ravadaniki */}
        <div 
          className={`absolute inset-0 flex flex-col items-center justify-center p-4 ${color} rounded-2xl shadow-xl text-white border border-white/20`}
          style={{ 
            backfaceVisibility: 'hidden',
            WebkitBackfaceVisibility: 'hidden',
            transform: 'rotateY(180deg)' 
          }}
        >
          <p className="text-[8px] uppercase font-black opacity-60 tracking-widest mb-1 text-center">Spirit of</p>
          <p className="text-center font-bold text-[10px] sm:text-xs leading-tight">
            {character}
          </p>
        </div>
      </motion.div>
    </div>
  );
}