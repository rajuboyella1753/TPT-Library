import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

import { 
  LogOut, Search, Heart, 
  BookOpen, ChevronRight, Menu, X, 
  Home, Sparkles, AlertCircle, 
  Zap, Plus, CheckCircle2, XCircle, Send, ArrowUpRight, HelpCircle, Mail, Info, Phone , ChevronDown
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import api from '../../api/api';
import AboutUs from './AboutUs';
import ContactUs from './ContactUs';

export default function StudentDashboard() {
  const navigate = useNavigate();
  const [books, setBooks] = useState([]);
  const [wishlist, setWishlist] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [activePage, setActivePage] = useState('home');

  const [showModal, setShowModal] = useState(false);
  const [selectedBook, setSelectedBook] = useState(null);
  const [isSending, setIsSending] = useState(false);
  const [bookLimit, setBookLimit] = useState(100);
  const user = JSON.parse(localStorage.getItem('user')) || { name: 'Seeker' };
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

  useEffect(() => {
    fetchBooks();
    if (user && user._id) {
        fetchUserWishlist();
    }
  }, []);

  const fetchBooks = async () => {
    try {
      const res = await api.get('/books');
      setBooks(res.data);
      setLoading(false);
    } catch (err) {
      console.error("Error fetching books:", err);
      setLoading(false);
    }
  };

  const fetchUserWishlist = async () => {
    try {
        const res = await api.get(`/wishlist/${user._id}`);
        const ids = res.data.map(item => item._id);
        setWishlist(ids);
    } catch (err) {
        console.error("Wishlist fetch error");
    }
  };

  const toggleWishlist = async (bookId) => {
    if (!user || !user._id) {
      alert("Session error. Please login again mama! 🙏");
      return;
    }
    try {
      const res = await api.post('/wishlist/toggle', {
        userId: user._id,
        bookId: bookId
      });
      setWishlist(res.data.wishlist); 
    } catch (err) {
      console.error("Wishlist sync error");
    }
  };

  const handleRequestClick = (book) => {
    if (book.status === 'Borrowed' || book.status === 'Out of Stock') {
        alert(`This book is currently ${book.status}. 🙏`);
        return;
    }
    setSelectedBook(book);
    setShowModal(true);
  };

  const handleCustomRequest = async () => {
    setIsSending(true);
    try {
        const requestData = {
            studentName: user.name,
            studentEmail: user.email,
            bookTitle: `UNAVAILABLE BOOK: ${searchTerm}`, 
        };
        await api.post('/books/request-book', requestData);
        alert(`Request for "${searchTerm}" sent to Admin! Anji will check it soon. 🙏`);
        setSearchTerm('');
    } catch (err) {
        alert("Failed to send special request.");
    } finally {
        setIsSending(false);
    }
  };

const confirmRequest = () => {
  const freshUser = JSON.parse(localStorage.getItem('user'));
  const phoneNumber = "916301390960"; // Nee WhatsApp number (91 prefix tho)
  
  const message = `📖 *New Book Request*%0A` + 
                  `--------------------------%0A` +
                  `👤 *Student:* ${freshUser.name}%0A` +
                  `📧 *Email:* ${freshUser.email}%0A` +
                  `📚 *Book:* ${selectedBook.title}%0A` +
                  `--------------------------%0A` +
                  `Please check the availability and bring on next Working Day! 🙏`;

  const whatsappURL = `https://wa.me/${phoneNumber}?text=${message}`;
  
  window.open(whatsappURL, '_blank');
  setShowModal(false);
  setIsSending(false);
};

  const displayedBooks = books
    .filter(book => {
      const matchesSearch = book.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            book.author.toLowerCase().includes(searchTerm.toLowerCase());
      if (activePage === 'wishlist') return wishlist.includes(book._id) && matchesSearch;
      return matchesSearch;
    })
    .slice(0, bookLimit);

  return (
    <div className="h-screen bg-[#FDFCFB] text-slate-900 font-sans selection:bg-orange-500 selection:text-white flex overflow-hidden">
      
      {/* Mobile Sidebar Overlay */}
      <AnimatePresence>
        {isSidebarOpen && (
          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={() => setIsSidebarOpen(false)}
            className="fixed inset-0 bg-indigo-950/60 backdrop-blur-sm z-[60] lg:hidden"
          />
        )}
      </AnimatePresence>

      {/* Sidebar - Indigo Blue Theme */}
      <aside className={`fixed inset-y-0 left-0 z-[70] w-72 bg-indigo-950 border-r border-indigo-900 transform transition-all duration-500 lg:relative lg:translate-x-0 ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="p-6 flex flex-col h-full">
          <div className="flex items-center justify-between mb-12 px-2">
            <div className="flex items-center gap-3">
              <img src="/UESI.png" alt="Logo" className="w-10 h-10 object-contain rounded-xl bg-white p-1" />
              <div>
                <h2 className="text-xl font-black text-white tracking-tighter leading-none uppercase">ICEU TPT</h2>
                <p className="text-[9px] font-bold text-orange-400 uppercase tracking-widest mt-1">Spiritual Library</p>
              </div>
            </div>
            <button onClick={() => setIsSidebarOpen(false)} className="lg:hidden p-2 text-indigo-300 hover:text-white">
              <X size={20} />
            </button>
          </div>

          <nav className="flex-1 space-y-2">
            <SidebarLink icon={<Home size={20}/>} label="Library Home" active={activePage === 'home'} onClick={() => {setActivePage('home'); setIsSidebarOpen(false)}} />
            <SidebarLink icon={<Heart size={20}/>} label="My Wishlist" active={activePage === 'wishlist'} count={wishlist.length} onClick={() => {setActivePage('wishlist'); setIsSidebarOpen(false)}} />
            <SidebarLink icon={<Info size={20}/>} label="About Us" active={activePage === 'about'} onClick={() => {setActivePage('about'); setIsSidebarOpen(false)}} />
            <SidebarLink icon={<Phone size={20}/>} label="Contact Us" active={activePage === 'contact'} onClick={() => {setActivePage('contact'); setIsSidebarOpen(false)}} />
          </nav>

          <button onClick={() => {localStorage.clear(); navigate('/login');}} className="flex items-center gap-4 px-6 py-5 text-indigo-400 hover:text-red-400 font-black mt-auto rounded-2xl hover:bg-white/5 transition-all">
            <LogOut size={20} /> Sign Out
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col h-full overflow-hidden">
        
        {/* Fixed Navbar - White Theme */}
        <nav className="z-50 bg-white border-b border-slate-100 px-4 lg:px-10 py-4 flex items-center justify-between shrink-0 shadow-sm">
          <div className="flex items-center gap-3">
             <button onClick={() => setIsSidebarOpen(true)} className="lg:hidden p-2.5 bg-indigo-50 text-indigo-600 rounded-xl hover:bg-indigo-600 hover:text-white transition-all shadow-sm">
                <Menu size={20} />
             </button>
          </div>
          
          <div className="relative w-full max-w-xs md:max-w-md mx-4">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-indigo-400" size={16} />
            <input 
              type="text" placeholder="Search for wisdom..." value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-11 pr-4 py-3 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-indigo-500/20 outline-none transition-all text-sm font-bold text-indigo-900 shadow-inner"
            />
          </div>

          <div className="flex items-center gap-3">
            <div className="hidden md:flex flex-col items-end leading-none">
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Seeker</span>
              <span className="text-sm font-black text-indigo-950 mt-1">{user.name}</span>
            </div>
            <div className="w-11 h-11 bg-orange-500 rounded-2xl flex items-center justify-center text-white font-black text-sm shadow-lg shadow-orange-200">
              {user.name.charAt(0)}
            </div>
          </div>
        </nav>

        {/* --- SCROLLABLE SECTION --- */}
        <div className="flex-1 overflow-y-auto bg-slate-50/50">
          <main className="p-4 sm:p-6 lg:p-10 pb-24">
            <div className="max-w-7xl mx-auto">
              
              {activePage === 'home' && (
                <>
                  <div className="mb-10 flex flex-col md:flex-row items-center justify-between gap-6 bg-white p-6 rounded-[2.5rem] border border-slate-200 shadow-sm">
                    <div className="flex items-center gap-5">
                      <div className="p-3 bg-indigo-50 rounded-2xl">
                        <img src="/UESI.png" alt="Logo" className="w-10 h-10 sm:w-16 sm:h-16 object-contain" />
                      </div>
                      <div>
                        <h1 className="text-xl sm:text-4xl font-black text-indigo-950 tracking-tighter uppercase leading-none">
                          TPT <span className="text-orange-500">ICEU</span>
                        </h1>
                        <p className="text-[10px] sm:text-xs font-bold text-slate-400 uppercase tracking-[0.4em] mt-1.5">Spiritual Library</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 bg-white px-5 py-3 rounded-2xl border border-slate-200 w-full md:w-auto shadow-sm">
                      <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Show Items:</span>
                      <div className="relative flex-1 md:w-24">
                        <select 
                          value={bookLimit} 
                          onChange={(e) => setBookLimit(Number(e.target.value))}
                          className="w-full bg-transparent text-sm font-black text-slate-800 outline-none appearance-none cursor-pointer pr-4"
                        >
                          <option value={10}>10</option>
                          <option value={20}>20</option>
                          <option value={50}>50</option>
                          <option value={100}>100</option>
                        </select>
                        <ChevronDown size={14} className="absolute right-0 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                      </div>
                    </div>
                  </div>

                  <div className="mb-10 text-center md:text-left">
                    <h2 className="text-2xl lg:text-5xl font-black text-indigo-950 tracking-tighter leading-tight">
                      Discover Your <span className="text-orange-500 italic underline decoration-indigo-200">Divine Path.</span>
                    </h2>
                  </div>

                  {loading ? (
                    <div className="grid grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-10">
                      {[1,2,3,4,5,6].map(n => <div key={n} className="aspect-[3/4] bg-white animate-pulse rounded-[3rem] border border-slate-100" />)}
                    </div>
                  ) : displayedBooks.length > 0 ? (
                    <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-8 lg:gap-10">
                      <AnimatePresence mode='popLayout'>
                        {displayedBooks.map((book) => (
                          <motion.div 
                            key={book._id} layout
                            initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
                            whileHover={{ y: -8 }}
                            className="group relative bg-white rounded-[2.5rem] p-3 sm:p-5 flex flex-col h-full border border-slate-100 shadow-xl hover:shadow-indigo-950/10 transition-all duration-500 overflow-hidden"
                          >
                            {/* IMAGE CONTAINER - UPGRADED SIZE */}
                            <div className="relative w-full aspect-[4/5] rounded-[1.8rem] overflow-hidden mb-4 bg-indigo-50 shadow-inner">
                              <img src={`${API_BASE_URL.replace('/api', '')}${book.image}`} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" alt={book.title} />
                              
                              {/* WISHLIST BUTTON */}
                              <div className="absolute top-4 right-4">
                                 <button onClick={() => toggleWishlist(book._id)} className={`p-2.5 rounded-2xl backdrop-blur-md border transition-all ${wishlist.includes(book._id) ? 'bg-orange-500 border-orange-400 text-white shadow-lg' : 'bg-white/80 border-white text-indigo-400 hover:text-orange-500'}`}>
                                    <Heart size={18} fill={wishlist.includes(book._id) ? "currentColor" : "none"}/>
                                 </button>
                              </div>
                            </div>

                            <div className="flex-1 flex flex-col px-1">
                              {/* BOOK INFO */}
                              <h3 className="text-xs sm:text-xl font-black text-indigo-950 leading-tight mb-1 line-clamp-1 uppercase tracking-tight">
                                {book.title}
                              </h3>
                              <p className="text-indigo-400 font-extrabold italic text-[8px] sm:text-xs mb-4 uppercase truncate tracking-wider">
                                by {book.author}
                              </p>

                              {/* STATUS BADGE */}
                              <div className="mb-4">
                                <span className={`px-3 py-1 rounded-full text-[7px] sm:text-[9px] font-black uppercase tracking-widest border ${
                                    book.status === 'Borrowed' ? 'bg-indigo-900 text-white border-indigo-900' : 
                                    book.status === 'Out of Stock' ? 'bg-red-500 text-white border-red-500' :
                                    'bg-green-500 text-white border-green-500'
                                } shadow-md`}>
                                    {book.status || 'Available'}
                                </span>
                              </div>
                              
                              {/* ACTION BUTTON - PROFESSIONAL */}
                              <button 
                                onClick={() => handleRequestClick(book)} 
                                className={`mt-auto w-full py-3.5 sm:py-4.5 rounded-[1.5rem] font-black text-[9px] sm:text-xs uppercase tracking-[0.2em] transition-all flex items-center justify-center gap-2 active:scale-95 ${
                                  book.status === 'Available' 
                                  ? 'bg-indigo-950 text-white hover:bg-orange-600 shadow-xl shadow-indigo-900/10' 
                                  : 'bg-slate-100 text-slate-400 cursor-not-allowed border border-slate-200'
                                }`}
                              >
                                {book.status === 'Available' ? (
                                  <>Request <ArrowUpRight size={14}/></>
                                ) : (
                                  <>{book.status}</>
                                )}
                              </button>
                            </div>
                          </motion.div>
                        ))}
                      </AnimatePresence>
                    </div>
                  ) : (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col items-center justify-center py-24 px-6 bg-white border-2 border-dashed border-indigo-100 rounded-[4rem] text-center shadow-inner">
                      <div className="w-24 h-24 bg-indigo-50 rounded-full flex items-center justify-center mb-8">
                        <Search size={48} className="text-indigo-200" />
                      </div>
                      <h2 className="text-2xl font-black text-indigo-950 uppercase tracking-tighter mb-4">No Luck, Mava!</h2>
                      <button onClick={handleCustomRequest} disabled={isSending} className="px-10 py-5 bg-orange-500 text-white rounded-2xl font-black text-xs uppercase tracking-widest shadow-2xl transition-all flex items-center gap-3">
                          {isSending ? "Processing..." : "Special Request"} <Mail size={18}/>
                      </button>
                    </motion.div>
                  )}
                </>
              )}

              {/* Wishlist Page UI */}
              {activePage === 'wishlist' && (
                <div className="pb-20 px-1">
                  <h2 className="text-3xl sm:text-5xl font-black text-indigo-950 tracking-tighter uppercase mb-12">My <span className="text-orange-500 italic">Wishlist</span></h2>
                  {displayedBooks.length > 0 ? (
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                       {displayedBooks.map((book) => (
                          <motion.div key={book._id} className="bg-white border border-slate-100 rounded-[2.5rem] p-3 shadow-xl">
                             <img src={`${API_BASE_URL.replace('/api', '')}${book.image}`} alt={book.title} className="rounded-[1.8rem] aspect-[3/4] object-cover mb-4 shadow-sm" />
                             <h3 className="font-black text-indigo-950 uppercase text-xs line-clamp-1 mb-4 px-2">{book.title}</h3>
                             <button onClick={() => toggleWishlist(book._id)} className="w-full py-3.5 bg-red-50 text-red-600 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-red-500 hover:text-white transition-all shadow-md active:scale-95">Remove Mava</button>
                          </motion.div>
                       ))}
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center py-40 bg-white border-2 border-dashed border-indigo-50 rounded-[4rem]">
                      <Heart className="text-indigo-100 mb-8 animate-pulse" size={120} />
                      <p className="font-black text-indigo-300 uppercase tracking-[0.3em] text-sm text-center">Your wishlist is lonely, mava!</p>
                    </div>
                  )}
                </div>
              )}

              {activePage === 'about' && <AboutUs />}
              {activePage === 'contact' && <ContactUs />}
            </div>
          </main>

          <footer className="bg-white py-20 px-8 border-t border-slate-100 text-center">
              <div className="flex flex-col items-center gap-4">
                <div className="flex items-center gap-4 text-indigo-950 font-black text-3xl uppercase tracking-tighter">
                  <img src="/UESI.png" alt="Logo" className="w-12 h-12 object-contain bg-slate-50 p-1 rounded-lg" />
                  ICEU TPT <span className="text-orange-500">STALL</span>
                </div>
                <div className="w-24 h-1.5 bg-orange-500 rounded-full my-4"></div>
                <p className="text-[11px] font-black text-indigo-300 uppercase tracking-[0.6em]">© 2026 TIRUPATI SPIRITUAL WORLD</p>
              </div>
          </footer>
        </div>
      </div>

      <AnimatePresence>
        {showModal && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setShowModal(false)} className="absolute inset-0 bg-indigo-950/90 backdrop-blur-xl" />
            <motion.div initial={{ scale: 0.8, opacity: 0, y: 50 }} animate={{ scale: 1, opacity: 1, y: 0 }} exit={{ scale: 0.8, opacity: 0, y: 50 }} className="relative bg-white w-full max-w-md rounded-[4rem] p-12 text-center shadow-2xl border border-white">
              <div className="w-24 h-24 bg-orange-100 text-orange-600 rounded-[2rem] flex items-center justify-center mx-auto mb-8 shadow-inner rotate-12 ring-[12px] ring-orange-50">
                <Send size={40} />
              </div>
              <h2 className="text-4xl font-black text-indigo-950 uppercase tracking-tighter mb-4">Confirm</h2>
              <p className="text-slate-500 text-base mb-10 leading-relaxed px-2 font-bold uppercase tracking-widest">
                Mava, Requesting:<br/>
                <span className="text-indigo-950 font-black block mt-3 text-2xl px-2">"{selectedBook?.title}"</span>
              </p>
              <div className="flex flex-col gap-4">
                <button onClick={confirmRequest} disabled={isSending} className="w-full py-6 bg-indigo-950 text-white rounded-[2.2rem] font-black text-xs sm:text-sm uppercase tracking-widest hover:bg-orange-500 transition-all shadow-2xl shadow-indigo-900/30 hover:shadow-orange-400 active:scale-95">
                  Send WhatsApp Message
                </button>
                <button onClick={() => setShowModal(false)} className="w-full py-4 text-indigo-300 font-black text-xs uppercase tracking-widest hover:text-indigo-950 transition-all">Cancel Request</button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

function SidebarLink({ icon, label, active, onClick, count }) {
  return (
    <button onClick={onClick} className={`w-full flex items-center justify-between px-6 py-6 rounded-[2.2rem] font-black transition-all group relative overflow-hidden ${active ? 'bg-orange-500 text-white shadow-[0_20px_50px_rgba(249,115,22,0.4)] translate-x-3 scale-[1.03]' : 'text-indigo-400 hover:text-white hover:bg-white/5'}`}>
      <div className="flex items-center gap-5 z-10">
        <span className={`${active ? 'scale-125' : 'group-hover:scale-125'} transition-transform duration-500`}>{icon}</span>
        <span className="uppercase text-[12px] tracking-[0.2em] font-black">{label}</span>
      </div>
      {count > 0 && <span className={`text-[10px] px-3.5 py-1 rounded-2xl z-10 font-black border ${active ? 'bg-white text-orange-600 border-white' : 'bg-indigo-900 text-indigo-400 border-indigo-800'}`}>{count}</span>}
      {active && <motion.div layoutId="activePill" className="absolute left-0 w-2.5 h-12 bg-white rounded-r-full shadow-lg shadow-white/50" />}
    </button>
  );
}