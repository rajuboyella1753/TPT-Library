const express = require('express');
const router = express.Router();
const User = require('../models/User');

router.post('/toggle', async (req, res) => {
    try {
        const { userId, bookId } = req.body;

        // ఇక్కడ యూజర్ ని వెతకాలి
        const user = await User.findById(userId);
        if (!user) return res.status(404).json({ message: "User not found" });

        // ఒకవేళ విష్‌లిస్ట్ లో బుక్ ఉంటే తీసేయ్, లేకపోతే యాడ్ చెయ్
        if (user.wishlist.includes(bookId)) {
            user.wishlist = user.wishlist.filter(id => id.toString() !== bookId);
        } else {
            user.wishlist.push(bookId);
        }

        await user.save();
        // అప్‌డేట్ అయిన విష్‌లిస్ట్ ని వెనక్కి పంపిస్తున్నాం
        res.json({ message: "Wishlist updated", wishlist: user.wishlist });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server Error" });
    }
});

// --- GET USER WISHLIST (Student ID or Object ID based) ---
router.get('/:userId', async (req, res) => {
    try {
        const { userId } = req.params;

        // User ని వెతకాలి (మనం UserId తో వెతుకుతున్నామా లేదా MongoDB ID తోనా అన్నది ముఖ్యం)
        const user = await User.findById(userId).populate('wishlist');
        
        // ఒకవేళ పాత ID ఫార్మాట్ వల్ల దొరకకపోతే.. UserID (Raju123) తో వెతకాలి
        if (!user) {
            const userById = await User.findOne({ userId: userId }).populate('wishlist');
            if (!userById) return res.status(404).json({ message: "User not found" });
            return res.json(userById.wishlist || []);
        }

        res.json(user.wishlist || []);
    } catch (err) {
        console.error("Wishlist Fetch Error Detail:", err);
        res.status(500).json({ message: "Server Error fetching wishlist", error: err.message });
    }
});

module.exports = router;