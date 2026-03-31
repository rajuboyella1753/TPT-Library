import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { UserPlus, User, Mail, Phone, Lock, ChevronDown, ArrowLeft, ShieldCheck } from 'lucide-react';
import api from '../../api/api';

const RegisterPage = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    mobile: '',
    roleType: 'student',
    adminLevel: 'admin',
    password: '',
    confirmPassword: ''
  });

  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      alert("Passwords do not match!");
      return;
    }
    try {
      const res = await api.post('/auth/register', formData);
      alert(res.data.message);
      navigate('/login');
    } catch (err) {
      const errorMsg = err.response?.data?.message || "Something went wrong!";
      alert(errorMsg);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#f0f4f8] relative overflow-hidden p-4 md:p-8">
      <div className="absolute top-[-5%] right-[-5%] w-80 h-80 bg-blue-300 rounded-full blur-[120px] opacity-40"></div>
      <div className="absolute bottom-[-5%] left-[-5%] w-80 h-80 bg-orange-300 rounded-full blur-[120px] opacity-40"></div>

      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative z-10 w-full max-w-2xl"
      >
        <div className="bg-white/90 backdrop-blur-2xl p-6 md:p-10 rounded-[2.5rem] shadow-xl border border-white">
          <Link to="/login" className="inline-flex items-center text-sm font-bold text-blue-600 mb-6">
            <ArrowLeft className="w-4 h-4 mr-2" /> Back to Login
          </Link>

          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-14 h-14 bg-gradient-to-br from-blue-600 to-orange-500 rounded-2xl mb-4 text-white">
              <UserPlus className="w-7 h-7" />
            </div>
            <h1 className="text-3xl font-black text-gray-800">Join Elahi Book Stall</h1>
          </div>

          <form onSubmit={handleRegister} className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-xs font-bold text-gray-500">Full Name</label>
              <div className="relative">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input type="text" name="name" placeholder="Name" className="w-full pl-12 pr-4 py-3 rounded-xl bg-gray-50 border outline-none" onChange={handleChange} required />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-gray-500">Email</label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input type="email" name="email" placeholder="Email" className="w-full pl-12 pr-4 py-3 rounded-xl bg-gray-50 border outline-none" onChange={handleChange} required />
              </div>
            </div>

            {/* <div className="space-y-1">
              <label className="text-xs font-bold text-gray-500">Mobile</label>
              <div className="relative">
                <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input type="tel" name="mobile" placeholder="9876543210" className="w-full pl-12 pr-4 py-3 rounded-xl bg-gray-50 border outline-none" onChange={handleChange} required />
              </div>
            </div> */}

            <div className="space-y-1">
              <label className="text-xs font-bold text-gray-500">User Type</label>
              <div className="relative">
                <ShieldCheck className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <select name="roleType" className="w-full pl-12 pr-10 py-3 rounded-xl bg-gray-50 border outline-none appearance-none font-bold text-gray-600" value={formData.roleType} onChange={handleChange}>
                  <option value="student">Student</option>
                  <option value="admin">Admin</option>
                </select>
                <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              </div>
            </div>

            {formData.roleType === 'admin' && (
              <div className="md:col-span-2 p-4 bg-orange-50 rounded-xl border border-orange-100">
                <label className="text-xs font-bold text-orange-600">Select Admin Level</label>
                <div className="flex gap-4 mt-2">
                  <label className="flex items-center space-x-2"><input type="radio" name="adminLevel" value="admin" checked={formData.adminLevel === 'admin'} onChange={handleChange} /> <span>Admin</span></label>
                  <label className="flex items-center space-x-2"><input type="radio" name="adminLevel" value="super-admin" checked={formData.adminLevel === 'super-admin'} onChange={handleChange} /> <span>Super Admin</span></label>
                </div>
              </div>
            )}

            <div className="space-y-1">
              <label className="text-xs font-bold text-gray-500">Password</label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input type="password" name="password" placeholder="••••••••" className="w-full pl-12 pr-4 py-3 rounded-xl bg-gray-50 border outline-none" onChange={handleChange} required />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-gray-500">Confirm</label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input type="password" name="confirmPassword" placeholder="••••••••" className="w-full pl-12 pr-4 py-3 rounded-xl bg-gray-50 border outline-none" onChange={handleChange} required />
              </div>
            </div>

            <div className="md:col-span-2 pt-4">
              <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} type="submit" className="w-full py-4 bg-gradient-to-r from-blue-600 to-orange-500 text-white font-black rounded-xl shadow-xl uppercase tracking-widest">
                Create Account
              </motion.button>
            </div>
          </form>
        </div>
      </motion.div>
    </div>
  );
};

export default RegisterPage;