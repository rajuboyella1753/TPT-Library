const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const Book = require('../models/Book');
const nodemailer = require('nodemailer');
const Request = require('../models/Request');

const storage = multer.diskStorage({
    destination: (req, file, cb) => { cb(null, 'uploads/'); },
    filename: (req, file, cb) => { cb(null, Date.now() + path.extname(file.originalname)); }
});
const upload = multer({ storage: storage });

// --- 1. POST: Create New Book (COPIES FIX) ---
router.post('/', upload.single('image'), async (req, res) => {
    try {
        const { title, author, category, description, status, totalCopies } = req.body; 
        const copies = parseInt(totalCopies) || 1;

        const newBook = new Book({
            title, author, category, description, status,
            totalCopies: copies,
            availableCopies: copies,
            image: `/uploads/${req.file.filename}`
        });

        await newBook.save();
        res.status(201).json(newBook);
    } catch (err) {
        res.status(500).json({ message: "Server Error" });
    }
});
// --- Update Book Status (Admin Inventory loop kosam) ---
router.put('/:id', async (req, res) => {
    try {
        const { status } = req.body;
        // ఇక్కడ బుక్ ని వెతికి దాని status ని అప్‌డేట్ చేస్తున్నాం
        const updatedBook = await Book.findByIdAndUpdate(
            req.params.id, 
            { status: status }, 
            { new: true }
        );

        if (!updatedBook) return res.status(404).json({ message: "Book not found" });

        res.json({ message: "Status Updated Successfully! ✅", updatedBook });
    } catch (err) {
        console.error("Status Update Error:", err);
        res.status(500).json({ message: "Update Failed" });
    }
});
// --- 2. POST: Request a Book (Student sending request to Admin) ---
// Note: Frontend nundi /api/books/request-book ki call vasthundi
router.post('/request-book', async (req, res) => {
    const { studentName, studentEmail, bookTitle, bookImage, userId } = req.body;

    try {
        // Database lo request create chesthunnam
        const newRequest = new Request({
            studentName,
            studentEmail,
            bookTitle,
            bookImage,
            userId,
            status: 'Pending'
        });
        await newRequest.save();

        // Optional: Admin ki email logic ikkada pettuko mama (nuvvu mundu raasindhe)

        res.json({ message: "Borrow request saved and sent to Admin! 🙏", newRequest });
    } catch (err) {
        console.error("Request Error:", err);
        res.status(500).json({ message: "Request failed" });
    }
});

// --- 3. GET: My Requests (Student Dashboard kosam - 404 FIX) ---
router.get('/my-requests/:email', async (req, res) => {
    try {
        const requests = await Request.find({ studentEmail: req.params.email }).sort({ createdAt: -1 });
        res.json(requests);
    } catch (err) {
        res.status(500).json({ message: "Error fetching your requests" });
    }
});

// --- 4. PUT: Handover (Copies update logic) ---
router.put('/requests/:id/handover', async (req, res) => {
    const { days } = req.body;
    try {
        const request = await Request.findById(req.params.id);
        const book = await Book.findOne({ title: request.bookTitle });

        // Inventory Logic: Copy తగ్గించడం
        if (book && book.availableCopies > 0) {
            book.availableCopies -= 1;
            if (book.availableCopies === 0) book.status = 'Borrowed'; // Stock zero ayithe status marchu
            await book.save();
        }

        const handoverDate = new Date();
        const dueDate = new Date();
        dueDate.setDate(handoverDate.getDate() + parseInt(days));

        request.status = 'HandedOver';
        request.handoverDate = handoverDate;
        request.dueDate = dueDate;
        await request.save();

        res.json({ message: "Handover Success!", request });
    } catch (err) {
        res.status(500).json({ message: "Handover failed" });
    }
});

// --- 5. PUT: Approve Request (Email to Approved status) ---
router.put('/requests/:id/approve', async (req, res) => {
    try {
        const request = await Request.findByIdAndUpdate(req.params.id, { status: 'Approved' }, { new: true });
        res.json({ message: "Approved successfully", request });
    } catch (err) {
        res.status(500).json({ message: "Approval failed" });
    }
});

// --- 6. DELETE: Return Book (Clear Request & Add Copy back) ---
router.delete('/requests/:id/return', async (req, res) => {
    try {
        const request = await Request.findById(req.params.id);
        const book = await Book.findOne({ title: request.bookTitle });

        if (book) {
            book.availableCopies += 1;
            book.status = 'Available'; // Malli stock loki vachindi kabatti
            await book.save();
        }

        await Request.findByIdAndDelete(req.params.id);
        res.json({ message: "Book Returned & Inventory Updated! ✅" });
    } catch (err) {
        res.status(500).json({ message: "Return failed" });
    }
});

// Anni requests Admin kosam
router.get('/requests', async (req, res) => {
    try {
        const requests = await Request.find().sort({ createdAt: -1 });
        res.json(requests);
    } catch (err) { res.status(500).json({ message: "Error" }); }
});

// All Books techevadu
router.get('/', async (req, res) => {
    try {
        const books = await Book.find().sort({ createdAt: -1 });
        res.json(books);
    } catch (err) { res.status(500).json({ message: "Error" }); }
});

module.exports = router;