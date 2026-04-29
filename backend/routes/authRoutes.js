const express = require('express');
const router = express.Router();
const User = require('../models/User');
const jwt = require('jsonwebtoken');

// Case sensitive lekunda emails ni check cheyadaniki anni lowercase lo uncha
const RESTRICTED_EMAILS = ["elohim2026@gmail.com", "goutamashok49@gmail.com"];

// --- REGISTER API ---
// --- REGISTER API ---
router.post('/register', async (req, res) => {
    try {
        const { name, email, userId, gender, roleType, adminLevel, password } = req.body;
        
        const finalRole = roleType === 'admin' ? adminLevel : 'student';

        // 1. Validation Logic Based on Role
        let query = {};
        if (roleType === 'student') {
            // Student ki email avasaram ledhu, userId chalu
            if (!userId) return res.status(400).json({ message: "User ID is required for Students!" });
            query = { userId: userId.trim() };
        } else {
            // Admin register ayyetappudu mathrame email check cheyyali
            if (!email) return res.status(400).json({ message: "Email is required for Admins!" });
            
            const lowerEmail = email.toLowerCase().trim();
            query = { email: lowerEmail };

            // Restriction list check (Optional but good to have)
            const RESTRICTED_EMAILS = ["elohim2026@gmail.com", "goutamashok49@gmail.com"];
            // Oka vela kotha admins restricted list lo lekunte vallaki direct access ivvakudadhu (Pending lo untaru)
        }

        // 2. User already exists check
        let existingUser = await User.findOne(query);
        if (existingUser) return res.status(400).json({ message: "User ID or Email already exists!" });

        // 3. New User Instance
       // backend/routes/authRoutes.js
const newUser = new User({
    name: name.trim(),
    gender,
    password,
    role: finalRole,
    // Role admin అయితేనే email పంపాలి, student కి 'undefined' పంపాలి
    email: roleType === 'admin' ? email.toLowerCase().trim() : undefined, 
    userId: roleType === 'student' ? userId.trim() : undefined,
});

        await newUser.save();
        res.status(201).json({ message: "Registration successful! Wait for Admin approval. 🙏" });

    } catch (err) {
        console.error("Register Error:", err);
        res.status(500).json({ message: "Server Error during registration" });
    }
});
// --- LOGIN API (Supporting Email or UserID) ---
router.post('/login', async (req, res) => {
  try {
    const { loginId, password } = req.body;

    if (!loginId || !password) {
      return res.status(400).json({ message: "Please enter both ID/Email and Password" });
    }

    const cleanId = loginId.trim();

    // Check email (Admins) OR userId (Students)
    // toLowerCase() kevalam email ki mathrame apply cheyalii
    const user = await User.findOne({
      $or: [
        { email: cleanId.toLowerCase() }, 
        { userId: cleanId } 
      ]
    });

    if (!user) return res.status(400).json({ message: "User not found!" });

    // Approval Check
    if (user.role !== 'super-admin' && !user.isApproved) {
      return res.status(403).json({ message: "Wait for Super Admin approval!" });
    }

    // Plain text password match check
    if (password !== user.password) {
      return res.status(400).json({ message: "Wrong Password!" });
    }

    const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '1d' });

    res.json({ 
      token, 
      user: { _id: user._id, name: user.name, role: user.role, email: user.email, userId: user.userId } 
    });

  } catch (err) {
    res.status(500).json({ message: "Server Error" });
  }
});

// GET ALL Users (Pending + Approved) for Super Admin
router.get('/all-users', async (req, res) => {
    try {
        const { role } = req.query; 
        let query = {};
        if (role === 'admin') { query.role = 'admin'; } else { query.role = 'student'; }
        const users = await User.find(query).sort({ isApproved: 1, createdAt: -1 }).select('-password');
        res.json(users);
    } catch (err) { res.status(500).json({ message: "Server Error" }); }
});

// GET PENDING USERS
router.get('/pending-users', async (req, res) => {
    try {
        const { role } = req.query;
        let query = { isApproved: false };
        if (role === 'admin') { query.role = 'admin'; } else { query.role = 'student'; }
        const users = await User.find(query).select('-password');
        res.json(users);
    } catch (err) { res.status(500).json({ message: "Server Error" }); }
});

// APPROVE/DISAPPROVE/REJECT USER
router.put('/approve-user/:id', async (req, res) => {
    try {
        const { status } = req.body;
        
        if (status === 'approve') {
            await User.findByIdAndUpdate(req.params.id, { isApproved: true });
            res.json({ message: "User Approved Successfully! ✅" });
        } else if (status === 'disapprove') {
            // Malli pending loki pampadam (Access Block)
            await User.findByIdAndUpdate(req.params.id, { isApproved: false });
            res.json({ message: "User Access Revoked! ❌" });
        } else {
            // Mothanike delete cheyadam (Reject)
            await User.findByIdAndDelete(req.params.id);
            res.json({ message: "User Rejected and Deleted! 🗑️" });
        }
    } catch (err) {
        res.status(500).json({ message: "Server Error" });
    }
});

// --- FORGOT / RESET PASSWORD API ---
router.post('/reset-password', async (req, res) => {
    try {
        const { loginId, newPassword } = req.body;
        const cleanId = loginId.trim();

        // Step 1: User ni vethukuthunnam (Email or UserID)
        const user = await User.findOne({
            $or: [
                { email: cleanId.toLowerCase() },
                { userId: cleanId }
            ]
        });

        if (!user) {
            return res.status(404).json({ message: "User not found! Please check your ID/Email." });
        }

        // Step 2: Password update (Plain text as per your current logic)
        user.password = newPassword;
        await user.save();

        res.status(200).json({ message: "Password updated successfully! ✅" });
    } catch (err) {
        console.error("Reset Password Error:", err);
        res.status(500).json({ message: "Server Error during password reset" });
    }
});

module.exports = router;