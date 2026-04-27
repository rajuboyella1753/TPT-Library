import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  PlusCircle, BookOpen, LayoutDashboard, Package, 
  LogOut, Trash2, Menu, X, Search, Upload, RefreshCcw, Mail, Book as BookIcon, CheckCircle, AlertTriangle, XCircle, User, Clock, Layers
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import api from '../../api/api';

export default function AdminDashboard() {
  const navigate = useNavigate();
  const [books, setBooks] = useState([]);
  const [activeTab, setActiveTab] = useState('add');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [adminSearch, setAdminSearch] = useState('');
  
  // --- NEW STATE FOR REQUESTS ---
  const [bookRequests, setBookRequests] = useState([]);

  const [newBook, setNewBook] = useState({
    title: '', author: '', status: 'Available', category: 'Sprituality', image: null, description: '', totalCopies: 1
  });

  const user = JSON.parse(localStorage.getItem('user')) || { name: 'Admin' };
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

  // --- MODIFIED USEEFFECT TO FETCH BOTH ---
  useEffect(() => { 
    fetchBooks(); 
    fetchRequests();
  }, []);

  const fetchBooks = async () => {
    setLoading(true);
    try {
      const res = await api.get('/books');
      setBooks(res.data);
    } catch (err) { console.error("Error fetching books"); }
    finally { setLoading(false); }
  };

  // --- NEW FETCH REQUESTS FUNCTION ---
  const fetchRequests = async () => {
    try {
      const res = await api.get('/books/requests'); // Backend lo ee endpoint undali
      setBookRequests(res.data);
    } catch (err) {
      console.error("Error fetching requests:", err);
    }
  };

  const handleInputChange = (e) => {
    setNewBook({ ...newBook, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    setNewBook({ ...newBook, image: e.target.files[0] });
  };

  const handleAddBook = async (e) => {
    e.preventDefault();
    if (!newBook.image) return alert("Please select a book cover image!");
    setLoading(true);

const formData = new FormData();
formData.append('title', newBook.title);
formData.append('author', newBook.author);
formData.append('status', newBook.status);
formData.append('category', newBook.category);
formData.append('description', newBook.description);
formData.append('image', newBook.image);

// Ikkada parseInt(newBook.totalCopies) ani kachitanga pampali mama
formData.append('totalCopies', parseInt(newBook.totalCopies) || 1);

    try {
      await api.post('/books', formData, { headers: { 'Content-Type': 'multipart/form-data' } });
      alert("Book Published Successfully! 📚");
      setNewBook({ title: '', author: '', status: 'Available', category: 'Sprituality', image: null, description: '', totalCopies: 1 });
      fetchBooks();
      setActiveTab('uploaded');
    } catch (err) {
      alert("Failed to add book");
    } finally { setLoading(false); }
  };

  const deleteBook = async (id) => {
    if (!window.confirm("Are you sure? This book will be removed forever! 🚨")) return;
    
    try {
      await api.delete(`/books/${id}`);
      alert("Book Deleted Successfully!");
      fetchBooks();
    } catch (err) {
      alert("Failed to delete book");
    }
  };

  const updateBookStatus = async (id, newStatus) => {
    try {
      await api.put(`/books/${id}`, { status: newStatus });
      fetchBooks();
    } catch (err) { alert("Status update failed"); }
  };

  const filteredBooks = books.filter(b => 
    b.title.toLowerCase().includes(adminSearch.toLowerCase()) || 
    b.author.toLowerCase().includes(adminSearch.toLowerCase())
  );

  const handleApprove = async (requestId) => {
    try {
        await api.put(`/books/requests/${requestId}/approve`);
        alert("Success! Student will see the collection message. ✅");
        fetchRequests(); // List update cheyadaniki
    } catch (err) {
        alert("Approval failed!");
    }
  };

  const handleHandover = async (id, days) => {
    try {
        await api.put(`/books/requests/${id}/handover`, { days });
        alert("Handover Success! 📅");
        fetchRequests();
    } catch (err) { alert("Handover failed"); }
  };

  const handleReturn = async (id) => {
    if(window.confirm("Is the book returned back?")) {
        try {
            await api.delete(`/books/requests/${id}/return`);
            alert("Request Cleared! Book is now Available. ✅");
            fetchRequests();
            fetchBooks(); 
        } catch (err) { alert("Return failed"); }
    }
  };

  // --- NEW: APPROVE RENEWAL ---
  const handleApproveRenewal = async (requestId) => {
    try {
        await api.put(`/books/requests/${requestId}/approve-renewal`);
        alert("Renewal Approved! Student got extra time. 📚");
        fetchRequests();
    } catch (err) { alert("Renewal failed!"); }
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] flex font-sans text-slate-900 relative overflow-hidden">
      
      {/* Visual Enhancements */}
      <div className="fixed top-[-10%] right-[-10%] w-[300px] md:w-[500px] h-[300px] md:h-[500px] bg-orange-200/30 blur-[120px] rounded-full pointer-events-none" />
      <div className="fixed bottom-[-10%] left-[-10%] w-[250px] md:w-[400px] h-[250px] md:h-[400px] bg-indigo-100/40 blur-[100px] rounded-full pointer-events-none" />

      {/* --- SIDEBAR --- */}
      <aside className={`fixed inset-y-0 left-0 z-50 w-72 bg-slate-950 text-white transform transition-all duration-500 ease-in-out lg:relative lg:translate-x-0 ${isSidebarOpen ? 'translate-x-0 shadow-2xl' : '-translate-x-full'}`}>
        <div className="p-8 flex flex-col h-full">
          <div className="flex items-center gap-3 mb-12">
            <div className="bg-orange-500 p-2.5 rounded-2xl shadow-lg shadow-orange-500/30 ring-4 ring-orange-500/10">
              <BookOpen size={24} className="text-white" />
            </div>
            <span className="text-xl font-black tracking-tight uppercase italic">TPT ICEU <span className="text-orange-500">ADMIN</span></span>
          </div>

          <nav className="flex-1 space-y-2">
            <SidebarButton icon={<PlusCircle size={20}/>} label="Add New Book" active={activeTab === 'add'} onClick={() => {setActiveTab('add'); setIsSidebarOpen(false);}} />
            <SidebarButton icon={<Package size={20}/>} label="Uploaded Items" active={activeTab === 'uploaded'} onClick={() => {setActiveTab('uploaded'); setIsSidebarOpen(false);}} />
            <SidebarButton icon={<Mail size={20}/>} label="Book Requests" active={activeTab === 'requests'} onClick={() => {setActiveTab('requests'); setIsSidebarOpen(false);}} />
          </nav>

          <button onClick={() => {localStorage.clear(); navigate('/login');}} className="mt-auto flex items-center gap-3 p-4 text-red-400 hover:bg-red-500/10 rounded-2xl font-bold transition-all group">
            <LogOut size={20} className="group-hover:-translate-x-1 transition-transform" /> Logout
          </button>
        </div>
      </aside>

      {/* --- MAIN CONTENT --- */}
      <div className="flex-1 flex flex-col min-w-0 h-screen overflow-hidden z-10">
        
        <header className="h-20 bg-white/80 backdrop-blur-md border-b border-slate-100 flex items-center justify-between px-4 md:px-10 sticky top-0 z-40 shadow-sm">
  <div className="flex items-center gap-3">
    <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="lg:hidden p-2 text-slate-600 bg-white rounded-xl shadow-sm border border-slate-100 active:scale-90 transition-all">
      {isSidebarOpen ? <X size={20}/> : <Menu size={20}/>}
    </button>
    <h2 className="font-black text-slate-800 uppercase tracking-widest text-[10px] md:text-sm lg:text-base hidden sm:block">
       {activeTab.replace('-',' ')}
    </h2>
  </div>

  <div className="flex items-center gap-3">
    <div className="text-right hidden sm:block leading-tight">
      <p className="text-xs font-black text-slate-800">{user.name}</p>
      <p className="text-[9px] font-bold text-orange-500 uppercase tracking-widest">Master Admin</p>
    </div>
    <div className="w-10 h-10 bg-slate-900 rounded-xl flex items-center justify-center text-white font-black shadow-lg ring-2 ring-white">
      {user.name.charAt(0)}
    </div>
  </div>
</header>

        <main className="flex-1 overflow-y-auto p-4 lg:p-8 space-y-6 bg-slate-50/50">
          
          <AnimatePresence mode="wait">
            {activeTab === 'add' && (
              <motion.div initial={{opacity:0, scale:0.95}} animate={{opacity:1, scale:1}} exit={{opacity:0}} className="max-w-3xl mx-auto">
                <div className="bg-white rounded-[3rem] p-8 lg:p-12 shadow-2xl shadow-indigo-100 border border-white relative overflow-hidden">
                  <div className="absolute top-0 right-0 p-8 opacity-5"><PlusCircle size={120} /></div>
                  
                  <div className="mb-10 text-center lg:text-left">
                    <h2 className="text-3xl font-black text-slate-900 tracking-tighter uppercase mb-2">Publish a Book</h2>
                    <p className="text-slate-500 font-medium">Add divine knowledge to the TPT ICEU collection.</p>
                  </div>

                  <form onSubmit={handleAddBook} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest ml-2">Book Title</label>
                        <input type="text" name="title" value={newBook.title} onChange={handleInputChange} placeholder="Enter book name..." className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl focus:border-orange-500 focus:bg-white outline-none font-bold transition-all" required />
                      </div>
                      <div className="space-y-2">
                        <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest ml-2">Author Name</label>
                        <input type="text" name="author" value={newBook.author} onChange={handleInputChange} placeholder="Who wrote this?" className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl focus:border-orange-500 focus:bg-white outline-none font-bold transition-all" required />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest ml-2">Initial Status</label>
                        <select name="status" value={newBook.status} onChange={handleInputChange} className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl focus:border-orange-500 focus:bg-white outline-none font-bold cursor-pointer transition-all">
                          <option value="Available">Available Now</option>
                          <option value="Out of Stock">Out of Stock</option>
                        </select>
                      </div>
                      <div className="space-y-2">
                        <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest ml-2">Total Copies</label>
                        <input type="number" name="totalCopies" value={newBook.totalCopies} onChange={handleInputChange} min="1" className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl focus:border-orange-500 outline-none font-bold" required />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest ml-2">Description (Optional)</label>
                      <input type="text" name="description" value={newBook.description} onChange={handleInputChange} placeholder="Short summary..." className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl focus:border-orange-500 outline-none font-bold" />
                    </div>

                    <div className="space-y-2">
                      <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest ml-2">Book Cover Image</label>
                      <label className="w-full flex flex-col items-center justify-center p-10 bg-slate-50 border-2 border-dashed border-slate-200 rounded-[2rem] cursor-pointer hover:bg-orange-50 hover:border-orange-500 transition-all group shadow-inner">
                        <Upload className="text-slate-400 mb-3 group-hover:text-orange-500 group-hover:scale-110 transition-all" size={32} />
                        <span className="text-sm font-black text-slate-500 group-hover:text-orange-600 uppercase tracking-widest">{newBook.image ? newBook.image.name : "Click to select JPG/PNG"}</span>
                        <input type="file" onChange={handleFileChange} className="hidden" />
                      </label>
                    </div>

                    <button type="submit" disabled={loading} className="w-full py-5 bg-slate-900 text-white font-black rounded-[2rem] shadow-xl hover:bg-orange-500 hover:scale-[1.01] active:scale-95 transition-all uppercase tracking-[0.3em] text-sm mt-4">
                      {loading ? "Processing..." : "Publish to Library"}
                    </button>
                  </form>
                </div>
              </motion.div>
            )}

            {activeTab === 'uploaded' && (
              <motion.div initial={{opacity:0}} animate={{opacity:1}} className="space-y-8 pb-10">
                <div className="flex flex-col md:flex-row justify-between items-center gap-4 bg-white/60 backdrop-blur-md p-6 rounded-[2rem] border border-white shadow-sm">
                    <div className="relative w-full lg:max-w-md">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                        <input 
                          type="text" placeholder="Search your collection..." 
                          value={adminSearch} onChange={(e) => setAdminSearch(e.target.value)}
                          className="w-full pl-12 pr-4 py-3 bg-white border border-slate-200 rounded-2xl outline-none focus:ring-4 focus:ring-orange-500/10 transition-all font-bold text-slate-800"
                        />
                    </div>
                    <button onClick={fetchBooks} className="p-3.5 bg-white border border-slate-100 rounded-2xl shadow-sm hover:text-orange-500 active:scale-90 transition-all"><RefreshCcw size={20}/></button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 md:gap-8">
                  {filteredBooks.map(book => (
                    <motion.div key={book._id} layout className="bg-white/80 backdrop-blur-sm border border-white rounded-[2.5rem] p-5 shadow-xl hover:shadow-2xl hover:bg-white transition-all group">
                      <div className="relative aspect-[3/4] rounded-[2rem] overflow-hidden mb-4 shadow-md bg-slate-100">
                        <img src={`${API_BASE_URL.replace('/api', '')}${book.image}`} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                        <div className={`absolute top-3 left-3 px-3 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest backdrop-blur-md border ${
                          book.status === 'Available' ? 'bg-green-500/20 text-green-700 border-green-200' : 
                          book.status === 'Borrowed' ? 'bg-blue-500/20 text-blue-700 border-blue-200' : 
                          'bg-red-500/20 text-red-700 border-red-200'
                        }`}>
                          {book.status}
                        </div>
                        
                        {/* COPIES FIX: NOW SHOWING DYNAMIC totalCopies */}
                        <div className="absolute bottom-4 right-4 bg-white/95 px-3 py-1.5 rounded-xl text-[10px] font-black text-indigo-950 border border-white shadow-lg flex items-center gap-1.5">
                        <Layers size={14} className="text-orange-500"/> 
                        {/* book copies field name ni exact ga check chey mama */}
                        {book.availableCopies} Copies
                      </div>
                      
                      </div>
                      
                      <div className="space-y-3">
                        <div>
                          <h3 className="font-black text-slate-800 line-clamp-1 uppercase text-sm tracking-tight">{book.title}</h3>
                          <p className="text-xs font-bold text-slate-400 italic">by {book.author}</p>
                        </div>
                        
                        <div className="pt-2 border-t border-slate-100 space-y-2 flex flex-col">
                           <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Change Status</p>
                           <div className="flex gap-2">
                             <select 
                               value={book.status} 
                               onChange={(e) => updateBookStatus(book._id, e.target.value)}
                               className={`flex-1 p-3 rounded-xl text-[10px] font-black uppercase tracking-widest outline-none border transition-all cursor-pointer ${
                                 book.status === 'Available' ? 'bg-green-50 border-green-100 text-green-600' :
                                 book.status === 'Borrowed' ? 'bg-blue-50 border-blue-100 text-blue-600' :
                                 'bg-red-50 border-red-100 text-red-600'
                               }`}
                             >
                               <option value="Available">Available</option>
                               <option value="Borrowed">Borrowed</option>
                               <option value="Out of Stock">Out of Stock</option>
                             </select>
                             <button onClick={() => deleteBook(book._id)} className="p-3 bg-red-50 text-red-500 border border-red-100 rounded-xl shadow-sm hover:bg-red-500 hover:text-white transition-all">
                               <Trash2 size={16} />
                             </button>
                           </div>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
                {filteredBooks.length === 0 && <div className="text-center py-20 text-slate-400 font-bold uppercase tracking-widest italic">No matching books found.</div>}
              </motion.div>
            )}

            {activeTab === 'requests' && (
              <motion.div initial={{opacity:0, y:20}} animate={{opacity:1, y:0}} className="space-y-6">
                <div className="bg-white/80 backdrop-blur-xl rounded-[3rem] p-6 lg:p-10 border border-white shadow-2xl">
                  <div className="flex items-center justify-between mb-10">
                    <div>
                      <h2 className="text-3xl font-black text-slate-900 uppercase tracking-tighter">Student Requests</h2>
                      <p className="text-slate-500 font-bold text-xs uppercase tracking-widest mt-1">Manage borrowing & time extensions</p>
                    </div>
                    <button onClick={fetchRequests} className="p-4 bg-slate-900 text-white rounded-2xl hover:bg-orange-500 transition-all shadow-lg active:scale-90">
                      <RefreshCcw size={20}/>
                    </button>
                  </div>

                  {bookRequests.length > 0 ? (
                    <div className="grid grid-cols-1 gap-4 lg:gap-6">
                      {bookRequests.map((req) => (
                        <div key={req._id} className="bg-white border border-slate-100 rounded-[2.5rem] p-5 flex flex-col md:flex-row items-center gap-6 hover:shadow-xl transition-all group relative overflow-hidden">
                          <div className={`absolute top-0 left-0 w-2 h-full transition-colors duration-500 ${req.status==='HandedOver' ? 'bg-indigo-500' : req.status==='Approved' ? 'bg-green-500' : 'bg-orange-500'}`}/>

                          <div className="w-24 h-32 rounded-2xl overflow-hidden shadow-md shrink-0 bg-slate-200">
                            <img 
                              src={`${API_BASE_URL.replace('/api', '')}${req.bookImage || '/default-book.png'}`} 
                              alt="book" 
                              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                            />
                          </div>

                          <div className="flex-1 text-center md:text-left">
                            <div className="flex flex-wrap justify-center md:justify-start items-center gap-2 mb-2">
                              <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest w-fit ${req.status === 'HandedOver' ? 'bg-indigo-100 text-indigo-600' : req.status === 'Approved' ? 'bg-green-100 text-green-600' : 'bg-orange-100 text-orange-600'}`}>
                                {req.status}
                              </span>
                              {req.isRenewalRequested && (
                                <span className="bg-red-500 text-white px-3 py-1 rounded-full text-[9px] font-black uppercase animate-pulse shadow-md">Extension Requested!</span>
                              )}
                            </div>
                            <h3 className="text-lg font-black text-slate-900 uppercase tracking-tight mb-1">{req.bookTitle}</h3>
                            <div className="flex flex-wrap items-center justify-center md:justify-start gap-2 text-slate-500">
                              <div className="flex items-center gap-1.5"><User size={14} className="text-indigo-500" /><span className="font-bold text-sm">{req.studentName}</span></div>
                              <span className="hidden md:block text-slate-300">|</span>
                              <span className="text-xs font-medium">{req.studentEmail}</span>
                            </div>

                            {/* DUE DATE FIX: CALCULATED PROPERLY */}
                            {req.status === 'HandedOver' && (
                              <div className="mt-3 flex flex-wrap items-center justify-center md:justify-start gap-3 text-[10px] font-black uppercase bg-slate-50 p-2.5 rounded-xl w-fit mx-auto md:mx-0">
                                <span className="flex items-center gap-1.5 text-indigo-600"><Clock size={12}/> Due: {new Date(req.dueDate).toLocaleDateString('en-GB')}</span>
                                <span className="text-red-500 italic">Remaining: {Math.max(0, Math.ceil((new Date(req.dueDate).setHours(0,0,0,0) - new Date().setHours(0,0,0,0)) / (1000 * 60 * 60 * 24)))} Days</span>
                              </div>
                            )}
                          </div>

                          <div className="flex flex-col gap-2 w-full md:w-auto md:min-w-[200px]">
                            {/* APPROVE BUTTON - ONLY IF PENDING */}
                            {req.status === 'Pending' && (
                              <button onClick={() => handleApprove(req._id)} className="flex items-center justify-center gap-2 px-6 py-4 bg-green-500 text-white rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-green-600 shadow-lg shadow-green-100 transition-all active:scale-95">
                                <CheckCircle size={16} /> Approve Request
                              </button>
                            )}

                            {/* HANDOVER DEADLINE BUTTONS - ONLY IF APPROVED */}
                            {req.status === 'Approved' && (
                              <div className="flex flex-col gap-2 bg-slate-50 p-3 rounded-2xl border border-slate-100">
                                <p className="text-[9px] font-black text-slate-400 uppercase text-center mb-1">Assign Handover Term</p>
                                <div className="flex gap-2">
                                  <button onClick={() => handleHandover(req._id, 7)} className="flex-1 px-3 py-2.5 bg-indigo-600 text-white text-[9px] font-black uppercase rounded-xl hover:bg-indigo-700 shadow-md">1 Week</button>
                                  <button onClick={() => handleHandover(req._id, 30)} className="flex-1 px-3 py-2.5 bg-purple-600 text-white text-[9px] font-black uppercase rounded-xl hover:bg-purple-700 shadow-md">1 Month</button>
                                </div>
                              </div>
                            )}

                            {/* RENEWAL APPROVAL BUTTON - ANIMATED */}
                            {req.isRenewalRequested && (
                              <button onClick={() => handleApproveRenewal(req._id)} className="flex items-center justify-center gap-2 px-6 py-4 bg-blue-600 text-white rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-blue-700 shadow-lg animate-bounce transition-all">
                                <RefreshCcw size={16} /> Approve Extension
                              </button>
                            )}

                            {/* RETURN BUTTON - ONLY IF HANDED OVER */}
                            {req.status === 'HandedOver' && (
                              <button onClick={() => handleReturn(req._id)} className="flex items-center justify-center gap-2 px-6 py-4 bg-red-500 text-white rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-red-600 shadow-lg shadow-red-100 transition-all active:scale-95">
                                <CheckCircle size={16} /> Mark Returned
                              </button>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center py-24 text-center">
                      <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mb-6 shadow-inner">
                        <Mail className="text-slate-300" size={40} />
                      </div>
                      <h3 className="text-xl font-black text-slate-300 uppercase tracking-widest">No Pending Requests</h3>
                      <p className="text-slate-400 text-xs font-bold uppercase tracking-widest mt-2">All books are safe in the stall! 📚</p>
                    </div>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>

        </main>

        <footer className="p-6 text-center text-slate-400 text-[10px] font-black tracking-[0.3em] border-t border-slate-200/50 bg-white/50 backdrop-blur-sm uppercase">
          © 2026 TPT ICEU BOOK WORLD | SECURE ADMIN DASHBOARD | VERSION 3.0
        </footer>
      </div>
    </div>
  );
}

function SidebarButton({ icon, label, active, onClick }) {
  return (
    <button onClick={onClick} className={`w-full flex items-center gap-4 px-6 py-4 rounded-2xl font-black transition-all group ${
      active ? 'bg-orange-500 text-white shadow-xl shadow-orange-500/40 translate-x-2' : 'text-slate-400 hover:text-white hover:bg-white/5 active:scale-95'
    }`}>
      <span className={`${active ? 'scale-110' : 'group-hover:scale-110'} transition-transform`}>{icon}</span>
      <span className="uppercase text-[11px] tracking-widest">{label}</span>
    </button>
  );
}