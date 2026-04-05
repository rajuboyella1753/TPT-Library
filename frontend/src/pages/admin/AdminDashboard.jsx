import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  PlusCircle, BookOpen, LayoutDashboard, Package, 
  LogOut, Trash2, Menu, X, Search, Upload, RefreshCcw, Mail, Book as BookIcon, CheckCircle, AlertTriangle, XCircle
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
  
  const [newBook, setNewBook] = useState({
    title: '', author: '', status: 'Available', category: 'Sprituality', image: null, description: ''
  });

  const user = JSON.parse(localStorage.getItem('user')) || { name: 'Admin' };

  useEffect(() => { fetchBooks(); }, []);

  const fetchBooks = async () => {
    setLoading(true);
    try {
      const res = await api.get('/books');
      setBooks(res.data);
    } catch (err) { console.error("Error fetching books"); }
    finally { setLoading(false); }
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

    try {
      await api.post('/books', formData, { headers: { 'Content-Type': 'multipart/form-data' } });
      alert("Book Published Successfully! 📚");
      setNewBook({ title: '', author: '', status: 'Available', category: 'Sprituality', image: null, description: '' });
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
    fetchBooks(); // లిస్ట్ ని రిఫ్రెష్ చేయడానికి
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

  return (
    <div className="min-h-screen bg-[#f0f2f5] flex font-sans text-slate-900 relative overflow-hidden">
      
      {/* Background Orbs for Glassmorphism Effect */}
      <div className="fixed top-[-10%] right-[-10%] w-[500px] h-[500px] bg-orange-200/40 blur-[120px] rounded-full pointer-events-none" />
      <div className="fixed bottom-[-10%] left-[-10%] w-[400px] h-[400px] bg-blue-100/40 blur-[100px] rounded-full pointer-events-none" />

      {/* --- SIDEBAR --- */}
      <aside className={`fixed inset-y-0 left-0 z-50 w-72 bg-slate-900 text-white transform transition-all duration-300 md:relative md:translate-x-0 ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full shadow-2xl'}`}>
        <div className="p-8 flex flex-col h-full">
          <div className="flex items-center gap-3 mb-12">
            <div className="bg-orange-500 p-2.5 rounded-2xl shadow-lg shadow-orange-500/30">
              <BookOpen size={24} className="text-white" />
            </div>
            <span className="text-xl font-black tracking-tight uppercase italic">TPT ICEU <span className="text-orange-500">ADMIN</span></span>
          </div>

          <nav className="flex-1 space-y-2">
            <SidebarButton icon={<PlusCircle size={20}/>} label="Add New Book" active={activeTab === 'add'} onClick={() => {setActiveTab('add'); setIsSidebarOpen(false);}} />
            <SidebarButton icon={<Package size={20}/>} label="Uploaded Items" active={activeTab === 'uploaded'} onClick={() => {setActiveTab('uploaded'); setIsSidebarOpen(false);}} />
            {/* <SidebarButton icon={<Mail size={20}/>} label="Book Requests" active={activeTab === 'requests'} onClick={() => {setActiveTab('requests'); setIsSidebarOpen(false);}} /> */}
          </nav>

          <button onClick={() => {localStorage.clear(); navigate('/login');}} className="mt-auto flex items-center gap-3 p-4 text-red-400 hover:bg-red-500/10 rounded-2xl font-bold transition-all group">
            <LogOut size={20} className="group-hover:-translate-x-1 transition-transform" /> Logout
          </button>
        </div>
      </aside>

      {/* --- MAIN CONTENT --- */}
      <div className="flex-1 flex flex-col min-w-0 h-screen overflow-hidden z-10">
        
        <header className="h-20 bg-white/70 backdrop-blur-md border-b border-white/20 flex items-center justify-between px-6 lg:px-10 sticky top-0 z-40">
          <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="md:hidden p-2 text-slate-600 bg-white rounded-lg shadow-sm">
            {isSidebarOpen ? <X size={24}/> : <Menu size={24}/>}
          </button>
          
          <div className="flex-1 px-4 lg:px-0">
             <h2 className="font-black text-slate-800 uppercase tracking-widest text-sm lg:text-base">
                {activeTab === 'add' ? 'Publishing Portal' : activeTab === 'uploaded' ? 'Inventory Manager' : 'Student Requests'}
             </h2>
          </div>

          <div className="flex items-center gap-4">
            <div className="text-right hidden sm:block">
              <p className="text-sm font-black text-slate-800">{user.name}</p>
              <p className="text-[10px] font-bold text-orange-500 uppercase tracking-[0.2em]">Store Master</p>
            </div>
            <div className="w-11 h-11 bg-gradient-to-tr from-orange-500 to-orange-600 rounded-2xl flex items-center justify-center text-white font-black shadow-lg border-2 border-white rotate-3">
              {user.name.charAt(0)}
            </div>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto p-4 lg:p-8 space-y-6">
          
          <AnimatePresence mode="wait">
            {activeTab === 'add' && (
              <motion.div initial={{opacity:0, scale:0.95}} animate={{opacity:1, scale:1}} exit={{opacity:0}} className="max-w-3xl mx-auto">
                <div className="bg-white/80 backdrop-blur-xl rounded-[3rem] p-8 lg:p-12 shadow-2xl border border-white relative overflow-hidden">
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
                          <option value="Out of Stock">Coming Soon / Out of Stock</option>
                        </select>
                      </div>
                      <div className="space-y-2">
                        <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest ml-2">Description (Optional)</label>
                        <input type="text" name="description" value={newBook.description} onChange={handleInputChange} placeholder="Short summary of the book..." className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl focus:border-orange-500 outline-none font-bold" />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest ml-2">Book Cover Image</label>
                      <label className="w-full flex flex-col items-center justify-center p-10 bg-slate-50 border-2 border-dashed border-slate-200 rounded-[2rem] cursor-pointer hover:bg-orange-50 hover:border-orange-500 transition-all group">
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
                <div className="flex flex-col lg:flex-row justify-between items-center gap-4 bg-white/60 backdrop-blur-md p-6 rounded-[2rem] border border-white">
                    <div className="relative w-full lg:max-w-md">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                        <input 
                          type="text" placeholder="Search your collection..." 
                          value={adminSearch} onChange={(e) => setAdminSearch(e.target.value)}
                          className="w-full pl-12 pr-4 py-3 bg-white border border-slate-100 rounded-xl outline-none focus:ring-4 focus:ring-orange-500/10 transition-all font-medium"
                        />
                    </div>
                    <button onClick={fetchBooks} className="p-3 bg-white rounded-xl shadow-sm hover:text-orange-500 transition-colors"><RefreshCcw size={20}/></button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {filteredBooks.map(book => (
                    <motion.div key={book._id} layout className="bg-white/80 backdrop-blur-sm border border-white rounded-[2.5rem] p-5 shadow-xl hover:shadow-2xl transition-all group">
                      <div className="relative aspect-[3/4] rounded-[2rem] overflow-hidden mb-4 shadow-md bg-slate-100">
                        <img src={`${import.meta.env.VITE_API_BASE_URL.replace('/api', '')}${book.image}`} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                        <div className={`absolute top-3 left-3 px-3 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest backdrop-blur-md border ${
                          book.status === 'Available' ? 'bg-green-500/20 text-green-700 border-green-200' : 
                          book.status === 'Borrowed' ? 'bg-blue-500/20 text-blue-700 border-blue-200' : 
                          'bg-red-500/20 text-red-700 border-red-200'
                        }`}>
                          {book.status}
                        </div>
                      </div>
                      
                      <div className="space-y-3">
                        <div>
                          <h3 className="font-black text-slate-800 line-clamp-1 uppercase text-sm tracking-tight">{book.title}</h3>
                          <p className="text-xs font-bold text-slate-400 italic">by {book.author}</p>
                        </div>
                        
                        <div className="pt-2 border-t border-slate-100 space-y-2">
                           <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Change Status</p>
                           <select 
                             value={book.status} 
                             onChange={(e) => updateBookStatus(book._id, e.target.value)}
                             className={`w-full p-3 rounded-xl text-[10px] font-black uppercase tracking-widest outline-none border transition-all cursor-pointer ${
                               book.status === 'Available' ? 'bg-green-50 border-green-100 text-green-600' :
                               book.status === 'Borrowed' ? 'bg-blue-50 border-blue-100 text-blue-600' :
                               'bg-red-50 border-red-100 text-red-600'
                             }`}
                           >
                             <option value="Available">Available</option>
                             <option value="Borrowed">Borrowed</option>
                             <option value="Out of Stock">Out of Stock</option>
                           </select>
                           <button 
          onClick={() => deleteBook(book._id)}
          className="p-3 bg-red-50 text-red-500 rounded-xl border border-red-100 hover:bg-red-500 hover:text-white transition-all shadow-sm"
          title="Delete Book"
        >
          <Trash2 size={16} />
        </button>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
                {filteredBooks.length === 0 && <div className="text-center py-20 text-slate-400 font-bold uppercase tracking-widest italic">No matching books found.</div>}
              </motion.div>
            )}

            {activeTab === 'requests' && (
              <motion.div initial={{opacity:0}} animate={{opacity:1}} className="flex flex-col items-center justify-center py-32 bg-white/40 backdrop-blur-md rounded-[3rem] border-2 border-dashed border-white">
                <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center shadow-inner mb-6">
                  <Mail className="text-slate-300" size={32} />
                </div>
                <h3 className="text-xl font-black text-slate-800 uppercase tracking-widest">Request Inbox</h3>
                <p className="text-slate-500 font-medium mt-2 max-w-xs text-center">New requests from students will be visible here after processing.</p>
              </motion.div>
            )}
          </AnimatePresence>

        </main>

        <footer className="p-6 text-center text-slate-400 text-[10px] font-black tracking-[0.3em] border-t border-white/20 bg-white/50 backdrop-blur-sm uppercase">
          © 2026 TPT ICEU BOOK WORLD | SECURE ADMIN DASHBOARD | VERSION 2.0
        </footer>
      </div>
    </div>
  );
}

function SidebarButton({ icon, label, active, onClick }) {
  return (
    <button onClick={onClick} className={`w-full flex items-center gap-4 px-6 py-4 rounded-2xl font-black transition-all ${
      active ? 'bg-orange-500 text-white shadow-xl shadow-orange-500/40 translate-x-1' : 'text-slate-400 hover:text-white hover:bg-white/5'
    }`}>
      {icon} <span className="uppercase text-[11px] tracking-widest">{label}</span>
    </button>
  );
}