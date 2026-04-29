import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Users, CheckCircle, XCircle, ShieldCheck, 
  LogOut, UserCheck, Mail, Phone, GraduationCap, 
  BadgeCheck, Clock, Search, Menu, X, Trash2, Ban,
  Filter, Heart, Facebook, Instagram, Twitter, ExternalLink
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import api from '../../api/api';

export default function SuperDashboard() {
  const navigate = useNavigate();
  const [usersList, setUsersList] = useState([]); 
  const [activeTab, setActiveTab] = useState('admin'); 
  const [searchTerm, setSearchTerm] = useState('');
  const [genderFilter, setGenderFilter] = useState('all'); // Kotha state gender kosam
  const [loading, setLoading] = useState(true);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [counts, setCounts] = useState({ admins: 0, students: 0 });

  const user = JSON.parse(localStorage.getItem('user')) || { name: 'Super Admin' };

  useEffect(() => {
    fetchData();
    updateSidebarCounts();
  }, [activeTab]);

  const updateSidebarCounts = async () => {
    try {
      const resAdmin = await api.get(`/auth/all-users?role=admin`);
      const resStudent = await api.get(`/auth/all-users?role=student`);
      setCounts({ admins: resAdmin.data.length, students: resStudent.data.length });
    } catch (err) { console.error("Count Error:", err); }
  };

  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await api.get(`/auth/all-users?role=${activeTab}`); 
      setUsersList(res.data);
      setLoading(false);
    } catch (err) { console.error("Error:", err); setLoading(false); }
  };

  const handleAction = async (id, action) => {
    const confirmMsg = action === 'reject' ? "Are you sure you want to PERMANENTLY DELETE this user?" : `Are you sure you want to ${action} this user?`;
    if (!window.confirm(confirmMsg)) return;

    try {
      await api.put(`/auth/approve-user/${id}`, { status: action });
      fetchData(); 
      updateSidebarCounts();
    } catch (err) { alert("Action failed!"); }
  };

  // Improved filtering including Gender
  const filteredUsers = usersList.filter(u => {
    const matchesSearch = u.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
      (u.email && u.email.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (u.userId && u.userId.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesGender = genderFilter === 'all' || u.gender === genderFilter;
    
    return matchesSearch && matchesGender;
  });

  return (
    <div className="min-h-screen bg-[#F1F5F9] flex flex-col md:flex-row font-sans overflow-hidden">
      
      {/* Mobile Header */}
      <div className="md:hidden flex items-center justify-between p-5 bg-[#001529] text-white shadow-xl z-50">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-orange-500 rounded-xl flex items-center justify-center shadow-lg shadow-orange-500/30">
            <ShieldCheck size={24} />
          </div>
          <span className="font-black text-lg tracking-tight uppercase italic">ICEU <span className="text-orange-500">TPT</span></span>
        </div>
        <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="p-2 bg-white/10 rounded-xl">
          {isSidebarOpen ? <X size={26} /> : <Menu size={26} />}
        </button>
      </div>

      {/* Sidebar */}
      <aside className={`fixed inset-y-0 left-0 z-40 w-72 bg-[#001529] text-white flex flex-col transition-transform duration-300 md:relative md:translate-x-0 ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="p-8 flex-1">
           <div className="flex items-center gap-4 mb-12">
              <div className="w-12 h-12 bg-orange-500 rounded-2xl flex items-center justify-center shadow-2xl">
                <ShieldCheck size={28} className="text-white" />
              </div>
              <div>
                <h2 className="text-xl font-black italic tracking-tighter">SUPREME</h2>
                <p className="text-[9px] font-bold text-orange-400 tracking-[0.3em] uppercase">Control Panel</p>
              </div>
           </div>

           <nav className="space-y-3">
              <SidebarLink icon={<UserCheck size={20}/>} label="Admins" count={counts.admins} active={activeTab === 'admin'} onClick={() => { setActiveTab('admin'); setGenderFilter('all'); setIsSidebarOpen(false); }} />
              <SidebarLink icon={<GraduationCap size={20}/>} label="Students" count={counts.students} active={activeTab === 'student'} onClick={() => { setActiveTab('student'); setIsSidebarOpen(false); }} />
           </nav>

           {/* Real-time System Status Indicator */}
           <div className="mt-10 p-4 bg-white/5 rounded-2xl border border-white/10">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400">System Live</span>
              </div>
              <p className="text-[9px] text-slate-500 leading-relaxed font-medium">Monitoring elahibookstall.com database connections in real-time.</p>
           </div>
        </div>

        <div className="p-8">
          <button onClick={() => { localStorage.clear(); navigate('/login'); }} className="w-full py-4 bg-red-500/10 text-red-500 border border-red-500/20 rounded-[1.5rem] font-black flex items-center justify-center gap-2 hover:bg-red-500 hover:text-white transition-all shadow-lg">
            <LogOut size={18} /> LOGOUT
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 h-screen overflow-y-auto flex flex-col">
        <main className="flex-1 p-4 md:p-10 lg:p-12 relative">
          <div className="max-w-6xl mx-auto">
              
              <header className="flex flex-col xl:flex-row justify-between items-start xl:items-center gap-6 mb-12">
                <div>
                  <h1 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tighter">
                    Manage <span className="text-blue-600 uppercase italic">{activeTab}s</span>
                  </h1>
                  <div className="flex items-center gap-3 mt-2">
                    <p className="text-slate-400 font-bold text-sm uppercase tracking-widest">Authority Control System</p>
                    <div className="h-1 w-1 bg-slate-300 rounded-full" />
                    <span className="text-[10px] font-black text-blue-500 bg-blue-50 px-2 py-0.5 rounded-md uppercase tracking-tighter">v2.4 Live</span>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row items-center gap-4 w-full xl:w-auto">
                  {/* Gender Filter Buttons - Visible only for Students */}
                  {activeTab === 'student' && (
                    <div className="flex bg-white p-1.5 rounded-2xl shadow-sm border border-slate-100 w-full sm:w-auto">
                      <button onClick={() => setGenderFilter('all')} className={`flex-1 sm:flex-none px-4 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${genderFilter === 'all' ? 'bg-slate-900 text-white shadow-lg' : 'text-slate-400 hover:bg-slate-50'}`}>All</button>
                      <button onClick={() => setGenderFilter('Male')} className={`flex-1 sm:flex-none px-4 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${genderFilter === 'Male' ? 'bg-blue-600 text-white shadow-lg' : 'text-slate-400 hover:bg-slate-50'}`}>Male</button>
                      <button onClick={() => setGenderFilter('Female')} className={`flex-1 sm:flex-none px-4 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${genderFilter === 'Female' ? 'bg-pink-500 text-white shadow-lg' : 'text-slate-400 hover:bg-slate-50'}`}>Female</button>
                    </div>
                  )}

                  <div className="relative w-full lg:w-80 shadow-2xl shadow-slate-200">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                    <input 
                      type="text" placeholder={`Search records...`} 
                      className="w-full pl-12 pr-6 py-4 rounded-2xl bg-white border-none outline-none font-bold text-slate-700"
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </div>
                </div>
              </header>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-20">
                <AnimatePresence mode='popLayout'>
                  {loading ? (
                    [1, 2, 3].map(n => <div key={n} className="h-64 bg-white animate-pulse rounded-[2.5rem]" />)
                  ) : filteredUsers.map((item) => (
                    <motion.div 
                      layout key={item._id} 
                      initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
                      className="bg-white rounded-[2.5rem] p-6 shadow-xl border border-white hover:shadow-2xl transition-all flex flex-col relative overflow-hidden group"
                    >
                      {/* Gender Indicator Tag */}
                      <div className={`absolute -top-1 -right-1 px-4 py-2 rounded-bl-2xl text-[8px] font-black uppercase tracking-[0.2em] text-white z-10 ${item.gender === 'Male' ? 'bg-blue-500' : 'bg-pink-500'}`}>
                        {item.gender || 'N/A'}
                      </div>

                      <div className={`absolute top-0 right-0 w-24 h-24 blur-[60px] opacity-20 ${item.isApproved ? 'bg-green-500' : 'bg-orange-500'}`} />
                      
                      <div className="flex items-center gap-4 mb-6">
                        <div className={`w-14 h-14 rounded-2xl flex items-center justify-center text-xl font-black text-white shadow-lg ${item.isApproved ? 'bg-blue-600' : 'bg-orange-500'}`}>
                          {item.name.charAt(0)}
                        </div>
                        <div>
                          <h4 className="font-black text-slate-800 text-lg line-clamp-1">{item.name}</h4>
                          <div className="flex items-center gap-1.5">
                            {item.isApproved ? 
                              <span className="text-[9px] font-black text-green-500 uppercase tracking-widest flex items-center gap-1"><BadgeCheck size={12}/> Verified</span> :
                              <span className="text-[9px] font-black text-orange-500 uppercase tracking-widest flex items-center gap-1"><Clock size={12}/> Pending</span>
                            }
                          </div>
                        </div>
                      </div>

                      <div className="flex-1 space-y-3 mb-6">
                        <div className="flex items-center gap-3 text-slate-400 font-bold text-xs">
                          <Mail size={14} className="text-blue-500" />
                          <span className="truncate">{item.email || item.userId}</span>
                        </div>
                        {/* <div className="flex items-center gap-3 text-slate-400 font-bold text-xs">
                          <Phone size={14} className="text-orange-500" />
                          <span>{item.mobile || 'Private Contact'}</span>
                        </div> */}
                      </div>

                      <div className="grid grid-cols-2 gap-3 mt-auto">
                        {!item.isApproved ? (
                          <>
                            <button onClick={() => handleAction(item._id, 'approve')} className="py-3 bg-blue-600 text-white rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-green-500 shadow-lg transition-all flex items-center justify-center gap-2">
                              <CheckCircle size={14} /> Approve
                            </button>
                            <button onClick={() => handleAction(item._id, 'reject')} className="py-3 bg-red-50 text-red-500 border border-red-100 rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-red-500 hover:text-white transition-all flex items-center justify-center gap-2">
                              <Trash2 size={14} /> Reject
                            </button>
                          </>
                        ) : (
                          <>
                            <button onClick={() => handleAction(item._id, 'disapprove')} className="col-span-1 py-3 bg-orange-50 text-orange-600 border border-orange-100 rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-orange-500 hover:text-white transition-all flex items-center justify-center gap-2">
                              <Ban size={14} /> Disapprove
                            </button>
                            <button onClick={() => handleAction(item._id, 'reject')} className="col-span-1 py-3 bg-red-50 text-red-500 border border-red-100 rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-red-500 hover:text-white transition-all flex items-center justify-center gap-2">
                              <Trash2 size={14} /> Delete
                            </button>
                          </>
                        )}
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
              {!loading && filteredUsers.length === 0 && (
                 <div className="flex flex-col items-center justify-center py-40 text-slate-300">
                    <Users size={80} className="opacity-20 mb-4" />
                    <p className="font-black uppercase tracking-[0.3em]">No seekers found</p>
                 </div>
              )}
          </div>
        </main>

        {/* --- PROFESSIONAL FOOTER --- */}
        <footer className="bg-white border-t border-slate-100 py-10 px-6 mt-auto">
          <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center gap-8">
            <div className="flex flex-col items-center md:items-start text-center md:text-left">
              <div className="flex items-center gap-2 mb-3">
                <ShieldCheck size={20} className="text-orange-500" />
                <span className="font-black italic text-slate-800 tracking-tighter">ELAHI <span className="text-blue-600">ADMIN</span></span>
              </div>
              <p className="text-slate-400 text-[10px] font-bold uppercase tracking-widest max-w-[250px]">
                Secured Supreme Control Hub &copy; 2026 TPT ICEU Digital Library Initiative.
              </p>
            </div>

            <div className="flex flex-col items-center md:items-end gap-2">
               <div className="flex items-center gap-1.5 text-slate-400 font-bold text-[10px] uppercase tracking-widest">
                 Made with <Heart size={10} className="text-red-500 fill-red-500" /> for <span className="text-slate-800">Students</span>
               </div>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}

function SidebarLink({ icon, label, count, active, onClick }) {
  return (
    <button onClick={onClick} className={`w-full flex items-center justify-between px-6 py-5 rounded-[1.8rem] font-black transition-all ${active ? 'bg-orange-500 text-white shadow-2xl shadow-orange-500/40 translate-x-2' : 'hover:bg-white/5 text-slate-400'}`}>
      <div className="flex items-center gap-4">
        <span className={active ? 'scale-110' : ''}>{icon}</span> 
        <span className="uppercase text-[11px] tracking-widest">{label}</span>
      </div>
      <span className={`px-3 py-0.5 rounded-lg text-[10px] ${active ? 'bg-white/20 text-white' : 'bg-slate-800 text-slate-500'}`}>{count}</span>
    </button>
  );
}

function FooterIcon({ icon }) {
  return (
    <div className="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center text-slate-400 hover:bg-blue-600 hover:text-white transition-all cursor-pointer shadow-sm">
      {icon}
    </div>
  );
}