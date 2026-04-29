import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  BookOpen, User, Mail, Lock, ChevronDown, X, 
  ShieldCheck, DownloadCloud, Globe, Github, Twitter, Heart 
} from 'lucide-react';
import api from '../../api/api';

const LoginPage = () => {
  const [formData, setFormData] = useState({
    loginId: '', 
    password: ''
  });

  const [showForgotModal, setShowForgotModal] = useState(false);
  const [resetData, setResetData] = useState({ email: '', newPassword: '' });

  // --- PWA INSTALL LOGIC (START) ---
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [showInstallBtn, setShowInstallBtn] = useState(false);

  useEffect(() => {
    window.addEventListener('beforeinstallprompt', (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setShowInstallBtn(true);
    });

    window.addEventListener('appinstalled', () => {
      setShowInstallBtn(false);
    });
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === 'accepted') {
      setDeferredPrompt(null);
      setShowInstallBtn(false);
    }
  };
  // --- PWA INSTALL LOGIC (END) ---

  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    const inputVal = formData.email || formData.loginId || ""; 
    const loginIdentifier = inputVal.trim(); 

    if (!loginIdentifier) {
      alert("Please enter Email or User ID");
      return;
    }

    try {
      const res = await api.post('/auth/login', {
        loginId: loginIdentifier,
        password: formData.password
      });

      const { token, user } = res.data;
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));

      alert(`Welcome back, ${user.name}!`);

      if (user.role === 'super-admin') {
        navigate('/super-admin');
      } else if (user.role === 'admin') {
        navigate('/admin');
      } else {
        navigate('/student');
      }
    } catch (err) {
      if (err.response && err.response.status === 403) {
        alert("Your account didnt approved at please contact admin for approval! 🙏");
      } else {
        alert(err.response?.data?.message || "Login Failed!");
      }
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#f8faff] relative overflow-hidden">
      
      {/* --- MODERN NAVBAR --- */}
      <nav className="relative z-[60] w-full px-6 py-5 flex items-center justify-between max-w-7xl mx-auto bg-transparent">
        <div className="flex items-center gap-2">
          <div className="bg-slate-900 p-2 rounded-xl shadow-lg">
            <BookOpen size={20} className="text-orange-500" />
          </div>
          <span className="font-black text-lg tracking-tighter text-slate-800 uppercase italic">
            TPT DL <span className="text-orange-500">STALL</span>
          </span>
        </div>

        <div className="flex items-center gap-4">
          {showInstallBtn && (
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleInstallClick}
              className="flex items-center gap-2 px-5 py-2.5 bg-orange-500 text-white rounded-full font-black text-[10px] uppercase tracking-widest shadow-lg shadow-orange-500/30 hover:bg-slate-900 transition-all border border-orange-400/20"
            >
              <DownloadCloud size={16} className="animate-bounce" /> Install App
            </motion.button>
          )}
          <div className="hidden md:flex items-center gap-1 bg-white/50 px-3 py-1.5 rounded-full border border-white/50 backdrop-blur-sm">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
            <span className="text-[9px] font-black text-slate-400 uppercase tracking-tighter">System Online</span>
          </div>
        </div>
      </nav>

      {/* --- MAIN LOGIN SECTION --- */}
      <div className="flex-1 flex items-center justify-center p-4 relative">
        <div className="absolute top-[10%] left-[-5%] w-72 h-72 bg-orange-200 rounded-full blur-[100px] opacity-40"></div>
        <div className="absolute bottom-[10%] right-[-5%] w-96 h-96 bg-blue-200 rounded-full blur-[120px] opacity-40"></div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="relative z-10 w-full max-w-lg">
          <div className="bg-white/80 backdrop-blur-xl p-8 md:p-12 rounded-[3.5rem] shadow-[0_25px_50px_-12px_rgba(0,0,0,0.08)] border border-white relative overflow-hidden">
            
            {/* Background design element */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-orange-50 rounded-bl-full opacity-50 -z-10"></div>

            <div className="text-center mb-10">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-slate-900 rounded-[1.5rem] mb-6 shadow-2xl rotate-3">
                <BookOpen className="text-orange-500 w-8 h-8" />
              </div>
              <h1 className="text-4xl font-black text-slate-800 tracking-tight uppercase italic leading-none">
                TPT DL <span className="text-orange-500 text-5xl">STALL</span>
              </h1>
              <p className="text-slate-400 mt-4 font-bold uppercase tracking-[0.2em] text-[10px] max-w-[200px] mx-auto leading-relaxed">
                Student ID or Admin Email to Enter portal
              </p>
            </div>

            <form onSubmit={handleLogin} className="space-y-6">
              <div className="space-y-1.5">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-4">Identification</label>
                <div className="relative group">
                  <User className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-300 group-focus-within:text-orange-500 transition-colors" />
                  <input type="text" name="loginId" placeholder="Enter User ID / Email" className="w-full pl-14 pr-6 py-4.5 rounded-[1.8rem] bg-slate-50 border border-transparent focus:border-orange-200 focus:bg-white focus:ring-4 focus:ring-orange-500/5 transition-all font-bold text-slate-700 outline-none" onChange={handleChange} required />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-4">Security Key</label>
                <div className="relative group">
                  <Lock className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-300 group-focus-within:text-orange-500 transition-colors" />
                  <input type="password" name="password" placeholder="••••••••" className="w-full pl-14 pr-6 py-4.5 rounded-[1.8rem] bg-slate-50 border border-transparent focus:border-orange-200 focus:bg-white focus:ring-4 focus:ring-orange-500/5 transition-all font-bold text-slate-700 outline-none" onChange={handleChange} required />
                </div>
              </div>

              <div className="text-right px-2">
                <button type="button" onClick={() => setShowForgotModal(true)} className="text-[10px] font-black text-slate-400 hover:text-orange-500 transition-all uppercase tracking-widest flex items-center gap-1 ml-auto">
                  Forgot Access? <ChevronDown size={12} />
                </button>
              </div>

              <motion.button 
                whileHover={{ scale: 1.02, backgroundColor: "#000" }} 
                whileTap={{ scale: 0.98 }} 
                type="submit" 
                className="w-full py-5 bg-slate-900 text-white font-black rounded-[2rem] shadow-2xl shadow-slate-900/20 hover:shadow-orange-500/20 transition-all text-sm tracking-[0.4em] uppercase mt-4"
              >
                Enter Library
              </motion.button>
            </form>

            <div className="mt-10 text-center border-t border-slate-50 pt-8">
              <p className="text-slate-400 font-bold text-[11px] uppercase tracking-widest">
                New Seeker? <Link to="/register" className="text-orange-500 hover:text-slate-900 transition-colors ml-2 underline decoration-orange-200 underline-offset-4">Create ID Now</Link>
              </p>
            </div>
          </div>
        </motion.div>
      </div>

      {/* --- PROFESSIONAL FOOTER --- */}
      <footer className="relative z-10 w-full bg-white border-t border-slate-100 py-12 px-6">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-10">
          
          <div className="flex flex-col items-center md:items-start">
             <div className="flex items-center gap-2 mb-4">
                <ShieldCheck className="text-orange-500" size={20} />
                <span className="font-black text-slate-800 uppercase italic tracking-tighter">TPT DL <span className="text-orange-500">STALL</span></span>
             </div>
             <p className="text-slate-400 text-[10px] font-bold uppercase tracking-widest leading-relaxed text-center md:text-left max-w-xs">
                Empowering the youth of Tirupati through spiritual wisdom and divine knowledge. 
             </p>
          </div>

          <div className="flex flex-col items-center gap-4">
             {/* <div className="flex gap-6 text-slate-300">
                <Globe size={18} className="hover:text-orange-500 transition-colors cursor-pointer" />
                <Github size={18} className="hover:text-orange-500 transition-colors cursor-pointer" />
                <Twitter size={18} className="hover:text-orange-500 transition-colors cursor-pointer" />
             </div> */}
             <p className="text-slate-300 text-[9px] font-black uppercase tracking-[0.4em]">© 2026 TPT DL Digital Unit</p>
          </div>

          <div className="flex flex-col items-center md:items-end gap-1">
             <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-1.5">
               Designed with <Heart size={10} className="text-red-500 fill-red-500" /> for <span className="text-slate-800">ICEU STUDENTS</span>
             </p>
             <div className="h-1 w-20 bg-orange-500 rounded-full mt-1 opacity-20" />
          </div>

        </div>
      </footer>

      {/* --- FORGOT PASSWORD MODAL (UNCHANGED LOGIC) --- */}
      <AnimatePresence>
        {showForgotModal && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md">
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="bg-white w-full max-w-md p-10 rounded-[3rem] shadow-2xl relative border border-slate-100"
            >
              <button onClick={() => setShowForgotModal(false)} className="absolute top-8 right-8 text-slate-300 hover:text-orange-500 transition-colors">
                <X size={24} />
              </button>
              <h2 className="text-3xl font-black text-slate-800 mb-2 italic tracking-tight">Reset Key</h2>
              <p className="text-slate-400 text-xs mb-8 font-bold uppercase tracking-widest">Enter registered ID & new password.</p>

              <form onSubmit={async (e) => {
                e.preventDefault();
                try {
                  const res = await api.post('/auth/reset-password', resetData);
                  alert(res.data.message);
                  setShowForgotModal(false);
                } catch (err) { alert(err.response?.data?.message || "Failed!"); }
              }} className="space-y-4">
                <input
                    type="text" 
                    placeholder="User ID or Admin Email"
                    className="w-full px-6 py-4 rounded-2xl bg-slate-50 border border-transparent focus:border-orange-200 outline-none focus:ring-4 focus:ring-orange-100 font-bold text-slate-700"
                    onChange={(e) => setResetData({...resetData, loginId: e.target.value})}
                    required
                  />
                <input
                  type="password" placeholder="New Strong Password"
                  className="w-full px-6 py-4 rounded-2xl bg-slate-50 border border-transparent focus:border-orange-200 outline-none focus:ring-4 focus:ring-orange-100 font-bold text-slate-700"
                  onChange={(e) => setResetData({...resetData, newPassword: e.target.value})}
                  required
                />
                <button type="submit" className="w-full py-4.5 bg-slate-900 text-white font-black rounded-2xl hover:bg-orange-600 transition-all uppercase text-[10px] tracking-[0.3em] shadow-xl">
                  Update Access Key
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default LoginPage;