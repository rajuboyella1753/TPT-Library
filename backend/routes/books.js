const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const Book = require('../models/Book');
const nodemailer = require('nodemailer');

const storage = multer.diskStorage({
  destination: (req, file, cb) => { cb(null, 'uploads/'); },
  filename: (req, file, cb) => { cb(null, Date.now() + path.extname(file.originalname)); }
});
const upload = multer({ storage: storage });

// POST: Request to Borrow a Book via Email
router.post('/request-book', async (req, res) => {
    const { studentName, studentEmail, bookTitle } = req.body;

    // --- DEBUGGING LOG ---
    console.log("-----------------------------------------");
    console.log("📩 Incoming Request for Book:", bookTitle);
    console.log("👤 From Student:", studentName);

    // 1. Credentials Check
    if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
        console.error("❌ TERMINAL ERROR: EMAIL_USER or EMAIL_PASS is missing in .env file!");
        return res.status(500).json({ message: ".env config missing!" });
    }

    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS
        }
    });

    const mailOptions = {
        from: process.env.EMAIL_USER,
        to: 'rajuboyella737@gmail.com', 
        replyTo: studentEmail,
        subject: `📖 Borrow Request: ${bookTitle} from ${studentName}`,
        html: `
            <div style="font-family: sans-serif; padding: 20px; border: 1px solid #ddd;">
                <h2>New Borrow Request</h2>
                <p><strong>Student:</strong> ${studentName}</p>
                <p><strong>Email:</strong> ${studentEmail}</p>
                <p><strong>Book:</strong> ${bookTitle}</p>
            </div>
        `
    };

    try {
        await transporter.sendMail(mailOptions);
        console.log("✅ TERMINAL SUCCESS: Mail sent to Admin successfully!");
        res.json({ message: "Borrow request sent to Admin! 🙏" });
    } catch (err) {
        // --- IDHI NEE TERMINAL LO ERROR CHUPISTHUNDHI ---
        console.error("❌❌❌ NODEMAILER ERROR DETECTED ❌❌❌");
        console.error("Error Message:", err.message);
        console.error("Full Error Info:", err);
        console.log("-----------------------------------------");

        res.status(500).json({ 
            message: "Mail failed", 
            error: err.message,
            hint: "Check if your App Password is correct and 2FA is enabled."
        });
    }
});

router.post('/', upload.single('image'), async (req, res) => {
  try {
    const { title, author, category, description, status } = req.body; // status add chesa
    const newBook = new Book({
      title, author, category, description, status,
      image: `/uploads/${req.file.filename}`
    });
    await newBook.save();
    res.status(201).json(newBook);
  } catch (err) {
    res.status(500).json({ message: "Server Error" });
  }
});

// Update Book Status API
router.put('/:id', async (req, res) => {
  try {
    const { status } = req.body;
    await Book.findByIdAndUpdate(req.params.id, { status });
    res.json({ message: "Status Updated" });
  } catch (err) { res.status(500).json({ message: "Update Failed" }); }
});

// GET & DELETE same as before...
router.get('/', async (req, res) => {
  try {
    const books = await Book.find().sort({ createdAt: -1 });
    res.json(books);
  } catch (err) { res.status(500).json({ message: "Error" }); }
});

// --- DELETE BOOK API ---
router.delete('/:id', async (req, res) => {
    try {
        await Book.findByIdAndDelete(req.params.id);
        res.json({ message: "Book removed from library forever! 🗑️" });
    } catch (err) {
        res.status(500).json({ message: "Failed to delete the book" });
    }
});

module.exports = router;