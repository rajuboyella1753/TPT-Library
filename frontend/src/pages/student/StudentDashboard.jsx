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

  const confirmRequest = async () => {
    setIsSending(true);
    try {
        const requestData = {
            studentName: user.name,
            studentEmail: user.email,
            bookTitle: selectedBook.title,
        };
        await api.post('/books/request-book', requestData);
        alert(`Request for "${selectedBook.title}" sent! 🙏`);
        setShowModal(false);
    } catch (err) {
        alert("Failed to send request.");
    } finally {
        setIsSending(false);
    }
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
    <div className="min-h-screen bg-[#F8FAFC] text-slate-800 font-sans selection:bg-orange-500 selection:text-white flex overflow-hidden">
      
      {/* Mobile Sidebar Overlay */}
      <AnimatePresence>
        {isSidebarOpen && (
          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={() => setIsSidebarOpen(false)}
            className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-[60] lg:hidden"
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <aside className={`fixed inset-y-0 left-0 z-[70] w-72 bg-white border-r border-slate-200 transform transition-all duration-500 lg:relative lg:translate-x-0 ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="p-6 flex flex-col h-full">
          <div className="flex items-center justify-between mb-10 px-2">
            <div className="flex items-center gap-3">
              <img src="/UESI.png" alt="Logo" className="w-10 h-10 object-contain rounded-xl shadow-sm" />
              <div>
                <h2 className="text-xl font-black text-slate-900 tracking-tighter leading-none">ICEU TPT</h2>
                <p className="text-[9px] font-bold text-orange-500 uppercase tracking-widest mt-1">Spiritual Library</p>
              </div>
            </div>
            <button onClick={() => setIsSidebarOpen(false)} className="lg:hidden p-2 text-slate-400">
              <X size={20} />
            </button>
          </div>

          <nav className="flex-1 space-y-1">
            <SidebarLink icon={<Home size={20}/>} label="Library Home" active={activePage === 'home'} onClick={() => {setActivePage('home'); setIsSidebarOpen(false)}} />
            <SidebarLink icon={<Heart size={20}/>} label="My Wishlist" active={activePage === 'wishlist'} count={wishlist.length} onClick={() => {setActivePage('wishlist'); setIsSidebarOpen(false)}} />
            <SidebarLink icon={<Info size={20}/>} label="About Us" active={activePage === 'about'} onClick={() => {setActivePage('about'); setIsSidebarOpen(false)}} />
            <SidebarLink icon={<Phone size={20}/>} label="Contact Us" active={activePage === 'contact'} onClick={() => {setActivePage('contact'); setIsSidebarOpen(false)}} />
          </nav>

          <button onClick={() => {localStorage.clear(); navigate('/login');}} className="flex items-center gap-4 px-6 py-4 text-slate-400 hover:text-red-500 font-bold mt-auto rounded-2xl hover:bg-red-50 transition-all">
            <LogOut size={20} /> Sign Out
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col h-screen overflow-y-auto overflow-x-hidden">
        
        {/* Navbar */}
        <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-xl border-b border-slate-200 px-4 lg:px-10 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
             <button onClick={() => setIsSidebarOpen(true)} className="lg:hidden p-2 bg-slate-100 text-slate-600 rounded-xl hover:bg-orange-500 hover:text-white transition-all">
                <Menu size={20} />
             </button>
          </div>
          
          <div className="relative w-full max-w-xs md:max-w-md mx-4">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={14} />
            <input 
              type="text" placeholder="Search wisdom..." value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-slate-100/50 border border-slate-200 rounded-xl focus:border-orange-500 focus:bg-white outline-none transition-all text-xs font-medium"
            />
          </div>

          <div className="flex items-center gap-3">
            <div className="hidden md:flex flex-col items-end leading-none">
              <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Seeker</span>
              <span className="text-xs font-bold text-slate-900 mt-0.5">{user.name}</span>
            </div>
            <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center text-orange-600 font-black text-xs border border-orange-200">
              {user.name.charAt(0)}
            </div>
          </div>
        </nav>

        <main className="p-4 sm:p-6 lg:p-10">
  <div className="max-w-7xl mx-auto">
    
    {/* --- 1. LIBRARY HOME PAGE --- */}
    {activePage === 'home' && (
      <>
        {/* NEW HEADER SECTION WITH LOGO & DROPDOWN FILTER */}
        <div className="mb-12 flex flex-col md:flex-row items-center justify-between gap-8 bg-white/40 backdrop-blur-md p-6 rounded-[2.5rem] border border-white/50 shadow-sm">
          {/* Logo + Name Section */}
          <div className="flex items-center gap-4">
            <div className="p-2 bg-white rounded-2xl shadow-sm border border-slate-100">
              <img src="/UESI.png" alt="Logo" className="w-12 h-12 sm:w-16 sm:h-16 object-contain" />
            </div>
            <div>
              <h1 className="text-2xl sm:text-4xl font-black text-slate-900 tracking-tighter uppercase leading-none">
                TPT <span className="text-orange-500">ICEU</span>
              </h1>
              <p className="text-[10px] sm:text-xs font-bold text-slate-400 uppercase tracking-[0.4em] mt-1">Book Stall</p>
            </div>
          </div>

          {/* New Dropdown Filter Section */}
          <div className="flex items-center gap-3 bg-slate-100/50 px-5 py-3 rounded-2xl border border-slate-200 w-full md:w-auto">
            <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest whitespace-nowrap">Show Limit:</span>
            <div className="relative flex-1 md:w-32">
              <select 
                value={bookLimit} 
                onChange={(e) => setBookLimit(Number(e.target.value))}
                className="w-full bg-transparent text-sm font-black text-slate-800 outline-none appearance-none cursor-pointer pr-6"
              >
                <option value={10}>10 Books</option>
                <option value={20}>20 Books</option>
                <option value={50}>50 Books</option>
                <option value={100}>100 Books</option>
                <option value={200}>200 Books</option>
                <option value={500}>All Items</option>
              </select>
              <ChevronDown size={14} className="absolute right-0 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
            </div>
          </div>
        </div>

        {/* Hero Title Area */}
        <div className="mb-10 text-center md:text-left">
          <h2 className="text-3xl lg:text-5xl font-black text-slate-900 tracking-tighter leading-tight">
            Discover Your <span className="text-orange-500 italic">Divine Path.</span>
          </h2>
          <p className="text-slate-500 mt-2 font-medium text-sm lg:text-base">Explore our curated collection of Spiritual Wisdom.</p>
        </div>

        {/* Books Grid Logic - Keep your existing loading and displayedBooks logic here */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
            {[1,2,3].map(n => <div key={n} className="h-96 bg-white animate-pulse rounded-[2rem] border border-slate-100" />)}
          </div>
        ) : displayedBooks.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6 sm:gap-8 pb-20">
            <AnimatePresence mode='popLayout'>
              {displayedBooks.map((book) => (
                <motion.div 
                  key={book._id} layout
                  initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  whileHover={{ y: -6 }}
                  className="group bg-white/70 backdrop-blur-lg border border-white rounded-[2rem] p-3 sm:p-4 flex flex-col h-full hover:shadow-2xl hover:shadow-orange-100 transition-all duration-500 shadow-xl"
                >
                  <div className="relative w-full aspect-[3/4] rounded-[1.5rem] overflow-hidden mb-5 bg-slate-50 border border-slate-100 shadow-inner">
      
                    <img src={`${API_BASE_URL.replace('/api', '')}${book.image}`} className="w-full h-full object-cover" alt={book.title} />
                  </div>

                  <div className="flex-1 flex flex-col px-1 sm:px-2">
                    <div className="flex justify-between items-start mb-2">
                      <span className="text-[8px] font-black text-orange-500 uppercase tracking-widest bg-orange-50 px-2.5 py-1 rounded-full border border-orange-100">Spiritual</span>
                      <div className={`px-2.5 py-1 rounded-full text-[8px] font-black uppercase tracking-widest flex items-center gap-1.5 border ${
                          book.status === 'Borrowed' ? 'bg-blue-50 text-blue-600 border-blue-100' : 
                          book.status === 'Out of Stock' ? 'bg-red-50 text-red-600 border-red-100' :
                          'bg-green-50 text-green-600 border-green-100'
                      }`}>
                          {book.status === 'Borrowed' ? <HelpCircle size={8}/> : book.status === 'Out of Stock' ? <XCircle size={8}/> : <CheckCircle2 size={8}/>}
                          {book.status || 'Available'}
                      </div>
                    </div>
                    <h3 className="text-lg sm:text-xl font-black text-slate-900 leading-tight mb-1 uppercase tracking-tight line-clamp-1">{book.title}</h3>
                    <p className="text-slate-400 font-bold italic text-[10px] mb-3">by {book.author}</p>
                    {book.description && <p className="text-slate-500 text-[10px] leading-relaxed line-clamp-2 mb-4 font-medium opacity-80">{book.description}</p>}
                    <div className="mt-auto flex items-center gap-2 pt-2">
                      <button onClick={() => handleRequestClick(book)} className={`flex-1 py-3.5 sm:py-4 rounded-xl sm:rounded-2xl font-black text-[9px] uppercase tracking-widest transition-all flex items-center justify-center gap-2 ${book.status === 'Available' ? 'bg-slate-900 text-white hover:bg-orange-500 shadow-lg' : 'bg-slate-100 text-slate-400 cursor-not-allowed'}`}>
                        {book.status === 'Available' ? 'Request' : book.status} <ArrowUpRight size={12} />
                      </button>
                      <button onClick={() => toggleWishlist(book._id)} className={`px-4 sm:px-5 py-3.5 sm:py-4 rounded-xl sm:rounded-2xl border-2 transition-all flex items-center justify-center font-black ${wishlist.includes(book._id) ? 'bg-orange-50 border-orange-500 text-orange-600' : 'bg-white border-slate-200 text-slate-400 hover:text-orange-500'}`}>
                        {wishlist.includes(book._id) ? <CheckCircle2 size={16} /> : <Plus size={16} />}
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        ) : (
          /* NO BOOKS FOUND - Keep your existing no books logic */
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col items-center justify-center py-20 px-6 bg-white/70 backdrop-blur-md border-2 border-dashed border-slate-300 rounded-[2.5rem] text-center shadow-xl">
            <Search size={32} className="text-orange-500 mb-4" />
            <h3 className="text-xl sm:text-2xl font-black text-slate-900 uppercase tracking-tighter mb-4">Sorry, "{searchTerm}" is not found</h3>
            <button onClick={handleCustomRequest} disabled={isSending} className="px-6 sm:px-8 py-3.5 sm:py-4 bg-orange-500 text-white rounded-xl sm:rounded-2xl font-black text-[9px] uppercase tracking-widest shadow-lg flex items-center gap-2">
                {isSending ? "Sending..." : "Request This Book"} <Mail size={14}/>
            </button>
          </motion.div>
        )}
      </>
    )}

    {/* Keep Wishlist, About, Contact logic exactly same as before below this */}

            {/* --- 2. MY WISHLIST PAGE --- */}
            {activePage === 'wishlist' && (
              <div className="pb-20 px-1">
                <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tighter uppercase mb-10">My <span className="text-orange-500 italic">Wishlist</span></h2>
                {displayedBooks.length > 0 ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6 sm:gap-8">
                     {displayedBooks.map((book) => (
                        <motion.div key={book._id} className="bg-white/70 backdrop-blur-lg border border-white rounded-[2rem] p-4 shadow-xl">
                           <div className="relative w-full aspect-[3/4] rounded-[1.5rem] overflow-hidden mb-4">
                              <img 
                                src={`${API_BASE_URL.replace('/api', '')}${book.image}`} 
                                alt={book.title} 
                                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" 
                              />
                           </div>
                           <h3 className="font-black text-slate-900 uppercase text-base sm:text-lg line-clamp-1 mb-4">{book.title}</h3>
                           <button onClick={() => toggleWishlist(book._id)} className="w-full py-3.5 sm:py-4 bg-red-50 text-red-600 rounded-xl sm:rounded-2xl font-black text-[9px] uppercase tracking-widest hover:bg-red-500 hover:text-white transition-all">Remove</button>
                        </motion.div>
                     ))}
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center py-32 bg-slate-50 border-2 border-dashed border-slate-200 rounded-[2.5rem]">
                    <Heart className="text-slate-300 mb-4" size={40} />
                    <p className="font-black text-slate-400 uppercase tracking-widest text-[10px]">Your wishlist is empty</p>
                  </div>
                )}
              </div>
            )}

            {/* --- 3. ABOUT US PAGE --- */}
            {activePage === 'about' && <AboutUs />}
            
            {/* --- 4. CONTACT US PAGE --- */}
            {activePage === 'contact' && <ContactUs />}
            
          </div>
        </main>

        <footer className="bg-white py-10 px-8 border-t border-slate-200 mt-auto text-center">
            <div className="flex items-center justify-center gap-2 text-slate-900 font-black text-lg sm:text-xl uppercase tracking-tighter mb-4">
              <img src="/UESI.png" alt="Logo" className="w-6 h-6 sm:w-8 sm:h-8 object-contain" />
              ICEU TPT <span className="text-orange-500">STALL</span>
            </div>
            <p className="text-[8px] sm:text-[10px] font-black text-slate-400 uppercase tracking-[0.3em]">© 2026 ICEU TPT SPIRITUAL WORLD | Tirupati</p>
        </footer>
      </div>

      {/* Confirmation Modal */}
      <AnimatePresence>
        {showModal && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setShowModal(false)} className="absolute inset-0 bg-slate-900/60 backdrop-blur-md" />
            <motion.div initial={{ scale: 0.9, opacity: 0, y: 20 }} animate={{ scale: 1, opacity: 1, y: 0 }} exit={{ scale: 0.9, opacity: 0, y: 20 }} className="relative bg-white w-full max-w-xs sm:max-w-md rounded-[2rem] sm:rounded-[2.5rem] p-6 sm:p-8 shadow-2xl text-center">
              <div className="w-12 h-12 sm:w-16 sm:h-16 bg-orange-100 text-orange-500 rounded-full flex items-center justify-center mx-auto mb-6"><Send size={24} /></div>
              <h2 className="text-xl sm:text-2xl font-black text-slate-900 uppercase tracking-tighter mb-2">Confirm</h2>
              <p className="text-slate-500 text-[10px] sm:text-sm mb-6">Borrow <b>{selectedBook?.title}</b>?</p>
              <div className="flex gap-3">
                <button onClick={() => setShowModal(false)} className="flex-1 py-3.5 sm:py-4 bg-slate-100 text-slate-600 rounded-xl sm:rounded-2xl font-black text-[9px] uppercase tracking-widest">Cancel</button>
                <button onClick={confirmRequest} disabled={isSending} className="flex-1 py-3.5 sm:py-4 bg-slate-900 text-white rounded-xl sm:rounded-2xl font-black text-[9px] uppercase tracking-widest hover:bg-orange-500 transition-all">
                  {isSending ? "..." : "Confirm"}
                </button>
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
    <button onClick={onClick} className={`w-full flex items-center justify-between px-6 py-4 rounded-xl sm:rounded-2xl font-black transition-all group ${active ? 'bg-orange-500 text-white shadow-lg shadow-orange-200 translate-x-1' : 'text-slate-400 hover:text-slate-900 hover:bg-slate-50'}`}>
      <div className="flex items-center gap-4">{icon} <span className="uppercase text-[10px] tracking-widest">{label}</span></div>
      {count > 0 && <span className={`text-[9px] px-2 py-0.5 rounded-full ${active ? 'bg-white text-orange-500' : 'bg-slate-100 text-slate-600'}`}>{count}</span>}
    </button>
  );
}