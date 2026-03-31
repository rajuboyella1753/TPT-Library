const express = require('express');
const router = express.Router();
const User = require('../models/User');
const jwt = require('jsonwebtoken');

// Case sensitive lekunda emails ni check cheyadaniki anni lowercase lo uncha
const RESTRICTED_EMAILS = ["elohim2026@gmail.com", "goutamashok49@gmail.com"];

// --- REGISTER API ---
router.post('/register', async (req, res) => {
    try {
        const { name, email, mobile, roleType, adminLevel, password } = req.body;
        
        // Input email ni lowercase ki marchi check cheyyali
        const lowerEmail = email.toLowerCase();
        const finalRole = roleType === 'admin' ? adminLevel : 'student';

        // 1. Restriction: Kevalam restricted list lo unnavalle Admin avvagalaru
        if ((finalRole === 'admin' || finalRole === 'super-admin') && !RESTRICTED_EMAILS.includes(lowerEmail)) {
            return res.status(403).json({ message: "Access Denied! Your email is not authorized for Admin role." });
        }

        let user = await User.findOne({ email: lowerEmail });
        if (user) return res.status(400).json({ message: "User already exists!" });

        const newUser = new User({
            name,
            email: lowerEmail,
            mobile,
            role: finalRole,
            password: password, // Plain text as requested
            // Elohim ki direct approval, migilina vallaki false
            isApproved: lowerEmail === "elohim2026@gmail.com" ? true : false 
        });

        await newUser.save();
        res.status(201).json({ message: "Registration successful! Admin will approve your account soon." });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server Error" });
    }
});

// --- LOGIN API ---
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        const lowerEmail = email.toLowerCase();
        const user = await User.findOne({ email: lowerEmail });

        if (!user) return res.status(400).json({ message: "Invalid Credentials" });

        // Approval Check
        if (user.role !== 'super-admin' && !user.isApproved) {
            return res.status(403).json({ message: "Wait! Your account is not approved by Super Admin yet." });
        }

        if (password !== user.password) {
          return res.status(400).json({ message: "Invalid Credentials" });
        }

        const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '1d' });

        res.json({ 
            token, 
            user: { 
                _id: user._id,  
                name: user.name, 
                role: user.role, 
                email: user.email 
            } 
        });

    } catch (err) {
        res.status(500).json({ message: "Server Error" });
    }
});
// GET ALL Users (Pending + Approved) for Super Admin
router.get('/all-users', async (req, res) => {
    try {
        const { role } = req.query; // 'admin' or 'student'
        let query = {};
        
        if (role === 'admin') {
            query.role = 'admin'; 
        } else {
            query.role = 'student';
        }

        // isApproved: false unnollu paina (Top) vachela sort chestundi
        const users = await User.find(query).sort({ isApproved: 1, createdAt: -1 }).select('-password');
        res.json(users);
    } catch (err) {
        res.status(500).json({ message: "Server Error" });
    }
});
// --- GET PENDING USERS (For Super Admin Dashboard) ---
router.get('/pending-users', async (req, res) => {
    try {
        const { role } = req.query; // Dashboard nundi 'admin' or 'student' query vasthundi
        
        let query = { isApproved: false };
        
        if (role === 'admin') {
            // Pending admins ante roles lo 'admin' unna vallu
            query.role = 'admin'; 
        } else {
            query.role = 'student';
        }

        const users = await User.find(query).select('-password');
        res.json(users);
    } catch (err) {
        res.status(500).json({ message: "Server Error" });
    }
});

// --- APPROVE/REJECT USER ---
router.put('/approve-user/:id', async (req, res) => {
    try {
        const { status } = req.body; // Dashboard 'approve' or 'reject' pampisthundi
        
        if (status === 'approve') {
            await User.findByIdAndUpdate(req.params.id, { isApproved: true });
            res.json({ message: "User Approved Successfully!" });
        } else {
            await User.findByIdAndDelete(req.params.id);
            res.json({ message: "User Rejected and Deleted!" });
        }
    } catch (err) {
        res.status(500).json({ message: "Server Error" });
    }
});
// --- FORGOT/RESET PASSWORD API ---
router.post('/reset-password', async (req, res) => {
    try {
        const { email, newPassword } = req.body;
        const lowerEmail = email.toLowerCase();

        // 1. User unnado ledo check cheyyali
        const user = await User.findOne({ email: lowerEmail });
        if (!user) {
            return res.status(404).json({ message: "No user found with this email address!" });
        }

        // 2. Password update cheyyali (Plain text nuvvu adigina vidhanga)
        user.password = newPassword;
        await user.save();

        res.status(200).json({ message: "Password updated successfully! Please login now." });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server Error" });
    }
});
module.exports = router;