import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Users, CheckCircle, XCircle, ShieldCheck, 
  LogOut, UserCheck, Mail, Phone, GraduationCap, 
  BadgeCheck, Clock, Search, Menu, X 
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import api from '../../api/api';

export default function SuperDashboard() {
  const navigate = useNavigate();
  const [usersList, setUsersList] = useState([]); 
  const [activeTab, setActiveTab] = useState('admin'); 
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  
  // Counts maintain cheyadaniki state
  const [counts, setCounts] = useState({ admins: 0, students: 0 });

  const user = JSON.parse(localStorage.getItem('user')) || { name: 'Super Admin' };

  useEffect(() => {
    fetchData();
    updateSidebarCounts(); // Sidebar counts refresh cheyadaniki
  }, [activeTab]);

  // Sidebar counts fetch chese separate logic
  const updateSidebarCounts = async () => {
    try {
      // Oka vela backend lo simple route unte motham data techukuni filter cheyochu
      const resAdmin = await api.get(`/auth/all-users?role=admin`);
      const resStudent = await api.get(`/auth/all-users?role=student`);
      setCounts({
        admins: resAdmin.data.length,
        students: resStudent.data.length
      });
    } catch (err) {
      console.error("Count Error:", err);
    }
  };

  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await api.get(`/auth/all-users?role=${activeTab}`); 
      setUsersList(res.data);
      setLoading(false);
    } catch (err) {
      console.error("Error:", err);
      setLoading(false);
    }
  };

  const handleAction = async (id, action) => {
    try {
      await api.put(`/auth/approve-user/${id}`, { status: action });
      alert(`User ${action === 'approve' ? 'Approved' : 'Rejected'}!`);
      fetchData(); 
      updateSidebarCounts(); // Action ayyaka count update cheyali
    } catch (err) {
      alert("Action failed!");
    }
  };

  const filteredUsers = usersList.filter(u => 
    u.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    u.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

  return (
    <div className="min-h-screen bg-[#f0f2f5] flex flex-col md:flex-row font-sans relative">
      
      {/* Mobile Top Header */}
      <div className="md:hidden flex items-center justify-between p-4 bg-[#001529] text-white shadow-lg sticky top-0 z-50">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-orange-500 rounded-lg flex items-center justify-center">
            <ShieldCheck size={20} />
          </div>
          <span className="font-black tracking-tighter">ELAHI</span>
        </div>
        <button onClick={toggleSidebar} className="p-2 bg-white/10 rounded-lg text-white">
          {isSidebarOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Sidebar with Separate Counts */}
      <aside className={`fixed inset-y-0 left-0 z-40 w-80 bg-[#001529] text-white flex flex-col shadow-2xl transition-transform duration-300 md:relative md:translate-x-0 ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="flex items-center gap-4 mb-10 px-8 pt-10">
          <div className="w-12 h-12 bg-gradient-to-tr from-orange-500 to-yellow-400 rounded-2xl flex items-center justify-center shadow-lg">
            <ShieldCheck size={30} className="text-white" />
          </div>
          <div>
            <h2 className="text-2xl font-black tracking-tighter">ELAHI</h2>
            <p className="text-[10px] font-bold text-orange-400 tracking-[0.3em]">SUPREME CONTROL</p>
          </div>
        </div>

        <nav className="flex-1 space-y-3 px-6">
          <SidebarLink 
            icon={<UserCheck size={22}/>} 
            label="Admin Control" 
            count={counts.admins} // Admin count ikkada pass chestunnam
            active={activeTab === 'admin'} 
            onClick={() => { setActiveTab('admin'); setIsSidebarOpen(false); }} 
          />
          <SidebarLink 
            icon={<GraduationCap size={22}/>} 
            label="Student Registry" 
            count={counts.students} // Student count ikkada pass chestunnam
            active={activeTab === 'student'} 
            onClick={() => { setActiveTab('student'); setIsSidebarOpen(false); }} 
          />
        </nav>

        <div className="p-6">
          <button 
            onClick={() => { localStorage.clear(); navigate('/login'); }}
            className="w-full flex items-center justify-center gap-3 px-6 py-4 bg-orange-500/10 text-orange-500 border border-orange-500/20 rounded-2xl font-black hover:bg-orange-500 hover:text-white transition-all shadow-lg"
          >
            <LogOut size={20} /> LOGOUT SYSTEM
          </button>
        </div>
      </aside>

      {isSidebarOpen && <div onClick={toggleSidebar} className="fixed inset-0 bg-black/50 z-30 md:hidden transition-opacity"></div>}

      {/* Main Content */}
      <main className="flex-1 p-4 md:p-10 lg:p-14 overflow-y-auto">
        <header className="flex flex-col xl:flex-row justify-between items-start xl:items-center gap-8 mb-12 mt-4 md:mt-0">
          <div>
            <h1 className="text-3xl md:text-5xl font-black text-slate-900 tracking-tight leading-tight">
              {activeTab === 'admin' ? 'Admins' : 'Students'} <span className="text-blue-600">Portal</span>
            </h1>
            <p className="text-slate-500 font-medium text-base md:text-lg mt-2">Manage and monitor community records.</p>
          </div>
          
          <div className="relative w-full xl:w-80">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
            <input 
              type="text" 
              placeholder="Search records..." 
              className="w-full pl-12 pr-4 py-4 rounded-3xl bg-white border-none shadow-sm focus:ring-4 focus:ring-blue-100 outline-none font-bold"
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </header>

        {/* Top Summary Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 mb-10">
           <StatCard label={`Total ${activeTab}s`} count={usersList.length} color="blue" />
           {/* <StatCard label="Waiting Approval" count={usersList.filter(u => !u.isApproved).length} color="orange" /> */}
           {/* <StatCard label="Verified Active" count={usersList.filter(u => u.isApproved).length} color="green" /> */}
        </div>

        {/* Data List Container */}
        <div className="bg-white rounded-[2rem] md:rounded-[3.5rem] p-4 md:p-8 lg:p-12 shadow-2xl shadow-blue-900/5 border border-white">
          {loading ? (
             <div className="space-y-6">
                {[1, 2].map(n => <div key={n} className="h-28 bg-slate-100 animate-pulse rounded-[2rem]"></div>)}
             </div>
          ) : filteredUsers.length === 0 ? (
            <div className="text-center py-16 bg-slate-50 rounded-[2rem] border-2 border-dashed border-slate-200">
               <Users size={60} className="mx-auto mb-4 text-slate-300" />
               <p className="text-lg font-bold text-slate-400">No records found.</p>
            </div>
          ) : (
            <div className="space-y-6">
              <AnimatePresence>
                {filteredUsers.map((item) => (
                  <motion.div key={item._id} initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
                    className={`flex flex-col lg:flex-row lg:items-center justify-between p-5 md:p-8 rounded-[2rem] md:rounded-[2.5rem] transition-all border ${
                      item.isApproved ? 'bg-white border-slate-100 shadow-sm' : 'bg-orange-50/50 border-orange-100'
                    }`}
                  >
                    <div className="flex flex-col sm:flex-row items-center sm:items-start lg:items-center gap-4 md:gap-6 text-center sm:text-left">
                      <div className={`w-16 h-16 md:w-20 md:h-20 rounded-[1.2rem] flex items-center justify-center text-2xl md:text-3xl font-black shadow-inner flex-shrink-0 ${
                        item.isApproved ? 'bg-blue-600 text-white' : 'bg-orange-500 text-white'
                      }`}>
                        {item.name.charAt(0)}
                      </div>
                      <div className="space-y-1">
                        <div className="flex flex-col sm:flex-row items-center gap-2">
                          <h4 className="font-black text-xl md:text-2xl text-slate-800">{item.name}</h4>
                          {item.isApproved ? (
                            <span className="bg-green-500 text-white text-[10px] px-3 py-1 rounded-full font-black flex items-center gap-1 shadow-sm">
                              <BadgeCheck size={14} /> ACTIVE
                            </span>
                          ) : (
                            <span className="bg-orange-100 text-orange-600 text-[10px] px-3 py-1 rounded-full font-black flex items-center gap-1">
                              <Clock size={14} /> PENDING
                            </span>
                          )}
                        </div>
                        <div className="flex flex-col sm:flex-row flex-wrap gap-2 md:gap-4 font-bold text-slate-400">
                           <span className="flex items-center justify-center sm:justify-start gap-2 text-xs md:text-sm lowercase font-medium"><Mail size={16} className="text-blue-500"/> {item.email}</span>
                           <span className="flex items-center justify-center sm:justify-start gap-2 text-xs md:text-sm uppercase tracking-tighter font-medium"><Phone size={16} className="text-orange-500"/> {item.mobile || 'N/A'}</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-col sm:flex-row items-center gap-3 mt-6 lg:mt-0 w-full lg:w-auto">
                      {!item.isApproved ? (
                        <>
                          <button onClick={() => handleAction(item._id, 'approve')} className="w-full sm:w-auto px-6 md:px-8 py-3 md:py-4 bg-blue-600 text-white rounded-2xl font-black text-sm hover:bg-blue-700 shadow-xl shadow-blue-200 flex items-center justify-center gap-2 uppercase transition-all">
                            <CheckCircle size={18} /> Approve
                          </button>
                          <button onClick={() => handleAction(item._id, 'reject')} className="w-full sm:w-auto p-3 md:p-4 bg-white text-red-500 border border-red-100 rounded-2xl hover:bg-red-50 transition-all flex items-center justify-center font-bold">
                            <XCircle size={22} className="mr-2" /> REJECT
                          </button>
                        </>
                      ) : (
                        <div className="w-full lg:w-auto flex items-center justify-center gap-2 text-green-600 font-black px-6 py-3 md:py-4 bg-green-50 rounded-2xl border border-green-100 italic">
                          Verified Member
                        </div>
                      )}
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

// Sidebar Link Component - Ikkada 'count' ni badge la chupisthunnam
function SidebarLink({ icon, label, count, active, onClick }) {
  return (
    <button 
      onClick={onClick} 
      className={`w-full flex items-center justify-between gap-4 px-6 py-5 rounded-2xl font-black transition-all ${
        active ? 'bg-blue-600 text-white shadow-2xl shadow-blue-600/30' : 'hover:bg-white/5 text-slate-400'
      }`}
    >
      <div className="flex items-center gap-4">
        {icon} 
        <span className="whitespace-nowrap">{label}</span>
      </div>
      {/* Dynamic Count Badge */}
      <span className={`px-2.5 py-1 rounded-lg text-xs font-black ${active ? 'bg-white text-blue-600' : 'bg-white/10 text-white'}`}>
        {count}
      </span>
    </button>
  );
}

function StatCard({ label, count, color }) {
  const colors = {
    blue: 'text-blue-600 bg-blue-50 border-blue-100',
    orange: 'text-orange-600 bg-orange-50 border-orange-100',
    green: 'text-green-600 bg-green-50 border-green-100'
  };
  return (
    <div className={`p-4 md:p-6 rounded-[1.5rem] md:rounded-[2rem] border-2 shadow-sm flex flex-col items-center justify-center ${colors[color]}`}>
      <span className="text-[10px] md:text-sm font-black uppercase tracking-widest opacity-60 mb-1">{label}</span>
      <span className="text-3xl md:text-4xl font-black tracking-tighter">{count}</span>
    </div>
  );
}