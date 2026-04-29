import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { UserPlus, User, Mail, Phone, Lock, ChevronDown, ArrowLeft, ShieldCheck, Fingerprint } from 'lucide-react';
import api from '../../api/api';

const RegisterPage = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    userId: '', // Student kosam kotha field
    gender: '',
    roleType: 'student',
    adminLevel: 'admin',
    password: '',
    confirmPassword: ''
  });

  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // --- IKKADA UNDALI MAMA LOGIC (FIXED) ---
  const handleRegister = async (e) => {
    e.preventDefault();

    if (!formData.gender) {
      alert("Please select your gender! ♂/♀");
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      alert("Passwords do not match! ❌");
      return;
    }

    try {
      const registrationData = {
        name: formData.name.trim(),
        gender: formData.gender,
        password: formData.password,
        roleType: formData.roleType,
        // Role batti correct fields pampali backend ki
        email: formData.roleType === 'admin' ? formData.email.toLowerCase().trim() : undefined,
        userId: formData.roleType === 'student' ? formData.userId.trim() : undefined,
        adminLevel: formData.roleType === 'admin' ? formData.adminLevel : undefined,
      };

      const res = await api.post('/auth/register', registrationData);
      alert(res.data.message);
      navigate('/login');
    } catch (err) {
      alert(err.response?.data?.message || "Registration Failed!");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#f0f4f8] relative overflow-hidden p-4 md:p-8">
      <div className="absolute top-[-5%] right-[-5%] w-80 h-80 bg-blue-300 rounded-full blur-[120px] opacity-40"></div>
      <div className="absolute bottom-[-5%] left-[-5%] w-80 h-80 bg-orange-300 rounded-full blur-[120px] opacity-40"></div>

      <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} className="relative z-10 w-full max-w-2xl">
        <div className="bg-white/90 backdrop-blur-2xl p-6 md:p-10 rounded-[2.5rem] shadow-xl border border-white">
          <Link to="/login" className="inline-flex items-center text-sm font-bold text-blue-600 mb-6">
            <ArrowLeft className="w-4 h-4 mr-2" /> Back to Login
          </Link>

          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-14 h-14 bg-gradient-to-br from-blue-600 to-orange-500 rounded-2xl mb-4 text-white shadow-lg">
              <UserPlus className="w-7 h-7" />
            </div>
            <h1 className="text-3xl font-black text-gray-800 tracking-tight">Create Account</h1>
          </div>

          <form onSubmit={handleRegister} className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="md:col-span-2 space-y-1">
              <label className="text-xs font-black text-gray-400 uppercase tracking-widest ml-1">Full Name</label>
              <div className="relative">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input type="text" name="name" placeholder="Enter Full Name" className="w-full pl-12 pr-4 py-3.5 rounded-2xl bg-gray-50 border border-transparent focus:bg-white focus:border-blue-500 outline-none transition-all font-bold" onChange={handleChange} required />
              </div>
            </div>

            <div className="md:col-span-2 space-y-2 mb-2">
              <label className="text-xs font-black text-gray-400 uppercase tracking-widest ml-1">Gender</label>
              <div className="flex gap-4">
                <label className={`flex-1 flex items-center justify-center gap-3 p-3 rounded-2xl border-2 transition-all cursor-pointer font-bold ${formData.gender === 'Male' ? 'bg-blue-50 border-blue-500 text-blue-600 shadow-md' : 'bg-gray-50 border-transparent text-gray-400'}`}>
                  <input type="radio" name="gender" value="Male" checked={formData.gender === 'Male'} onChange={handleChange} className="hidden" />
                  <span>♂ Male</span>
                </label>
                <label className={`flex-1 flex items-center justify-center gap-3 p-3 rounded-2xl border-2 transition-all cursor-pointer font-bold ${formData.gender === 'Female' ? 'bg-pink-50 border-pink-500 text-pink-600 shadow-md' : 'bg-gray-50 border-transparent text-gray-400'}`}>
                  <input type="radio" name="gender" value="Female" checked={formData.gender === 'Female'} onChange={handleChange} className="hidden" />
                  <span>♀ Female</span>
                </label>
              </div>
            </div>

            <div className="md:col-span-2 space-y-1">
              <label className="text-xs font-black text-gray-400 uppercase tracking-widest ml-1">
                {formData.roleType === 'student' ? 'Assign User ID' : 'Official Email Address'}
              </label>
              <div className="relative">
                {formData.roleType === 'student' ? (
                  <>
                    <Fingerprint className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-indigo-500" />
                    <input type="text" name="userId" placeholder="Create a unique User ID (e.g. Raju123)" className="w-full pl-12 pr-4 py-3.5 rounded-2xl bg-gray-50 border border-transparent focus:bg-white focus:border-indigo-500 outline-none transition-all font-bold" onChange={handleChange} required />
                  </>
                ) : (
                  <>
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-orange-500" />
                    <input type="email" name="email" placeholder="admin@example.com" className="w-full pl-12 pr-4 py-3.5 rounded-2xl bg-gray-50 border border-transparent focus:bg-white focus:border-orange-500 outline-none transition-all font-bold" onChange={handleChange} required />
                  </>
                )}
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-black text-gray-400 uppercase tracking-widest ml-1">Role</label>
              <div className="relative">
                <ShieldCheck className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <select name="roleType" className="w-full pl-12 pr-10 py-3.5 rounded-2xl bg-gray-50 border border-transparent focus:bg-white outline-none appearance-none font-black text-gray-700 cursor-pointer" value={formData.roleType} onChange={handleChange}>
                  <option value="student">Student</option>
                  <option value="admin">Admin / Staff</option>
                </select>
                <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              </div>
            </div>

            {formData.roleType === 'admin' && (
              <motion.div 
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                className="md:col-span-2 p-5 bg-orange-50 rounded-[2rem] border border-orange-100 flex items-center justify-around mb-2"
              >
                <label className="flex items-center space-x-3 cursor-pointer group">
                  <input type="radio" name="adminLevel" value="admin" className="w-4 h-4 accent-orange-600" checked={formData.adminLevel === 'admin'} onChange={handleChange} />
                  <span className="font-bold text-orange-800 group-hover:text-orange-600 transition-colors">Staff Admin</span>
                </label>
                <label className="flex items-center space-x-3 cursor-pointer group">
                  <input type="radio" name="adminLevel" value="super-admin" className="w-4 h-4 accent-orange-600" checked={formData.adminLevel === 'super-admin'} onChange={handleChange} />
                  <span className="font-bold text-orange-800 group-hover:text-orange-600 transition-colors">Supreme Admin</span>
                </label>
              </motion.div>
            )}

            <div className="space-y-1">
              <label className="text-xs font-black text-gray-400 uppercase tracking-widest ml-1">Password</label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input type="password" name="password" placeholder="••••••••" className="w-full pl-12 pr-4 py-3.5 rounded-2xl bg-gray-50 border border-transparent focus:bg-white outline-none font-bold" onChange={handleChange} required />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-black text-gray-400 uppercase tracking-widest ml-1">Confirm</label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input type="password" name="confirmPassword" placeholder="••••••••" className="w-full pl-12 pr-4 py-3.5 rounded-2xl bg-gray-50 border border-transparent focus:bg-white outline-none font-bold" onChange={handleChange} required />
              </div>
            </div>

            <div className="md:col-span-2 pt-4">
              <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} type="submit" className="w-full py-5 bg-slate-900 text-white font-black rounded-2xl shadow-xl shadow-slate-200 uppercase tracking-[0.3em] text-sm">
                Register Seeker
              </motion.button>
            </div>
          </form>
        </div>
      </motion.div>
    </div>
  );
};

export default RegisterPage;