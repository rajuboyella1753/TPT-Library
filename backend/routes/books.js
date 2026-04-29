const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const Book = require('../models/Book');
const Request = require('../models/Request');

const storage = multer.diskStorage({
    destination: (req, file, cb) => { cb(null, 'uploads/'); },
    filename: (req, file, cb) => { cb(null, Date.now() + path.extname(file.originalname)); }
});
const upload = multer({ storage: storage });

// --- 1. POST: Create New Book ---
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

// --- Update Book Status ---
router.put('/:id', async (req, res) => {
    try {
        const { status } = req.body;
        const updatedBook = await Book.findByIdAndUpdate(
            req.params.id, 
            { status: status }, 
            { new: true }
        );
        if (!updatedBook) return res.status(404).json({ message: "Book not found" });
        res.json({ message: "Status Updated Successfully! ✅", updatedBook });
    } catch (err) {
        res.status(500).json({ message: "Update Failed" });
    }
});

// --- 2. POST: Request a Book ---
router.post('/request-book', async (req, res) => {
    const { studentName, userId, bookTitle, bookImage } = req.body;

    try {
        const newRequest = new Request({
            studentName,
            studentId: userId, // Mapping frontend userId to database studentId
            bookTitle,
            bookImage,
            status: 'Pending'
        });
        
        await newRequest.save(); 
        res.json({ message: "Borrow request saved and sent to Admin! 🙏", newRequest });
    } catch (err) {
        console.error("Request Error:", err);
        res.status(500).json({ message: "Request failed!" });
    }
});

// --- 3. GET: My Requests (FIXED: Unified single route with correct database field) ---
router.get('/my-requests/:id', async (req, res) => {
    try {
        const identifier = req.params.id;
        // Database field name 'studentId' (from your screenshot)
        // We search using the ID passed from frontend (Raju123)
        const requests = await Request.find({ studentId: identifier }).sort({ createdAt: -1 });
        res.json(requests);
    } catch (err) {
        res.status(500).json({ message: "Server Error fetching requests" });
    }
});

// --- 4. PUT: Handover ---
router.put('/requests/:id/handover', async (req, res) => {
    const { days } = req.body;
    try {
        const request = await Request.findById(req.params.id);
        const book = await Book.findOne({ title: request.bookTitle });

        if (book && book.availableCopies > 0) {
            book.availableCopies -= 1;
            if (book.availableCopies === 0) book.status = 'Borrowed';
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

// --- 5. Approve Request ---
router.put('/requests/:id/approve', async (req, res) => {
    try {
        const request = await Request.findByIdAndUpdate(req.params.id, { status: 'Approved' }, { new: true });
        res.json({ message: "Approved successfully", request });
    } catch (err) {
        res.status(500).json({ message: "Approval failed" });
    }
});

// --- 6. DELETE: Return Book ---
router.delete('/requests/:id/return', async (req, res) => {
    try {
        const request = await Request.findById(req.params.id);
        const book = await Book.findOne({ title: request.bookTitle });

        if (book) {
            book.availableCopies += 1;
            book.status = 'Available';
            await book.save();
        }

        await Request.findByIdAndDelete(req.params.id);
        res.json({ message: "Book Returned & Inventory Updated! ✅" });
    } catch (err) {
        res.status(500).json({ message: "Return failed" });
    }
});

// Admin All Requests
router.get('/requests', async (req, res) => {
    try {
        const requests = await Request.find().sort({ createdAt: -1 });
        res.json(requests);
    } catch (err) { res.status(500).json({ message: "Error" }); }
});

// All Books
router.get('/', async (req, res) => {
    try {
        const books = await Book.find().sort({ createdAt: -1 });
        res.json(books);
    } catch (err) { res.status(500).json({ message: "Error" }); }
});

module.exports = router;