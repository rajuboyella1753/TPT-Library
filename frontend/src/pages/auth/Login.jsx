import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion'; // AnimatePresence add chesa
import { BookOpen, User, Mail, Lock, ChevronDown, X } from 'lucide-react'; // X icon add chesa
import api from '../../api/api';

const LoginPage = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    role: 'student',
    password: ''
  });

  const [showForgotModal, setShowForgotModal] = useState(false);
  const [resetData, setResetData] = useState({ email: '', newPassword: '' });

  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post('/auth/reset-password', resetData);
      alert(res.data.message);
      setShowForgotModal(false);
      setResetData({ email: '', newPassword: '' });
    } catch (err) {
      alert(err.response?.data?.message || "Failed to reset password");
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post('/auth/login', {
        email: formData.email,
        password: formData.password
      });

      const { token, user } = res.data;
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));

      alert(`Welcome back, ${user.name}! Login Successful.`);

      if (user.role === 'super-admin') {
        navigate('/super-admin');
      } else if (user.role === 'admin') {
        navigate('/admin');
      } else {
        navigate('/student');
      }
    } catch (err) {
      const errorMsg = err.response?.data?.message || "Invalid Credentials!";
      alert(errorMsg);
    }
  };

  return (
    <> {/* <--- Idhi Fragment, rendered content motham deeni lopale undali */}
      <div className="min-h-screen flex items-center justify-center bg-[#f8faff] relative overflow-hidden p-4">
        <div className="absolute top-[-10%] left-[-10%] w-72 h-72 bg-orange-200 rounded-full blur-3xl opacity-50 animate-pulse"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-96 h-96 bg-blue-200 rounded-full blur-3xl opacity-50 animate-pulse"></div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="relative z-10 w-full max-w-lg"
        >
          <div className="bg-white/80 backdrop-blur-xl p-8 md:p-12 rounded-[2.5rem] shadow-[0_20px_50px_rgba(0,0,0,0.1)] border border-white">
            <div className="text-center mb-10">
              <motion.div 
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-tr from-orange-500 to-blue-600 rounded-2xl mb-4 shadow-lg"
              >
                <BookOpen className="text-white w-8 h-8" />
              </motion.div>
              <h1 className="text-3xl md:text-4xl font-black text-gray-800 tracking-tight">
                Elahi <span className="text-orange-500">Book</span> <span className="text-blue-600">Stall</span>
              </h1>
              <p className="text-gray-500 mt-2 font-medium">Welcome back! Please login to continue</p>
            </div>

            <form onSubmit={handleLogin} className="space-y-5">
              <div className="group">
                <label className="block text-sm font-bold text-gray-700 mb-1.5 ml-1 italic">Email Address</label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-blue-500 transition-colors" />
                  <input
                    type="email"
                    name="email"
                    placeholder="mail@example.com"
                    className="w-full pl-12 pr-5 py-3.5 rounded-2xl bg-gray-50 border border-transparent focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all outline-none font-medium"
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="group">
                  <label className="block text-sm font-bold text-gray-700 mb-1.5 ml-1 italic">Role</label>
                  <div className="relative">
                    <select
                      name="role"
                      className="w-full px-4 py-3.5 rounded-2xl bg-gray-50 border border-transparent focus:bg-white focus:border-orange-500 focus:ring-4 focus:ring-orange-100 transition-all outline-none appearance-none cursor-pointer font-bold text-gray-600"
                      value={formData.role}
                      onChange={handleChange}
                    >
                      <option value="student">Student</option>
                      <option value="admin">Admin</option>
                      <option value="super-admin">Super Admin</option>
                    </select>
                    <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                  </div>
                </div>

                <div className="group">
                  <label className="block text-sm font-bold text-gray-700 mb-1.5 ml-1 italic">Password</label>
                  <div className="relative">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-blue-600 transition-colors" />
                    <input
                      type="password"
                      name="password"
                      placeholder="••••••••"
                      className="w-full pl-12 pr-5 py-3.5 rounded-2xl bg-gray-50 border border-transparent focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all outline-none font-medium"
                      onChange={handleChange}
                      required
                    />
                  </div>
                </div>
              </div>

              <div className="text-right">
                <button 
                  type="button"
                  onClick={() => setShowForgotModal(true)}
                  className="text-xs font-bold text-gray-400 hover:text-orange-500 transition-all italic"
                >
                  Forgot Password?
                </button>
              </div>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type="submit"
                className="w-full py-4 mt-4 bg-gradient-to-r from-orange-500 via-orange-600 to-blue-700 text-white font-bold rounded-2xl shadow-[0_10px_30px_rgba(249,115,22,0.3)] hover:shadow-orange-400/40 transition-all duration-300 text-lg tracking-wider"
              >
                SIGN IN
              </motion.button>
            </form>

            <div className="mt-8 text-center border-t border-gray-100 pt-6">
              <p className="text-gray-500 font-medium">
                New here?{' '}
                <Link to="/register" className="text-blue-600 font-bold hover:text-orange-600 transition-all">
                  Create an account
                </Link>
              </p>
            </div>
          </div>
        </motion.div>
      </div>

      {/* --- Forgot Password Modal --- */}
      <AnimatePresence>
        {showForgotModal && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm text-slate-800">
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="bg-white w-full max-w-md p-8 rounded-[2rem] shadow-2xl relative"
            >
              <button onClick={() => setShowForgotModal(false)} className="absolute top-6 right-6 text-gray-400 hover:text-red-500 transition-colors">
                <X size={24} />
              </button>

              <h2 className="text-2xl font-black text-gray-800 mb-2 italic tracking-tight">Reset Password</h2>
              <p className="text-gray-500 text-sm mb-6 font-medium">Enter your email and a fresh password.</p>

              <form onSubmit={handleResetPassword} className="space-y-4">
                <input
                  type="email"
                  placeholder="Registered Email"
                  className="w-full px-5 py-3.5 rounded-xl bg-gray-50 border border-slate-100 outline-none focus:ring-4 focus:ring-orange-100 transition-all font-medium"
                  onChange={(e) => setResetData({...resetData, email: e.target.value})}
                  required
                />
                <input
                  type="password"
                  placeholder="New Strong Password"
                  className="w-full px-5 py-3.5 rounded-xl bg-gray-50 border border-slate-100 outline-none focus:ring-4 focus:ring-orange-100 transition-all font-medium"
                  onChange={(e) => setResetData({...resetData, newPassword: e.target.value})}
                  required
                />
                <button type="submit" className="w-full py-4 bg-slate-900 text-white font-black rounded-xl hover:bg-orange-600 shadow-lg transition-all uppercase tracking-widest text-xs">
                  UPDATE PASSWORD
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
};

export default LoginPage;